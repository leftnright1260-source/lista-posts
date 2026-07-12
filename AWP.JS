<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Procesador Estricto para WordPress</title>
    <style>
        body { font-family: sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; color: #333; }
        textarea { width: 100%; height: 200px; margin-bottom: 15px; padding: 10px; box-sizing: border-box; border: 1px solid #ccc; font-family: monospace; }
        .botones-container { display: flex; gap: 10px; margin-bottom: 15px; }
        button { color: white; border: none; padding: 12px 20px; cursor: pointer; font-size: 16px; border-radius: 4px; transition: background 0.2s; }
        #btnProcesar { background-color: #0073aa; flex: 3; }
        #btnProcesar:hover { background-color: #005177; }
        #btnLimpiar { background-color: #d94f4f; flex: 1; }
        #btnLimpiar:hover { background-color: #b33c3c; }
        h3 { margin-top: 20px; margin-bottom: 5px; }
        .copiado { background-color: #46b450 !important; }
    </style>
</head>
<body>

    <h2>Procesador de Texto a HTML (Solo Imágenes)</h2>
    <p>Pega tu bloque de Excel abajo. El sistema convertirá únicamente las URLs de imágenes a HTML básico y lo copiará automáticamente a tu portapapeles (los enlaces de video no se tocarán).</p>

    <h3>1. Pega aquí el texto de tu Excel:</h3>
    <textarea id="entrada" placeholder="Pega tu texto con los enlaces aquí..."></textarea>

    <div class="botones-container">
        <button id="btnProcesar" onclick="procesarTexto()">Convertir y Copiar al Portapapeles</button>
        <button id="btnLimpiar" onclick="limpiarCampos()">Limpiar Todo</button>
    </div>

    <h3>2. Resultado copiado automáticamente:</h3>
    <textarea id="salida" placeholder="El código resultante aparecerá aquí y se copiará solo..." readonly onclick="this.select()"></textarea>

    <script>
    function procesarTexto() {
        let texto = document.getElementById('entrada').value;
        if (!texto.trim()) return; // Si está vacío, no hace nada

        // Expresión regular estricta para URLs de imágenes aisladas
        const regexImagen = /^(https?:\/\/[^\s]+?\.(?:jpg|jpeg|png|gif|webp)(?:\?[^\s]*)?)$/gmi;

        // Reemplazar solo imágenes por etiquetas HTML básicas
        let textoProcesado = texto.replace(regexImagen, '<p><img src="$1" alt="" /></p>');

        let cuadroSalida = document.getElementById('salida');
        cuadroSalida.value = textoProcesado;

        // Copiar automáticamente al portapapeles
        navigator.clipboard.writeText(textoProcesado).then(() => {
            let boton = document.getElementById('btnProcesar');
            let textoOriginal = boton.innerText;
            boton.innerText = "¡Procesado y Copiado con Éxito!";
            boton.classList.add('copiado');
            
            setTimeout(() => {
                boton.innerText = textoOriginal;
                boton.classList.remove('copiado');
            }, 2000);
        }).catch(err => {
            cuadroSalida.select();
            document.execCommand('copy');
            alert('Procesado. Por favor usa Ctrl+C para copiar.');
        });
    }

    function limpiarCampos() {
        document.getElementById('entrada').value = '';
        document.getElementById('salida').value = '';
        document.getElementById('entrada').focus(); // Deja el cursor listo en el primer cuadro
    }
    </script>

</body>
</html>
