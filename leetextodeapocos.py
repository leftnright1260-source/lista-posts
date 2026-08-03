"""
This program is a simple subtitle simulator built with Python and Tkinter.
It loads a text file, formats its content into wrapped lines, and displays
the text progressively on a dedicated projection window using a typing-style
animation. The simulator processes each character with variable timing based
on punctuation, spacing, and randomness to create a natural reading rhythm.

The interface includes a control panel that allows the user to select a text
file, start the subtitle playback, pause or resume the animation, and reset
the display. The projection window uses a styled text area designed for
screen recording, making the tool useful for creating animated subtitles
for videos or demonstrations.

The program manages playback through a background thread while ensuring
smooth updates to the text widget, and provides basic state controls such
as pause, resume, and restart.
"""
import os
import sys
import time
import random
import textwrap
import tkinter as tk
from tkinter import ttk, filedialog
import threading

class SimuladorSubtitulos:
    def __init__(self, root):
        self.root = root
        self.root.title("Panel de Control - Simulador")
        self.root.geometry("400x230")
        self.root.resizable(False, False)

        # Variables de control de estado
        self.escribiendo = False
        self.pausado = False
        self.ruta_archivo = ""
        self.lineas_formateadas = []

        # 1. Crear Ventana Externa de Proyección (La que se graba)
        self.ventana_proyeccion = tk.Toplevel(self.root)
        self.ventana_proyeccion.title("PANTALLA DE GRABACIÓN")
        self.ventana_proyeccion.geometry("900x500")
        self.ventana_proyeccion.configure(bg="#126e47")

        # Área de texto estilizada para el video
        self.pantalla_texto = tk.Text(
            self.ventana_proyeccion, 
            bg="#025518", 
            fg="white", 
            font=("Consolas", 24, "bold"),
            wrap="none", 
            bd=0, 
            padx=40, 
            pady=40,
            highlightthickness=0
        )
        self.pantalla_texto.pack(fill="both", expand=True)

        # 2. Construir los Botones en el Panel de Control
        frame_botones = ttk.Frame(self.root, padding=15)
        frame_botones.pack(fill="both", expand=True)

        self.lbl_archivo = ttk.Label(frame_botones, text="Ningún archivo seleccionado", wraplength=360)
        self.lbl_archivo.pack(fill="x", pady=(0, 5))

        self.btn_cargar = ttk.Button(frame_botones, text="Seleccionar Archivo TXT", command=self.seleccionar_archivo)
        self.btn_cargar.pack(fill="x", pady=5)

        self.btn_iniciar = ttk.Button(frame_botones, text="Empezar", command=self.iniciar, state="disabled")
        self.btn_iniciar.pack(fill="x", pady=5)

        self.btn_pausar = ttk.Button(frame_botones, text="Pausar / Continuar", command=self.alternar_pausa, state="disabled")
        self.btn_pausar.pack(fill="x", pady=5)

        self.btn_reiniciar = ttk.Button(frame_botones, text="Reiniciar", command=self.reiniciar, state="disabled")
        self.btn_reiniciar.pack(fill="x", pady=5)

    def seleccionar_archivo(self):
        archivo = filedialog.askopenfilename(
            title="Seleccionar archivo de texto",
            filetypes=[("Archivos de texto (*.txt)", "*.txt"), ("Todos los archivos", "*.*")]
        )
        if archivo:
            self.ruta_archivo = archivo
            nombre = os.path.basename(archivo)
            self.lbl_archivo.configure(text=f"Archivo: {nombre}")
            self.cargar_texto()
            self.btn_iniciar.configure(state="normal")

    def cargar_texto(self):
        if not self.ruta_archivo or not os.path.exists(self.ruta_archivo):
            self.lineas_formateadas = ["Error: Archivo no encontrado."]
            return

        with open(self.ruta_archivo, "r", encoding="utf-8") as archivo:
            texto_completo = archivo.read()

        parrafos = texto_completo.split('\n')
        self.lineas_formateadas = []
        for parrafo in parrafos:
            if parrafo.strip() == "":
                self.lineas_formateadas.append("")
            else:
                self.lineas_formateadas.extend(textwrap.wrap(parrafo, width=50))

    def iniciar(self):
        if not self.escribiendo and self.lineas_formateadas:
            self.escribiendo = True
            self.pausado = False
            self.btn_cargar.configure(state="disabled")
            self.btn_iniciar.configure(state="disabled")
            self.btn_pausar.configure(state="normal")
            self.btn_reiniciar.configure(state="normal")
            
            self.hilo_escritura = threading.Thread(target=self.bucle_escritura, daemon=True)
            self.hilo_escritura.start()

    def alternar_pausa(self):
        self.pausado = not self.pausado

    def reiniciar(self):
        self.escribiendo = False
        self.pausado = False
        self.pantalla_texto.delete("1.0", tk.END)
        self.btn_cargar.configure(state="normal")
        self.btn_iniciar.configure(state="normal" if self.ruta_archivo else "disabled")
        self.btn_pausar.configure(state="disabled")
        self.btn_reiniciar.configure(state="disabled")

    def bucle_escritura(self):
        for linea in self.lineas_formateadas:
            if not self.escribiendo: break
            
            if linea == "":
                self.insertar_caracter("\n\n")
                time.sleep(0.5)
                continue

            for caracter in linea:
                while self.pausado:
                    if not self.escribiendo: break
                    time.sleep(0.1)

                if not self.escribiendo: break

                # Inserta el caracter directo sin parpadeos
                self.insertar_caracter(caracter)

                if caracter in ['.', ';', ':', '?', '!']:
                    pausa = 0.5 + random.random() * 0.3
                elif caracter == ',':
                    pausa = 0.3 + random.random() * 0.2
                elif caracter == ' ':
                    pausa = 0.12 + random.random() * 0.1
                else:
                    pausa = 0.04 + random.random() * 0.04

                time.sleep(pausa)

            self.insertar_caracter("\n")
            time.sleep(0.3)

        self.btn_pausar.configure(state="disabled")
        self.btn_cargar.configure(state="normal")

    def insertar_caracter(self, texto):
        # Inserta el texto directamente al final del componente y hace scroll fluido
        self.pantalla_texto.insert(tk.END, texto)
        self.pantalla_texto.see(tk.END)

if __name__ == "__main__":
    root = tk.Tk()
    app = SimuladorSubtitulos(root)
    root.mainloop()
