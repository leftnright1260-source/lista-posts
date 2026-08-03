import sys
import time
import textwrap
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import threading
import os

# --- Configuración por Grupos Lingüísticos ---
CONFIG_IDIOMAS = {
    "CJK": {"fuente": "Microsoft YaHei", "size": 32, "width": 18, "idiomas": ["Chinese", "Japanese", "Korean"]},
    "RTL": {"fuente": "Segoe UI", "size": 32, "width": 38, "idiomas": ["Arabic", "Persian", "Urdu", "Pastún", "Hebreo"]},
    "INDICO_ASIA": {
        "fuente": "Nirmala UI", "size": 30, "width": 32,
        "idiomas": ["Bengali", "Panyabí-Pakistán", "Panyabí-India", "Télugu", "Tamil", "Tailandés", "Birmano", "Nepalí", "Hindi", "Sundanés"]
    },
    "AMHARICO": {"fuente": "Ebrima", "size": 30, "width": 35, "idiomas": ["Amhárico"]},
    "OTROS_ALFABETOS": {"fuente": "Segoe UI", "size": 30, "width": 38, "idiomas": ["Armenio", "Mongol"]},
    "LATINO_CIRILICO": {"fuente": "Segoe UI", "size": 28, "width": 45, "idiomas": []}
}

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

# Tiempos constantes de simulación (en segundos)
VELOCIDAD_BASE = 0.050
PAUSA_PUNTO = 0.600
PAUSA_COMA = 0.300
TIEMPO_LECTURA_BLOQUE = 3.0

SIGNOS_PUNTO = ['.', '?', '!', ':', '。', '？', '！', '।', '؟']
SIGNOS_COMA = [',', ';', '，', '；', '،', '、']

class SimuladorSubtitulos:
    def __init__(self, root):
        self.root = root
        self.root.title("Panel de Control - Subtítulos Pro")
        self.root.geometry("520x460")
        self.root.resizable(False, False)

        # Variables de estado
        self.escribiendo = False
        self.pausado = False
        self.arrastrando_slider = False
        self.ruta_archivo = ""
        self.bloques_subtitulos = []
        self.tiempos_bloques = [] # Duración acumulada por bloque
        self.tiempo_total_segundos = 0
        self.indice_bloque_actual = 0

        # Parámetros visuales
        self.font_family = "Segoe UI"
        self.font_size = 28
        self.ancho_linea = 45
        self.FONT_WEIGHT = "bold"
        self.COLOR_TEXTO = "white"
        self.COLOR_SOMBRA = "black"
        self.DESPLAZAMIENTO_SOMBRA = 3

        # Ventana Externa de Proyección (La que se graba)
        self.ventana_proyeccion = tk.Toplevel(self.root)
        self.ventana_proyeccion.title("PANTALLA DE GRABACIÓN")
        self.ventana_proyeccion.geometry("1000x400")
        self.ventana_proyeccion.configure(bg="#126e47")

        self.canvas = tk.Canvas(
            self.ventana_proyeccion,
            bg=self.ventana_proyeccion["bg"],
            highlightthickness=0,
            bd=0
        )
        self.canvas.pack(fill="both", expand=True)

        # Panel de Control GUI
        frame = ttk.Frame(self.root, padding=15)
        frame.pack(fill="both", expand=True)

        # 1. Selector de Idioma
        ttk.Label(frame, text="Idioma del texto:", font=("Segoe UI", 9, "bold")).pack(anchor="w")
        self.combo_idioma = ttk.Combobox(frame, values=LISTA_IDIOMAS, state="readonly")
        self.combo_idioma.set("Spanish")
        self.combo_idioma.pack(fill="x", pady=(2, 8))
        self.combo_idioma.bind("<<ComboboxSelected>>", self.al_cambiar_idioma)

        # 2. Archivo
        self.lbl_archivo = ttk.Label(frame, text="Ningún archivo seleccionado", wraplength=480)
        self.lbl_archivo.pack(fill="x", pady=2)

        self.btn_cargar = ttk.Button(frame, text="📂 Seleccionar Archivo TXT", command=self.seleccionar_archivo)
        self.btn_cargar.pack(fill="x", pady=5)

        ttk.Separator(frame, orient='horizontal').pack(fill='x', pady=8)

        # 3. BARRA DE TIEMPO / NAVEGACIÓN Y RELOJ
        frame_slider = ttk.LabelFrame(frame, text=" Control de Tiempo y Avance ", padding=8)
        frame_slider.pack(fill="x", pady=5)

        self.slider_var = tk.DoubleVar(value=0)
        self.slider = ttk.Scale(
            frame_slider, 
            from_=0, 
            to=100, 
            orient="horizontal", 
            variable=self.slider_var,
            command=self.al_mover_slider
        )
        self.slider.pack(fill="x")
        self.slider.bind("<ButtonPress-1>", self.al_iniciar_arrastre)
        self.slider.bind("<ButtonRelease-1>", self.al_soltar_arrastre)

        # Información de Tiempo (00:00 / 00:00 - 0%)
        self.lbl_tiempo = ttk.Label(
            frame_slider, 
            text="00:00:00 / 00:00:00 (0%)", 
            font=("Segoe UI", 10, "bold")
        )
        self.lbl_tiempo.pack(anchor="center", pady=(5, 0))

        self.lbl_progreso = ttk.Label(frame_slider, text="Bloque: 0 / 0")
        self.lbl_progreso.pack(anchor="e")

        # 4. Botones de Control
        self.btn_iniciar = ttk.Button(frame, text="▶ Empezar", command=self.iniciar, state="disabled")
        self.btn_iniciar.pack(fill="x", pady=4)

        frame_ctrl = ttk.Frame(frame)
        frame_ctrl.pack(fill="x", pady=4)
        
        self.btn_pausar = ttk.Button(frame_ctrl, text="⏸ Pausar", command=self.alternar_pausa, state="disabled")
        self.btn_pausar.pack(side="left", fill="x", expand=True, padx=(0,4))

        self.btn_reiniciar = ttk.Button(frame_ctrl, text="🔄 Reiniciar", command=self.reiniciar, state="disabled")
        self.btn_reiniciar.pack(side="left", fill="x", expand=True)

        self.al_cambiar_idioma()

    def al_cambiar_idioma(self, event=None):
        idioma = self.combo_idioma.get()
        config_encontrada = CONFIG_IDIOMAS["LATINO_CIRILICO"]
        for grupo, datos in CONFIG_IDIOMAS.items():
            if idioma in datos["idiomas"]:
                config_encontrada = datos
                break

        self.font_family = config_encontrada["fuente"]
        self.font_size = config_encontrada["size"]
        self.ancho_linea = config_encontrada["width"]

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

        lineas_limpias = [l.strip() for l in texto_completo.splitlines() if l.strip() != ""]
        texto_unificado = " ".join(lineas_limpias)
        renglones = textwrap.wrap(texto_unificado, width=self.ancho_linea)

        self.bloques_subtitulos = []
        for i in range(0, len(renglones), 2):
            bloque = renglones[i:i+2]
            self.bloques_subtitulos.append("\n".join(bloque))

        # --- ESTIMACIÓN EXACTA DE TIEMPO ---
        self.tiempos_bloques = []
        tiempo_acumulado = 0.0

        for bloque in self.bloques_subtitulos:
            duracion_bloque = 0.0
            for car in bloque:
                if car in SIGNOS_PUNTO:
                    duracion_bloque += PAUSA_PUNTO
                elif car in SIGNOS_COMA:
                    duracion_bloque += PAUSA_COMA
                elif car == '\n':
                    duracion_bloque += 0.1
                else:
                    duracion_bloque += VELOCIDAD_BASE
            
            duracion_bloque += TIEMPO_LECTURA_BLOQUE
            tiempo_acumulado += duracion_bloque
            self.tiempos_bloques.append(tiempo_acumulado)

        self.tiempo_total_segundos = tiempo_acumulado

        total = len(self.bloques_subtitulos)
        self.slider.configure(to=max(total - 1, 0))
        self.actualizar_etiqueta_progreso(0)

    def formatear_tiempo(self, segundos):
        horas = int(segundos // 3600)
        minutos = int((segundos % 3600) // 60)
        segs = int(segundos % 60)
        if horas > 0:
            return f"{horas:02d}:{minutos:02d}:{segs:02d}"
        else:
            return f"{minutos:02d}:{segs:02d}"

    def actualizar_etiqueta_progreso(self, indice):
        total = len(self.bloques_subtitulos)
        if total == 0:
            self.lbl_tiempo.configure(text="00:00 / 00:00 (0%)")
            self.lbl_progreso.configure(text="Bloque: 0 / 0")
            return

        tiempo_actual = self.tiempos_bloques[indice] if indice < len(self.tiempos_bloques) else self.tiempo_total_segundos
        porcentaje = int((tiempo_actual / max(self.tiempo_total_segundos, 1)) * 100)
        
        t_actual_fmt = self.formatear_tiempo(tiempo_actual)
        t_total_fmt = self.formatear_tiempo(self.tiempo_total_segundos)

        self.lbl_tiempo.configure(text=f"{t_actual_fmt} / {t_total_fmt} ({porcentaje}%)")
        self.lbl_progreso.configure(text=f"Bloque: {indice + 1} / {total}")

    def al_iniciar_arrastre(self, event):
        self.arrastrando_slider = True

    def al_soltar_arrastre(self, event):
        self.arrastrando_slider = False
        if self.bloques_subtitulos:
            nuevo_idx = int(round(self.slider_var.get()))
            self.indice_bloque_actual = nuevo_idx
            bloque_texto = self.bloques_subtitulos[self.indice_bloque_actual]
            self.actualizar_pantalla_con_sombra(bloque_texto)

    def al_mover_slider(self, val):
        if self.arrastrando_slider and self.bloques_subtitulos:
            idx = int(round(float(val)))
            self.actualizar_etiqueta_progreso(idx)
            bloque_texto = self.bloques_subtitulos[idx]
            self.actualizar_pantalla_con_sombra(bloque_texto)

    def actualizar_pantalla_con_sombra(self, texto):
        self.canvas.delete("all")
        if not texto: return

        x = self.canvas.winfo_width() / 2
        y = self.canvas.winfo_height() / 2

        fuente_config = (self.font_family, self.font_size, self.FONT_WEIGHT)
        d = self.DESPLAZAMIENTO_SOMBRA

        self.canvas.create_text(x-d, y-d, text=texto, font=fuente_config, fill=self.COLOR_SOMBRA, justify="center", anchor="center")
        self.canvas.create_text(x+d, y-d, text=texto, font=fuente_config, fill=self.COLOR_SOMBRA, justify="center", anchor="center")
        self.canvas.create_text(x-d, y+d, text=texto, font=fuente_config, fill=self.COLOR_SOMBRA, justify="center", anchor="center")
        self.canvas.create_text(x+d, y+d, text=texto, font=fuente_config, fill=self.COLOR_SOMBRA, justify="center", anchor="center")

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
        self.indice_bloque_actual = 0
        self.slider_var.set(0)
        self.actualizar_etiqueta_progreso(0)
        self.actualizar_pantalla_con_sombra("")
        
        self.combo_idioma.configure(state="readonly")
        self.btn_cargar.configure(state="normal")
        self.btn_iniciar.configure(state="normal" if self.ruta_archivo else "disabled")
        self.btn_pausar.configure(state="disabled", text="⏸ Pausar")
        self.btn_reiniciar.configure(state="disabled")

    def bucle_escritura(self):
        while self.indice_bloque_actual < len(self.bloques_subtitulos):
            if not self.escribiendo: break

            bloque = self.bloques_subtitulos[self.indice_bloque_actual]
            texto_acumulado = ""

            if not self.arrastrando_slider:
                self.root.after(0, self.slider_var.set, self.indice_bloque_actual)
                self.root.after(0, self.actualizar_etiqueta_progreso, self.indice_bloque_actual)

            for caracter in bloque:
                while self.pausado or self.arrastrando_slider:
                    if not self.escribiendo: break
                    time.sleep(0.1)

                if not self.escribiendo: break

                texto_acumulado += caracter
                self.root.after(0, self.actualizar_pantalla_con_sombra, texto_acumulado)

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

            self.indice_bloque_actual += 1

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