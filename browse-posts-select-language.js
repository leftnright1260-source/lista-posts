<div id="buscador-container" style="display:flex; gap:8px; align-items:center;">
  <input id="buscador" type="text" placeholder="Buscar título o enlace..." style="flex:1; padding:6px 8px;"/>
  <select id="select-idioma" style="padding:6px 8px;">
    <!-- opciones se llenan desde JS -->
  </select>
</div>

<div id="lista-posts" style="margin-top:12px;"></div>
<div id="paginacion" style="margin-top:12px;"></div>

<script>
/* ============================
   CONFIG
   ============================ */
const urlJSON = "https://raw.githubusercontent.com/leftnright1260-source/lista-posts/main/p7118withlanguager2.json";
let datos = [];
let paginaActual = 1;
const porPagina = 28;

/* Mapa de códigos de idioma -> nombre (usa los códigos que nos diste) */
const idiomas = {
  1: "Español - Español",
  2: "Inglés - English",
  3: "Italiano - Italiano",
  4: "Francés - Français",
  5: "Portugués - Português",
  6: "Alemán - Deutsch",
  7: "Polaco - Polski",
  8: "Ucraniano - Українська",
  9: "Ruso - Русский",
  10: "Holandés - Nederlands",
  11: "Rumano - Română",
  12: "Griego - Ελληνικά",
  13: "Croata - Hrvatski",
  14: "Indonesio - Bahasa Indonesia",
  15: "Albanés - Shqip",
  16: "Sueco - Svenska",
  17: "Finlandés - Suomi",
  18: "Armenio - Հայերեն",
  19: "Afrikaans - Afrikaans",
  20: "Turco - Türkçe",
  // 21: "Tailandés – ไทย",
  21: "\u0054\u0061\u0069\u006c\u0061\u006e\u0064\u00e9\u0073\u0020\u2013\u0020\u0e44\u0e17\u0e22",
  22: "Urdu - اردو",
  23: "Árabe - العربية",
  24: "Persa - فارسی",
  // 26: "Bengalí - বাংলা",
    26: "\u0042\u0065\u006e\u0067\u0061\u006c\u00ed\u0020\u002d\u0020\u09ac\u09be\u0982\u09b2\u09be",
  27: "Húngaro - Magyar",
  28: "Serbio - Српски",
  29: "Pangasinán - Pangasinan",
  30: "Coreano - 한국어",
  31: "Filipino - Filipino",
  32: "Vietnamita - Tiếng Việt",
  33: "Macedonio - Македонски",
  34: "Lombardo - Lombard",
  35: "Bielorruso - Беларуская",
  36: "Bosnio - Bosanski",
  37: "Estonio - Eesti",
  38: "Esloveno - Slovenščina",
  39: "Eslovaco - Slovenčina",
  41: "Lituano - Lietuvių",
  // 42: "Panyabí-India – ਪੰਜਾਬੀ",
    42: "\u0050\u0061\u006e\u0079\u0061\u0062\u00ed\u002d\u0049\u006e\u0064\u0069\u0061\u0020\u2013\u0020\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40",
  43: "Japonés - 日本語",
  44: "Chino - 中文",
  // 45: "Hindi – हिन्दी",
    45: "\u0048\u0069\u006e\u0064\u0069\u0020\u2013\u0020\u0939\u093f\u0928\u094d",
  46: "Hebreo - עברית",
 // 47: "Nepalí – नेपाली",
    47: "\u004e\u0065\u0070\u0061\u006c\u00ed\u0020\u2013\u0020\u0928\u0947\u092a\u093e\u0932\u0940",
  48: "Malayo - Bahasa Melayu",
  49: "Checo - Čeština",
  50: "Danés - Dansk",
  51: "Noruego - Norsk",
  52: "Irlandés - Gaeilge",
  53: "Búlgaro - Български",
  54: "Suajili - Kiswahili",
  //55: "Tamil – தமிழ்",
    55: "\u0054\u0061\u006d\u0069\u006c\u0020\u2013\u0020\u0ba4\u0bae\u0bbf\u0bb4\u0bcd",
  //57: "Amhárico – አማርኛ",
  57: "\u0041\u006d\u0068\u00e1\u0072\u0069\u0063\u006f\u0020\u2013\u0020\u12a0\u121b\u122d\u129b",
  58: "Latín - Latine"
};

/* ============================
   INICIALIZACIÓN DEL SELECT
   ============================ */
const selectIdioma = document.getElementById("select-idioma");

function poblarSelectIdiomas() {
  selectIdioma.innerHTML = "";
  // opción para ver todos
  const optAll = document.createElement("option");
  optAll.value = "0";
  optAll.textContent = "Todos los idiomas";
  selectIdioma.appendChild(optAll);

  // añadir idiomas en orden numérico
  const claves = Object.keys(idiomas).map(n => parseInt(n,10)).sort((a,b)=>a-b);
  for (const codigo of claves) {
    const opt = document.createElement("option");
    opt.value = codigo;
     // opt.textContent = `${codigo} — ${idiomas[codigo]}`;
    opt.textContent = `${codigo} - ${idiomas[codigo]}`;
    selectIdioma.appendChild(opt);
  }
}
poblarSelectIdiomas();

/* ============================
   CARGA JSON
   ============================ */
async function cargarDatos() {
  try {
    const res = await fetch(urlJSON);
    datos = await res.json();
    // OPTIONAL: validar que cada item tenga "idioma" (si no, lo dejamos como 0)
    datos = datos.map(item => {
      if (typeof item.idioma === "undefined" || item.idioma === null) {
        return {...item, idioma: 0};
      }
      // asegurar tipo numérico
      return {...item, idioma: Number(item.idioma)};
    });
    mostrarPagina();
  } catch (err) {
    console.error("Error loading JSON:", err);
    const cont = document.getElementById("lista-posts");
    cont.innerHTML = "<p>Error cargando la lista. Revisa la consola.</p>";
  }
}

/* ============================
   MOSTRAR / FILTRAR / PAGINAR
   ============================ */
function mostrarPagina() {
  const contenedor = document.getElementById("lista-posts");
  contenedor.innerHTML = "";

  const texto = document.getElementById("buscador").value.trim().toLowerCase();
  const codigoSeleccionado = Number(selectIdioma.value); // 0 = todos

  // filtro por texto y por idioma (si aplicable)
  const filtrados = datos.filter(post => {
    const buscaTexto = (post.titulo || "").toString().toLowerCase().includes(texto) ||
                       (post.enlace || "").toString().toLowerCase().includes(texto);
    const filtraIdioma = codigoSeleccionado === 0 ? true : (Number(post.idioma) === codigoSeleccionado);
    return buscaTexto && filtraIdioma;
  });

  // ajustar paginaActual si excede el total de páginas después del filtrado
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina));
  if (paginaActual > totalPaginas) paginaActual = totalPaginas;

  const inicio = (paginaActual - 1) * porPagina;
  const fin = inicio + porPagina;
  const paginaDatos = filtrados.slice(inicio, fin);

  // construir lista simple
  const ul = document.createElement("ul");
  ul.style.lineHeight = "1.6";
  paginaDatos.forEach(post => {
    const li = document.createElement("li");
    // Mostrar también nombre de idioma junto al título (opcional)
    const idiomaTexto = post.idioma && idiomas[post.idioma] ? ` <small>(${idiomas[post.idioma]})</small>` : "";
    li.innerHTML = `<a href="${post.enlace}" target="_blank" rel="noopener">${post.titulo}</a>${idiomaTexto}`;
    ul.appendChild(li);
  });

  if (paginaDatos.length === 0) {
    contenedor.innerHTML = "<p>No hay resultados.</p>";
  } else {
    contenedor.appendChild(ul);
  }

  generarPaginacion(filtrados.length);
  // desplazar al buscador (UX)
  document.getElementById("buscador-container").scrollIntoView({ behavior: 'smooth' });
}

function generarPaginacion(total) {
  const pagDiv = document.getElementById("paginacion");
  pagDiv.innerHTML = "";

  const totalPaginas = Math.ceil(total / porPagina) || 1;
  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.disabled = i === paginaActual;
    btn.style.marginRight = "6px";
    btn.onclick = () => {
      paginaActual = i;
      mostrarPagina();
    };
    pagDiv.appendChild(btn);
  }
}

/* ============================
   EVENTOS
   ============================ */
document.getElementById("buscador").addEventListener("input", () => {
  paginaActual = 1;
  mostrarPagina();
});
selectIdioma.addEventListener("change", () => {
  paginaActual = 1;
  mostrarPagina();
});

/* ============================
   INICIALIZAR
   ============================ */
cargarDatos();
</script>
