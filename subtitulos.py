import sys
import time
import textwrap
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import threading
import os

class SimuladorSubtitulos:
    def __init__(self, root):
        self.root = root
        self.root.title("Panel de Control - Subtítulos Pro")
        self.root.geometry("450x280")
        self.root.resizable(False, False)

        # Variables de control
        self.escribiendo = False
        self.pausado = False
        self.ruta_archivo = ""
        self.bloques_subtitulos = []
        self.texto_actual_en_pantalla = "" # Para redibujar la sombra si cambia de tamaño

        # --- Configuración de Estilo de Subtítulo ---
        self.FONT_FAMILY = "Consolas"
        self.FONT_SIZE = 30
        self.FONT_WEIGHT = "bold"
        self.COLOR_TEXTO = "white"
        self.COLOR_SOMBRA = "black"
        self.DESPLAZAMIENTO_SOMBRA = 3 # Píxeles de grosor de la sombra
        
        # 1. Crear Ventana Externa de Proyección (La que se graba)
        self.ventana_proyeccion = tk.Toplevel(self.root)
        self.ventana_proyeccion.title("PANTALLA DE GRABACIÓN")
        self.ventana_proyeccion.geometry("1000x400")
        # Fondo verde para croma (o cámbialo a white para probar legibilidad)
        self.ventana_proyeccion.configure(bg="#126e47") 

        # En lugar de tk.Text, usamos tk.Canvas para poder dibujar sombras
        self.canvas = tk.Canvas(
            self.ventana_proyeccion,
            bg=self.ventana_proyeccion["bg"],
            highlightthickness=0,
            bd=0
        )
        self.canvas.pack(fill="both", expand=True)

        # 2. Construir los Botones en el Panel de Control
        frame = ttk.Frame(self.root, padding=15)
        frame.pack(fill="both", expand=True)

        self.lbl_archivo = ttk.Label(frame, text="Ningún archivo seleccionado", wraplength=400)
        self.lbl_archivo.pack(fill="x", pady=5)

        self.btn_cargar = ttk.Button(frame, text="📂 Seleccionar Archivo TXT", command=self.seleccionar_archivo)
        self.btn_cargar.pack(fill="x", pady=5)

        ttk.Separator(frame, orient='horizontal').pack(fill='x', pady=10)

        self.btn_iniciar = ttk.Button(frame, text="▶ Empezar", command=self.iniciar, state="disabled")
        self.btn_iniciar.pack(fill="x", pady=5)

        # Frame para botones de control
        frame_ctrl = ttk.Frame(frame)
        frame_ctrl.pack(fill="x", pady=5)
        
        self.btn_pausar = ttk.Button(frame_ctrl, text="⏸ Pausar", command=self.alternar_pausa, state="disabled")
        self.btn_pausar.pack(side="left", fill="x", expand=True, padx=(0,5))

        self.btn_reiniciar = ttk.Button(frame_ctrl, text="🔄 Reiniciar", command=self.reiniciar, state="disabled")
        self.btn_reiniciar.pack(side="left", fill="x", expand=True)

    def seleccionar_archivo(self):
        archivo = filedialog.askopenfilename(
            title="Seleccionar archivo de texto",
            filetypes=[("Archivos de texto", "*.txt"), ("Todos los archivos", "*.*")]
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

        # 1. Limpiar y unificar texto en una sola línea
        lineas_limpias = [l.strip() for l in texto_completo.splitlines() if l.strip() != ""]
        texto_unificado = " ".join(lineas_limpias) # Unimos con espacio

        # 2. Formatear en renglones de máximo 45 caracteres (un poco menos para asegurar que quepa con font más grande)
        renglones = textwrap.wrap(texto_unificado, width=45)

        # 3. Agrupar de 2 en 2 para formar los bloques de subtítulos
        self.bloques_subtitulos = []
        for i in range(0, len(renglones), 2):
            bloque = renglones[i:i+2]
            # Unimos las dos líneas con un salto real \n
            self.bloques_subtitulos.append("\n".join(bloque))

    def actualizar_pantalla_con_sombra(self, texto):
        """
        Dibuja el texto en el canvas duplicándolo para crear efecto de sombra/borde.
        Simula un borde grueso dibujando la sombra en las 4 esquinas diagonales.
        """
        self.canvas.delete("all") # Borrar todo lo anterior
        self.texto_actual_en_pantalla = texto
        
        if not texto: return

        # Coordenadas centrales del canvas
        ancho_c = self.canvas.winfo_width()
        alto_c = self.canvas.winfo_height()
        x = ancho_c / 2
        y = alto_c / 2

        fuente_config = (self.FONT_FAMILY, self.FONT_SIZE, self.FONT_WEIGHT)
        d = self.DESPLAZAMIENTO_SOMBRA

        # --- Dibujar la SOMBRA (en las 4 esquinas diagonales para simular contorno) ---
        # Top-Left
        self.canvas.create_text(x-d, y-d, text=texto, font=fuente_config, fill=self.COLOR_SOMBRA, justify="center", anchor="center")
        # Top-Right
        self.canvas.create_text(x+d, y-d, text=texto, font=fuente_config, fill=self.COLOR_SOMBRA, justify="center", anchor="center")
        # Bottom-Left
        self.canvas.create_text(x-d, y+d, text=texto, font=fuente_config, fill=self.COLOR_SOMBRA, justify="center", anchor="center")
        # Bottom-Right
        self.canvas.create_text(x+d, y+d, text=texto, font=fuente_config, fill=self.COLOR_SOMBRA, justify="center", anchor="center")

        # --- Dibujar el TEXTO PRINCIPAL (encima) ---
        self.canvas.create_text(x, y, text=texto, font=fuente_config, fill=self.COLOR_TEXTO, justify="center", anchor="center")

    def iniciar(self):
        if not self.escribiendo and self.bloques_subtitulos:
            self.escribiendo = True
            self.pausado = False
            self.btn_cargar.configure(state="disabled")
            self.btn_iniciar.configure(state="disabled")
            self.btn_pausar.configure(state="normal", text="⏸ Pausar")
            self.btn_reiniciar.configure(state="normal")
            
            # Asegurarnos que el canvas sabe su tamaño antes de dibujar
            self.ventana_proyeccion.update_idletasks()

            self.hilo_escritura = threading.Thread(target=self.bucle_escritura, daemon=True)
            self.hilo_escritura.start()

    def alternar_pausa(self):
        self.pausado = not self.pausado
        texto_btn = "▶ Continuar" if self.pausado else "⏸ Pausar"
        self.btn_pausar.configure(text=texto_btn)

    def reiniciar(self):
        self.escribiendo = False
        self.pausado = False
        self.actualizar_pantalla_con_sombra("") # Limpiar canvas
        self.btn_cargar.configure(state="normal")
        self.btn_iniciar.configure(state="normal" if self.ruta_archivo else "disabled")
        self.btn_pausar.configure(state="disabled", text="⏸ Pausar")
        self.btn_reiniciar.configure(state="disabled")

    def bucle_escritura(self):
        # Tiempos de pausa estables y naturales (en segundos)
        VELOCIDAD_BASE = 0.050  # Ritmo constante de tipeo por carácter
        PAUSA_PUNTO = 0.600      # Pausa en signos fuertes (., ?, !, :)
        PAUSA_COMA = 0.300       # Pausa en comas y punto-y-coma
        TIEMPO_LECTURA_BLOQUE = 3.0  # Tiempo que quedan las 2 líneas antes de borrar

        for bloque in self.bloques_subtitulos:
            if not self.escribiendo: break

            texto_acumulado = ""

            # Efecto mecanografía para el bloque actual
            for caracter in bloque:
                while self.pausado:
                    if not self.escribiendo: break
                    time.sleep(0.1)

                if not self.escribiendo: break

                texto_acumulado += caracter
                # Redibujamos todo el canvas con el nuevo caracter y su sombra
                # Usamos .after para interactuar con la GUI de forma segura desde el hilo
                self.root.after(0, self.actualizar_pantalla_con_sombra, texto_acumulado)

                # Control de velocidad estable
                if caracter in ['.', '?', '!', ':']:
                    pausa = PAUSA_PUNTO
                elif caracter in [',', ';']:
                    pausa = PAUSA_COMA
                elif caracter == '\n':
                    pausa = 0.1 # Pequeña pausa al saltar a la segunda línea
                else:
                    pausa = VELOCIDAD_BASE

                time.sleep(pausa)

            # Esperar un tiempo suficiente para leer las 2 líneas completas
            if self.escribiendo:
                time.sleep(TIEMPO_LECTURA_BLOQUE)

        # Al finalizar todo
        self.root.after(0, self.reiniciar)

if __name__ == "__main__":
    root = tk.Tk()
    # Usar un tema más moderno si está disponible
    try:
        style = ttk.Style()
        style.theme_use('clam')
    except:
        pass
        
    app = SimuladorSubtitulos(root)
    root.mainloop()
