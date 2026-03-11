<html lang="es">
<head>
	<meta charset="UTF-8"></meta>
	<title>Convertidor de Texto</title>
</head>

<body>

	<div style="font-family: Arial, sans-serif; margin: auto; max-width: 600px;">

		<h3>Convertidor de Texto</h3>

		<textarea
			id="textoOriginal"
			maxlength="20000000"
			placeholder="Escribe o pega tu texto aquí..."
			rows="8"
			style="width: 100%;">
		</textarea>

		<div
			id="contador"
			style="color: blue; font-size: 0.9em; margin-top: 2px; text-align: right;">
			0 / 20000000
		</div>

		<div style="color: grey; font-size: 0.85em; margin-top: 5px;">
			Nota: La inversión de texto puede no funcionar correctamente con idiomas RTL
			(árabe, hebreo) o asiáticos (chino, japonés, coreano).
		</div>

		<!-- BUSCAR Y REEMPLAZAR -->
		<div
			style="border-radius: 8px; border: 1px solid #ccc; margin-top: 15px; padding: 10px;">

			<h4 style="font-size: 12px;">
				Reemplazo directo. 
				(el resultado aparece automáticamente abajo)
			</h4>

			<input
				id="buscarTexto"
				placeholder="Texto a buscar"
				style="margin-bottom: 5px; padding: 4px; width: 48%;"
				type="text" />

			<input
				id="reemplazarTexto"
				placeholder="Reemplazar con..."
				style="margin-bottom: 5px; padding: 4px; width: 48%;"
				type="text" />

			<div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px;">

				<button onclick="reemplazarYCopiar()" style="background: #0559a3; color: white;">
					Reemplazar y copiar
				</button>

				<button onclick="limpiarTexto()" style="background: #f44336; color: white;">
					Limpiar
				</button>

				<button onclick="reemplazarDirecto()">
					Reemplazar
				</button>

				<button onclick="copiarResultado()">
					Copiar resultado
				</button>

			</div>

		</div>

		<!-- TOAST -->
		<div
			id="toast"
			style="background: #4caf50; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.35); color: white; font-size: 14px; left: 50%; opacity: 0; padding: 10px 18px; pointer-events: none; position: fixed; top: 20px; transform: translateX(-50%); transition: opacity 0.4s; z-index: 1000;">
		</div>

		<!-- BOTONES -->
		<div style="margin-top: 10px;">
			<button onclick="convertirMayusculas()">MAYÚSCULAS</button>
			<button onclick="convertirMinusculas()">minúsculas</button>
			<button onclick="invertirPalabras()">Invertir palabras</button>
			<button onclick="invertirTextoCompleto()">Invertir texto</button>
			<button onclick="eliminarSaltosLinea()">Eliminar saltos</button>
			<button onclick="eliminarEspacios()">Eliminar espacios</button>
			<button onclick="guardarTextoOriginal()">Guardar texto original (.txt)</button>
			<button onclick="guardarResultado()">Guardar resultado (.txt)</button>
		</div>

		<h4 style="margin-top: 20px;">Texto convertido:</h4>

		<div
			id="resultado"
			style="background: #f0f0f0; border: 1px solid #ccc; min-height: 100px; padding: 10px; white-space: pre-wrap;">
		</div>

		<h4 style="margin-top: 20px;">Log de reemplazos:</h4>

		<pre
			id="logReemplazos"
			style="background: #fafafa; border: 1px solid #ddd; font-size: 12px; padding: 10px;">
(No hay reemplazos aún)
		</pre>

	</div>

<script>

	const textarea = document.getElementById('textoOriginal');
	const contador = document.getElementById('contador');
	const resultado = document.getElementById('resultado');
	const logBox = document.getElementById('logReemplazos');
	const toast = document.getElementById('toast');

	/* ===== TOAST ===== */

	function mostrarToast(texto) {
		toast.textContent = texto;
		toast.style.opacity = 1;

		setTimeout(() => {
			toast.style.opacity = 0;
		}, 4000);
	}

	/* ===== REEMPLAZO ===== */

	function reemplazarDirecto() {

		const buscar = buscarTexto.value;
		if (!buscar) return alert("Escribe el texto a buscar.");

		const reemplazar = reemplazarTexto.value;
		const regex = new RegExp(buscar, 'g');

		const lineas = textarea.value.split(/\r?\n/);

		let total = 0;
		let lineasAfectadas = 0;
		let detalle = [];

		lineas.forEach((l, i) => {

			const m = l.match(regex);

			if (m) {
				total += m.length;
				lineasAfectadas++;
				detalle.push(`Línea ${i + 1}: ${m.length} reemplazo(s)`);
			}

		});

		resultado.innerText = textarea.value.replace(regex, reemplazar);

		if (total === 0) {

			logBox.textContent = "No se realizaron reemplazos.";
			mostrarToast("No hubo reemplazos");

		} else {

			logBox.textContent =
`Total de reemplazos: ${total}
Líneas afectadas: ${lineasAfectadas}

${detalle.join('\n')}`;

			mostrarToast(`${total} reemplazos en ${lineasAfectadas} línea(s)`);

		}

	}

	function reemplazarYCopiar() {

		reemplazarDirecto();

		if (resultado.innerText) {
			navigator.clipboard.writeText(resultado.innerText);
			mostrarToast("Reemplazo realizado y copiado");
		}

	}

	/* ===== COPIAR ===== */

	function copiarResultado() {

		if (!resultado.innerText) return;

		navigator.clipboard.writeText(resultado.innerText);
		mostrarToast("Texto copiado al portapapeles");

	}

	/* ===== LIMPIAR ===== */

	function limpiarTexto() {

		textarea.value = '';
		resultado.innerText = '';
		logBox.textContent = "(No hay reemplazos aún)";
		actualizarContador();

	}

	/* ===== UTILIDADES GUARDADO ===== */

	function fechaHora() {

		const d = new Date();

		return `${d.getFullYear()}-${
			String(d.getMonth()+1).padStart(2,'0')
		}-${
			String(d.getDate()).padStart(2,'0')
		}_${
			String(d.getHours()).padStart(2,'0')
		}-${
			String(d.getMinutes()).padStart(2,'0')
		}-${
			String(d.getSeconds()).padStart(2,'0')
		}`;

	}

	function primerasPalabras(t) {

		return t.toLowerCase()
			.normalize("NFD").replace(/[\u0300-\u036f]/g,"")
			.replace(/[^a-z0-9\s]/g,"")
			.trim()
			.split(/\s+/)
			.slice(0,6)
			.join("-");

	}

	function pedirNombre(s) {

		const n = prompt("Nombre del archivo:", s);
		if (!n) return null;

		return n.endsWith(".txt") ? n : n + ".txt";

	}

	function descargarTXT(nombre, contenido) {

		const b = new Blob([contenido], {type:"text/plain"});
		const a = document.createElement("a");

		a.href = URL.createObjectURL(b);
		a.download = nombre;
		a.click();

		URL.revokeObjectURL(a.href);

	}

	function guardarTextoOriginal() {

		if (!textarea.value) return alert("No hay texto.");

		const n = pedirNombre(`${fechaHora()}_${primerasPalabras(textarea.value)}.txt`);

		if (n) descargarTXT(n, textarea.value);

	}

	function guardarResultado() {

		if (!resultado.innerText) return alert("No hay resultado.");

		const n = pedirNombre(`${fechaHora()}_${primerasPalabras(resultado.innerText)}.txt`);

		if (n) descargarTXT(n, resultado.innerText);

	}

	/* ===== CONTADOR DE CARACTERES ===== */

	function actualizarContador() {

		const max = textarea.maxLength || 0;
		const actual = textarea.value.length;

		contador.textContent = `${actual} / ${max}`;

	}

	textarea.addEventListener('input', actualizarContador);

	actualizarContador();
/* ===== CONVERSIONES ===== */

function convertirMayusculas() {

	resultado.innerText = textarea.value.toUpperCase();

}

function convertirMinusculas() {

	resultado.innerText = textarea.value.toLowerCase();

}

function invertirPalabras() {

	const palabras = textarea.value.split(/\s+/);
	resultado.innerText = palabras.reverse().join(" ");

}

function invertirTextoCompleto() {

	resultado.innerText = textarea.value.split("").reverse().join("");

}

function eliminarSaltosLinea() {

	resultado.innerText = textarea.value.replace(/(\r\n|\n|\r)/g, " ");

}

function eliminarEspacios() {

	resultado.innerText = textarea.value.replace(/\s+/g, "");

}
</script>

</body>
</html>
