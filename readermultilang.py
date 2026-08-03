import sys
import time
import textwrap
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import threading
import os

# --- Configuración por Grupos Lingüísticos ---
CONFIG_IDIOMAS = {
    # 1. CJK (Logográficos: Chino, Japonés, Coreano)
    "CJK": {
        "fuente": "Microsoft YaHei",
        "size": 32,
        "width": 18,
        "idiomas": ["Chinese", "Japanese", "Korean"]
    },
    # 2. Derecha a Izquierda (RTL: Árabe, Persa, Urdu, Pastún, Hebreo)
    "RTL": {
        "fuente": "Segoe UI",
        "size": 32,
        "width": 38,
        "idiomas": ["Arabic", "Persian", "Urdu", "Pastún", "Hebreo"]
    },
    # 3. Índicos y Sudeste Asiático (Hindi, Bengalí, Tailandés, Birmano, Télugu, Tamil, etc.)
    "INDICO_ASIA": {
        "fuente": "Nirmala UI",
        "size": 30,
        "width": 32,
        "idiomas": [
            "Bengali", "Panyabí-Pakistán", "Panyabí-India", "Télugu", "Tamil", 
            "Tailandés", "Birmano", "Nepalí", "Hindi", "Sundanés"
        ]
    },
    # 4. Ge'ez / Semítico (Amhárico)
    "AMHARICO": {
        "fuente": "Ebrima",
        "size": 30,
        "width": 35,
        "idiomas": ["Amhárico"]
    },
    # 5. Armenio / Mongol
    "OTROS_ALFABETOS": {
        "fuente": "Segoe UI",
        "size": 30,
        "width": 38,
        "idiomas": ["Armenio", "Mongol"]
    },
    # 6. Estándar / Alfabeto Latino y Cirílico (Español, Inglés, Ruso, Ucraniano, etc.)
    "LATINO_CIRILICO": {
        "fuente": "Segoe UI",
        "size": 28,
        "width": 45,
        "idiomas": [] # Por defecto para todos los demás
    }
}

# Lista completa de tus 67 idiomas
LISTA_IDIOMAS = [
    "Spanish", "English", "Italian", "French", "Portuguese", "German", "Polish", "Ukrainian", 
    "Russian", "Dutch", "Chinese", "Japanese", "Korean", "Arabic", "Turkish", "Persian", 
    "Indonesian", "Bengali", "Urdu", "Filipino", "Vietnamese", "Hindi", "Swahili", "Romanian", 
    "Panyabí-Pakistán", "Panyabí-India", "Télugu", "Tamil", "Malayo", "Hausa", "Tailandés", 
    "Yoruba", "Pastún", "Sundanés", "Kurdo", "Birmano", "Amhárico", "Nepalí", "Zulú", 
    "Afrikaans", "Húngaro", "Griego", "Serbio", "Checo", "Sueco", "Catalán", "Hebreo", 
    "Búlgaro", "Albanés", "Bielorruso", "Armenio", "Croata", "Danés", "Mongol", "Eslovaco", 
    "Noruego", "Finlandés", "Lombardo", "Bosnio", "Lituano", "Irlandés", "Esloveno", 
    "Gallego", "Macedonio", "Pangasinán", "Latín", "Estonio"
]

class SimuladorSubtitulos:
    def __init__(self, root):
        self.root = root
        self.root.title("Panel de Control - Subtítulos Multi-Idioma")
        self.root.geometry("480x350")
        self.root.resizable(False, False)

        # Variables de control
        self.escribiendo = False
        self.pausado = False
        self.ruta_archivo = ""
        self.bloques_subtitulos = []
        
        # Parámetros visuales activos
        self.font_family = "Segoe UI"
        self.font_size = 28
        self.ancho_linea = 45
        self.FONT_WEIGHT = "bold"
        self.COLOR_TEXTO = "white"
        self.COLOR_SOMBRA = "black"
        self.DESPLAZAMIENTO_SOMBRA = 3

        # 1. Ventana Externa de Proyección (La que se graba)
        self.ventana_proyeccion = tk.Toplevel(self.root)
        self.ventana_proyeccion.title("PANTALLA DE GRABACIÓN")
        self.ventana_proyeccion.geometry("1000x400")
        self.ventana_proyeccion.configure(bg="#126e47") # Fondo Verde Croma

        self.canvas = tk.Canvas(
            self.ventana_proyeccion,
            bg=self.ventana_proyeccion["bg"],
            highlightthickness=0,
            bd=0
        )
        self.canvas.pack(fill="both", expand=True)

        # 2. Panel de Control GUI
        frame = ttk.Frame(self.root, padding=15)
        frame.pack(fill="both", expand=True)

        # Selector de Idioma
        ttk.Label(frame, text="Idioma del texto:", font=("Segoe UI", 9, "bold")).pack(anchor="w")
        self.combo_idioma = ttk.Combobox(frame, values=LISTA_IDIOMAS, state="readonly")
        self.combo_idioma.set("Spanish")
        self.combo_idioma.pack(fill="x", pady=(2, 10))
        self.combo_idioma.bind("<<ComboboxSelected>>", self.al_cambiar_idioma)

        # Cargar archivo
        self.lbl_archivo = ttk.Label(frame, text="Ningún archivo seleccionado", wraplength=420)
        self.lbl_archivo.pack(fill="x", pady=2)

        self.btn_cargar = ttk.Button(frame, text="📂 Seleccionar Archivo TXT", command=self.seleccionar_archivo)
        self.btn_cargar.pack(fill="x", pady=5)

        ttk.Separator(frame, orient='horizontal').pack(fill='x', pady=8)

        # Botones de Acción
        self.btn_iniciar = ttk.Button(frame, text="▶ Empezar", command=self.iniciar, state="disabled")
        self.btn_iniciar.pack(fill="x", pady=4)

        frame_ctrl = ttk.Frame(frame)
        frame_ctrl.pack(fill="x", pady=4)
        
        self.btn_pausar = ttk.Button(frame_ctrl, text="⏸ Pausar", command=self.alternar_pausa, state="disabled")
        self.btn_pausar.pack(side="left", fill="x", expand=True, padx=(0,4))

        self.btn_reiniciar = ttk.Button(frame_ctrl, text="🔄 Reiniciar", command=self.reiniciar, state="disabled")
        self.btn_reiniciar.pack(side="left", fill="x", expand=True)

        # Aplicar config del idioma por defecto
        self.al_cambiar_idioma()

    def al_cambiar_idioma(self, event=None):
        idioma = self.combo_idioma.get()
        
        # Buscar el grupo al que pertenece el idioma
        config_encontrada = CONFIG_IDIOMAS["LATINO_CIRILICO"] # Default
        for grupo, datos in CONFIG_IDIOMAS.items():
            if idioma in datos["idiomas"]:
                config_encontrada = datos
                break

        self.font_family = config_encontrada["fuente"]
        self.font_size = config_encontrada["size"]
        self.ancho_linea = config_encontrada["width"]

        # Si ya hay un archivo cargado, recalcular los bloques con el nuevo ancho
        if self.ruta_archivo:
            self.preprocesar_texto()

    def seleccionar_archivo(self):
        archivo = filedialog.askopenfilename(
            title="Seleccionar archivo de texto",
            filetypes=[("Archivos de texto (*.txt)", "*.txt"), ("Todos los archivos", "*.*")]
        )
        if archivo:
            self.ruta_archivo = archivo
            nombre = os.path.basename(archivo)
            self.lbl_archivo.configure(text=f"Archivo: {nombre}")
            self.preprocesar_texto()
            self.btn_iniciar.configure(state="normal")

    def preprocesar_texto(self):
        try:
            with open(self.ruta_archivo, "r", encoding="utf-8") as file:
                texto_completo = file.read()
        except Exception as e:
            messagebox.showerror("Error", f"No se pudo leer el archivo:\n{e}")
            return

        # 1. Unificar saltos de línea
        lineas_limpias = [l.strip() for l in texto_completo.splitlines() if l.strip() != ""]
        texto_unificado = " ".join(lineas_limpias)

        # 2. Formatear en renglones con el ancho dinámico del idioma
        renglones = textwrap.wrap(texto_unificado, width=self.ancho_linea)

        # 3. Agrupar de 2 en 2 para formar los subtítulos
        self.bloques_subtitulos = []
        for i in range(0, len(renglones), 2):
            bloque = renglones[i:i+2]
            self.bloques_subtitulos.append("\n".join(bloque))

    def actualizar_pantalla_con_sombra(self, texto):
        self.canvas.delete("all")
        if not texto: return

        x = self.canvas.winfo_width() / 2
        y = self.canvas.winfo_height() / 2

        fuente_config = (self.font_family, self.font_size, self.FONT_WEIGHT)
        d = self.DESPLAZAMIENTO_SOMBRA

        # Sombra en las 4 esquinas
        self.canvas.create_text(x-d, y-d, text=texto, font=fuente_config, fill=self.COLOR_SOMBRA, justify="center", anchor="center")
        self.canvas.create_text(x+d, y-d, text=texto, font=fuente_config, fill=self.COLOR_SOMBRA, justify="center", anchor="center")
        self.canvas.create_text(x-d, y+d, text=texto, font=fuente_config, fill=self.COLOR_SOMBRA, justify="center", anchor="center")
        self.canvas.create_text(x+d, y+d, text=texto, font=fuente_config, fill=self.COLOR_SOMBRA, justify="center", anchor="center")

        # Texto Principal
        self.canvas.create_text(x, y, text=texto, font=fuente_config, fill=self.COLOR_TEXTO, justify="center", anchor="center")

    def iniciar(self):
        if not self.escribiendo and self.bloques_subtitulos:
            self.escribiendo = True
            self.pausado = False
            self.combo_idioma.configure(state="disabled")
            self.btn_cargar.configure(state="disabled")
            self.btn_iniciar.configure(state="disabled")
            self.btn_pausar.configure(state="normal", text="⏸ Pausar")
            self.btn_reiniciar.configure(state="normal")
            
            self.ventana_proyeccion.update_idletasks()
            self.hilo_escritura = threading.Thread(target=self.bucle_escritura, daemon=True)
            self.hilo_escritura.start()

    def alternar_pausa(self):
        self.pausado = not self.pausado
        self.btn_pausar.configure(text="▶ Continuar" if self.pausado else "⏸ Pausar")

    def reiniciar(self):
        self.escribiendo = False
        self.pausado = False
        self.actualizar_pantalla_con_sombra("")
        self.combo_idioma.configure(state="readonly")
        self.btn_cargar.configure(state="normal")
        self.btn_iniciar.configure(state="normal" if self.ruta_archivo else "disabled")
        self.btn_pausar.configure(state="disabled", text="⏸ Pausar")
        self.btn_reiniciar.configure(state="disabled")

    def bucle_escritura(self):
        VELOCIDAD_BASE = 0.050
        PAUSA_PUNTO = 0.600
        PAUSA_COMA = 0.300
        TIEMPO_LECTURA_BLOQUE = 3.0

        # Signos de puntuación universales (Latino, Árabe, CJK, Índico)
        SIGNOS_PUNTO = ['.', '?', '!', ':', '。', '？', '！', '।', '؟']
        SIGNOS_COMA = [',', ';', '，', '；', '،', '、']

        for bloque in self.bloques_subtitulos:
            if not self.escribiendo: break

            texto_acumulado = ""

            for caracter in bloque:
                while self.pausado:
                    if not self.escribiendo: break
                    time.sleep(0.1)

                if not self.escribiendo: break

                texto_acumulado += caracter
                self.root.after(0, self.actualizar_pantalla_con_sombra, texto_acumulado)

                # Detección multilingüe de signos de puntuación
                if caracter in SIGNOS_PUNTO:
                    pausa = PAUSA_PUNTO
                elif caracter in SIGNOS_COMA:
                    pausa = PAUSA_COMA
                elif caracter == '\n':
                    pausa = 0.1
                else:
                    pausa = VELOCIDAD_BASE

                time.sleep(pausa)

            if self.escribiendo:
                time.sleep(TIEMPO_LECTURA_BLOQUE)

        self.root.after(0, self.reiniciar)

if __name__ == "__main__":
    root = tk.Tk()
    try:
        style = ttk.Style()
        style.theme_use('clam')
    except:
        pass
        
    app = SimuladorSubtitulos(root)
    root.mainloop()