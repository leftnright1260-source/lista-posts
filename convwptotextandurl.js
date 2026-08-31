<div class="extractor-container" style="background: rgb(255, 255, 255); border-radius: 5px; border: 1px solid rgb(204, 204, 204); font-family: Arial, sans-serif; margin: 20px auto; max-width: 800px; padding: 15px;">
    <h2>Extractor y Limpiador Avanzado de Contenido</h2>
    
    <label style="display: block; font-weight: bold; margin-bottom: 5px;">Código Gutenberg / HTML de origen (Paso 1):</label>
    <textarea id="inputCode" style="box-sizing: border-box; font-family: monospace; height: 180px; margin-bottom: 10px; padding: 10px; width: 100%;"></textarea>
    
    <div style="margin-bottom: 15px;">
        <button id="btnFlash" style="background-color: #6f42c1; border-radius: 3px; border: none; color: white; cursor: pointer; font-weight: bold; margin-right: 10px; padding: 10px 15px;">⚡ FLASH (Todo en 1)</button>
        <button id="btnProcess" style="background-color: #28a745; border-radius: 3px; border: none; color: white; cursor: pointer; font-weight: bold; margin-right: 10px; padding: 10px 15px;">1. Procesar y copiar</button>
        <button id="btnSecondProcess" style="background-color: #007bff; border-radius: 3px; border: none; color: white; cursor: pointer; font-weight: bold; margin-right: 10px; padding: 10px 15px;">2. Limpiar comillas y parámetros</button>
        <button id="btnClear" style="background-color: #6c757d; border-radius: 3px; border: none; color: white; cursor: pointer; font-weight: bold; padding: 10px 15px;">Limpiar todo</button>
    </div>
    
    <label style="display: block; font-weight: bold; margin-bottom: 5px;">Resultado Limpio:</label>
    <textarea id="outputResult" readonly="" style="background-color: #f8f9fa; box-sizing: border-box; font-family: inherit; height: 250px; margin-bottom: 10px; padding: 10px; white-space: pre-wrap; width: 100%;"></textarea>

    <label style="display: block; font-weight: bold; margin-bottom: 5px;">Log del procesamiento:</label>
    <div id="log" style="background: rgb(224, 224, 224); border-radius: 3px; font-family: monospace; font-size: 13px; height: 90px; overflow-y: auto; padding: 10px; white-space: pre-wrap;">Ningún procesamiento ejecutado aún.</div>
</div>

<div id="avisoCopiado" style="background: rgb(46, 204, 113); border-radius: 6px; bottom: 20px; color: white; font-size: 14px; opacity: 0; padding: 12px 20px; pointer-events: none; position: fixed; right: 20px; transition: opacity 0.5s; z-index: 9999;">Texto copiado al portapapeles</div>

<script>
// Función para mostrar el aviso verde de copiado
function mostrarAviso() {
    const aviso = document.getElementById("avisoCopiado");
    aviso.style.opacity = "1";
    setTimeout(function(){
        aviso.style.opacity = "0";
    }, 1800);
}

// Función centralizada para el Paso 1 (Extracción)
function ejecutarPaso1(input) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = input;
    
    // Se agregan h1, h2, h3, h4, h5, h6 para extraer subtítulos/encabezados
    const blocks = tempDiv.querySelectorAll('p, figure, li, h1, h2, h3, h4, h5, h6');
    let results = [];
    
    blocks.forEach(block => {
        const tagName = block.tagName.toLowerCase();

        // Evitar duplicados si hay <p> dentro de <li> o encabezados anidados raros
        if (tagName === 'p' && block.closest('li')) {
            return;
        }

        // Si es un párrafo, elemento de lista o subtítulo/encabezado (h1-h6)
        if (tagName === 'p' || tagName === 'li' || /^h[1-6]$/.test(tagName)) {
            const text = block.textContent.trim();
            if (text) {
                results.push(text);
            }
        } else if (tagName === 'figure') {
            const img = block.querySelector('img');
            if (img && img.getAttribute('src')) {
                let imgSrc = img.getAttribute('src').trim();
                imgSrc = imgSrc.split('?')[0];
                if (imgSrc.includes('wordpress.com')) {
                    imgSrc = imgSrc.replace(/https?:\/\/[^\/]+/, 'https://gabriels.work');
                }
                imgSrc += '?allow_lossy=1';
                results.push(imgSrc);
            }
            
            const textContent = block.textContent.trim();
            if (textContent.includes('youtube.com') || textContent.includes('youtu.be')) {
                const urlMatch = textContent.match(/https?:\/\/[^\s<>\"]+/);
                if (urlMatch) {
                    let videoUrl = urlMatch[0].trim();
                    let videoId = '';
                    
                    if (videoUrl.includes('/shorts/')) {
                        videoId = videoUrl.split('/shorts/')[1].split('?')[0];
                    } else if (videoUrl.includes('v=')) {
                        videoId = videoUrl.split('v=')[1].split('&')[0];
                    }
                    
                    if (videoId) {
                        results.push(`https://youtu.be/${videoId}?si=AxSPFD2VAcjGcWw5`);
                    } else {
                        results.push(videoUrl);
                    }
                }
            }
        }
    });

    return results.length > 0 ? results.join('\n\n\n') + '\n\n\n\n' : '';
}

// Función centralizada para el Paso 2 (Depuración profunda de comillas y strings de URL)
function ejecutarPaso2(textoBase) {
    let texto = textoBase;

    // 1. Reemplazo de comillas por comillas simples
    const regexComillas = /["\u00AB\u00BB\u2018\u2019\u201A\u201B\u201C\u201D\u201E\u201F\u2039\u203A]/gu;
    const matchesComillas = texto.match(regexComillas);
    const totalReemplazos = matchesComillas ? matchesComillas.length : 0;
    texto = texto.replace(regexComillas, "'");

    // 2. Eliminar caracteres invisibles
    texto = texto.replace(/[\u200B-\u200F\uFEFF]/g, "");

    // 3. Eliminar parámetros allow_lossy de WordPress
    const regexLossy = /\?w=\d+&allow_lossy=1|\?allow_lossy=1/g;
    const matchesLossy = texto.match(regexLossy);
    const totalLossy = matchesLossy ? matchesLossy.length : 0;
    texto = texto.replace(regexLossy, "");

    // 4. Limpiar parámetros ?si= de YouTube
    const regexYoutubeSI = /(https:\/\/youtu\.be\/[^\s?]+)\?si=[^\s]+/g;
    const matchesYoutubeSI = texto.match(regexYoutubeSI);
    const totalYoutubeSI = matchesYoutubeSI ? matchesYoutubeSI.length : 0;
    texto = texto.replace(regexYoutubeSI, "$1");

    return {
        texto,
        totalReemplazos,
        totalLossy,
        totalYoutubeSI
    };
}

// BOTÓN FLASH: Hace todo de golpe
document.getElementById('btnFlash').addEventListener('click', function() {
    const input = document.getElementById('inputCode').value;
    if (!input.trim()) return;

    // Paso 1
    const resultadoPaso1 = ejecutarPaso1(input);
    if (!resultadoPaso1) {
        document.getElementById('outputResult').value = '';
        return;
    }

    // Paso 2 sobre el Paso 1
    const resultadoFinal = ejecutarPaso2(resultadoPaso1);

    // Renderizar salida
    document.getElementById('outputResult').value = resultadoFinal.texto;

    // Actualizar Log
    let log = ["--- MODO FLASH EJECUTADO ---"];
    log.push("Se reemplazaron " + resultadoFinal.totalReemplazos + " comillas.");
    log.push("Se eliminaron " + resultadoFinal.totalLossy + " parámetros de WordPress.");
    log.push("Se limpiaron " + resultadoFinal.totalYoutubeSI + " URLs de YouTube.");
    log.push("Saltos de línea conservados: " + (resultadoFinal.texto.match(/\n/g) || []).length);
    document.getElementById('log').textContent = log.join("\n");

    // Copiar automáticamente
    navigator.clipboard.writeText(resultadoFinal.texto).then(() => {
        mostrarAviso();
    }).catch(err => console.error('Error al copiar: ', err));
});

// Evento Botón 1 (Solo extraer)
document.getElementById('btnProcess').addEventListener('click', function() {
    const input = document.getElementById('inputCode').value;
    if (!input.trim()) return;

    const finalOutput = ejecutarPaso1(input);
    document.getElementById('outputResult').value = finalOutput;
    document.getElementById('log').textContent = "Paso 1 completado. Texto crudo y URLs extraídas.";

    if (finalOutput) {
        navigator.clipboard.writeText(finalOutput).then(() => mostrarAviso());
    }
});

// Evento Botón 2 (Solo limpiar comillas/parámetros sobre el output actual)
document.getElementById('btnSecondProcess').addEventListener('click', function() {
    let textoActual = document.getElementById('outputResult').value;
    if (!textoActual.trim()) {
        document.getElementById('log').textContent = "No hay texto en el resultado para procesar.";
        return;
    }

    const resultado = ejecutarPaso2(textoActual);
    document.getElementById('outputResult').value = resultado.texto;

    let log = ["--- SEGUNDO PROCESO MANUAL ---"];
    log.push("Se reemplazaron " + resultado.totalReemplazos + " comillas.");
    log.push("Se eliminaron " + resultado.totalLossy + " parámetros de WordPress.");
    log.push("Se limpiaron " + resultado.totalYoutubeSI + " URLs de YouTube.");
    log.push("Saltos de línea conservados: " + (resultado.texto.match(/\n/g) || []).length);
    document.getElementById('log').textContent = log.join("\n");

    navigator.clipboard.writeText(resultado.texto).then(() => mostrarAviso());
});

// Limpiar interfaz
document.getElementById('btnClear').addEventListener('click', function() {
    document.getElementById('inputCode').value = '';
    document.getElementById('outputResult').value = '';
    document.getElementById('log').textContent = "Ningún procesamiento ejecutado aún.";
});
</script>
