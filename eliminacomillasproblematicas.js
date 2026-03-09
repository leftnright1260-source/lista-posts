<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Reemplazo Universal de Comillas</title>
<style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #f7f7f7; }
    textarea { width: 100%; height: 200px; margin-bottom: 10px; padding: 10px; font-size: 14px; white-space: pre-wrap; }
    button { padding: 10px 15px; margin-right: 10px; font-size: 14px; cursor: pointer; margin-top: 5px;}
    label { font-weight: bold; display: block; margin-top: 10px;}
    #log { margin-top: 10px; background: #e0e0e0; padding: 10px; font-size: 13px; white-space: pre-wrap; height: 100px; overflow-y: auto;}
</style>
</head>
<body>

<h2>Reemplazo Universal de Comillas</h2>

<label for="inputText">Pega tu texto aquí:</label>
<textarea id="inputText" placeholder="Pega tu texto aquí..."></textarea>

<div>
    <button onclick="procesarTexto()">Reemplazar todas las comillas por simples</button>
    <button onclick="limpiarSalida()">Limpiar salida</button>
    <button onclick="copiarTexto()">Copiar al portapapeles</button>
    <button onclick="descargarTexto()">Descargar como .txt</button>
</div>

<label for="outputText">Texto limpio listo para copiar:</label>
<textarea id="outputText" placeholder="Aquí aparecerá el texto limpio..."></textarea>

<label for="log">Log de cambios:</label>
<div id="log"></div>

<script>
function reemplazarTodasComillas(texto) {
    if (!texto || !texto.trim()) return { texto: "", totalReemplazos: 0 };

    const comillas = [
        /"/g, // doble normal
        /'/g, // simple normal
        /“/g, /”/g, // doble tipográfica
        /‘/g, /’/g, // simple tipográfica
        /«/g, /»/g, // angular
        /„/g // alemana baja
    ];

    let totalReemplazos = 0;

    comillas.forEach(c => {
        const count = (texto.match(c) || []).length;
        totalReemplazos += count;
        texto = texto.replace(c, "'");
    });

    return { texto, totalReemplazos };
}

function procesarTexto() {
    let texto = document.getElementById('inputText').value;

    if (!texto.trim()) {
        alert("No se encontró ningún texto. Por favor ingresa un texto primero.");
        return;
    }

    const resultado = reemplazarTodasComillas(texto);
    texto = resultado.texto;

    let log = [];
    log.push(`Se reemplazaron ${resultado.totalReemplazos} comillas de todo tipo por comillas simples.`);

    let countSaltos = (texto.match(/\n/g) || []).length;
    log.push(`Saltos de línea conservados: ${countSaltos}`);

    document.getElementById('outputText').value = texto;
    document.getElementById('log').textContent = log.join("\n");
}

function limpiarSalida() {
    document.getElementById('outputText').value = "";
    document.getElementById('log').textContent = "";
}

function copiarTexto() {
    let salida = document.getElementById('outputText');
    if (!salida.value.trim()) {
        alert("No hay texto para copiar.");
        return;
    }
    salida.select();
    salida.setSelectionRange(0, 999999);
    document.execCommand("copy");
    alert("Texto copiado al portapapeles!");
}

function descargarTexto() {
    let texto = document.getElementById('outputText').value;
    if (!texto.trim()) {
        alert("No hay texto para descargar.");
        return;
    }
    let blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "texto_limpio.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
</script>

</body>
</html>
