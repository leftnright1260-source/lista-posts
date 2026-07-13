import os
import sys
import time
import random
import textwrap
import tkinter as tk
from tkinter import ttk
import threading

# Ruta de tu archivo de texto
PATH_ARCHIVO = r"C:\TPWDB\BIN\tjuicio.txt"

class SimuladorSubtitulos:
    def __init__(self, root):
        self.root = root
        self.root.title("Panel de Control - Simulador")
        self.root.geometry("400x200")
        self.root.resizable(False, False)

        # Variables de control de estado
        self.escribiendo = False
        self.pausado = False
        self.lineas_formateadas = []

        # Cargar texto del archivo
        self.cargar_texto()

        # 1. Crear Ventana Externa de Proyección (La que se graba)
        self.ventana_proyeccion = tk.Toplevel(self.root)
        self.ventana_proyeccion.title("PANTALLA DE GRABACIÓN")
        self.ventana_proyeccion.geometry("900x500")
        self.ventana_proyeccion.configure(bg="#0055ff") # Azul croma

        # Área de texto estilizada para el video
        self.pantalla_texto = tk.Text(
            self.ventana_proyeccion, 
            bg="#0055ff", 
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
        frame_botones = ttk.Frame(self.root, padding=20)
        frame_botones.pack(fill="both", expand=True)

        self.btn_iniciar = ttk.Button(frame_botones, text="Empezar", command=self.iniciar)
        self.btn_iniciar.pack(fill="x", pady=5)

        self.btn_pausar = ttk.Button(frame_botones, text="Pausar / Continuar", command=self.alternar_pausa, state="disabled")
        self.btn_pausar.pack(fill="x", pady=5)

        self.btn_reiniciar = ttk.Button(frame_botones, text="Reiniciar", command=self.reiniciar, state="disabled")
        self.btn_reiniciar.pack(fill="x", pady=5)

    def cargar_texto(self):
        if not os.path.exists(PATH_ARCHIVO):
            self.lineas_formateadas = ["Error: Archivo no encontrado."]
            return

        with open(PATH_ARCHIVO, "r", encoding="utf-8") as archivo:
            texto_completo = archivo.read()

        parrafos = texto_completo.split('\n')
        self.lineas_formateadas = []
        for parrafo in parrafos:
            if parrafo.strip() == "":
                self.lineas_formateadas.append("")
            else:
                self.lineas_formateadas.extend(textwrap.wrap(parrafo, width=50))

    def iniciar(self):
        if not self.escribiendo:
            self.escribiendo = True
            self.pausado = False
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
        self.btn_iniciar.configure(state="normal")
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

    def insertar_caracter(self, texto):
        # Inserta el texto directamente al final del componente y hace scroll fluido
        self.pantalla_texto.insert(tk.END, texto)
        self.pantalla_texto.see(tk.END)

if __name__ == "__main__":
    root = tk.Tk()
    app = SimuladorSubtitulos(root)
    root.mainloop()
