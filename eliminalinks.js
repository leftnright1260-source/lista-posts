<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Limpiador PRO de enlaces</title>

<style>
body{
font-family:Arial;
background:#f4f4f4;
padding:20px;
}

textarea{
width:100%;
height:250px;
padding:10px;
font-size:14px;
margin-bottom:15px;
}

button{
padding:10px 18px;
font-size:15px;
margin:5px;
cursor:pointer;
}

#stats{
margin-top:10px;
font-weight:bold;
}
</style>
</head>

<body>

<h2>Limpiador avanzado de enlaces</h2>

<input type="file" id="fileInput">

<br><br>

<textarea id="inputText" placeholder="Pega aquí el texto o carga un archivo TXT"></textarea>

<br>

<button onclick="limpiar()">Eliminar enlaces</button>
<button onclick="copiar()">Copiar resultado</button>
<button onclick="descargar()">Descargar TXT limpio</button>

<div id="stats"></div>

<h3>Resultado</h3>

<textarea id="outputText"></textarea>

<script>

let enlacesEliminados = 0;

document.getElementById("fileInput").addEventListener("change", function(e){

let file = e.target.files[0];

if(!file) return;

let reader = new FileReader();

reader.onload = function(e){

document.getElementById("inputText").value = e.target.result;

};

reader.readAsText(file);

});

function limpiar(){

let texto = document.getElementById("inputText").value;

let regexLinks = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(\b[a-z0-9.-]+\.(com|org|net|me|info|biz|io|tv|co|es|us|uk|ru|de|fr|jp|cn)\S*)|(\S+\.(jpg|jpeg|png|gif|webp|bmp))/gi;

let encontrados = texto.match(regexLinks);

enlacesEliminados = encontrados ? encontrados.length : 0;

texto = texto.replace(regexLinks,"");

texto = texto.replace(/\n\s*\n\s*\n+/g,"\n\n");

texto = texto.replace(/[ \t]+/g," ");

document.getElementById("outputText").value = texto;

document.getElementById("stats").innerText =
"Enlaces eliminados: " + enlacesEliminados;

}

function copiar(){

let texto = document.getElementById("outputText").value;

navigator.clipboard.writeText(texto);

alert("Texto copiado al portapapeles");

}

function descargar(){

let texto = document.getElementById("outputText").value;

let blob = new Blob([texto], {type:"text/plain"});

let enlace = document.createElement("a");

enlace.href = URL.createObjectURL(blob);

enlace.download = "texto_limpio.txt";

enlace.click();

}

</script>

</body>
</html>
