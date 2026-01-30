<html lang="es">
<head>
  <meta charset="UTF-8"></meta>
  <title>Videos y Documentos .pdf por idioma </title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #adc4db;
      color: #000;
      text-align: center;
      padding: 2rem;
      overflow-y: auto;
    }
    .zona-general {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .columna-banderas {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2mm;
      width: fit-content;
    }
    .bandera-item {
      width: 1cm;
    }
    .bandera-item img {
      width: 100%;
      border-radius: 6px;
      cursor: pointer;
    }
    .contenedor-videos {
      flex: 1;
      min-width: 300px;
      max-width: 800px;
      margin: auto;
      text-align: center;
    }
    .video-container {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      margin-top: 1rem;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
    }
    .video-container iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
    button {
      margin: 0.25rem;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      background-color: #6a9eba;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
    button:hover {
      background-color: black;
    }
    #tituloVideo {
      font-size: 1.25rem;
      font-weight: bold;
      margin-top: 1rem;
      color: #4c56e0;
    }

    input[type="number"],
input[type="text"] {
  padding: 0.5rem;
  border-radius: 8px;
  margin: 0.5rem;
  width: 80%;
  max-width: 300px;
  background-color: #57a1de;
  color: #fff; /* 👈 Esto hace que el texto sea visible */
  border: 1px solid #666;
}
    
    #listaVideos {
      max-width: 900px;
      margin: 2rem auto;
      text-align: left;
    }
    .video-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      background-color: #1581e6;
      padding: 0.5rem 1rem;
      margin-bottom: 0.5rem;
      border-radius: 8px;
    }
    .video-row span {
      flex: 1 1 60%;
      font-size: 1rem;
    }
    .video-row button, .video-row a {
      margin-left: 0.5rem;
    }
    a {
      color: white;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    @media (max-width: 1024px) {
      .zona-general {
        flex-direction: column;
        align-items: center;
      }
      .columna-banderas {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  </style>
</head>
<body>
  <h3>🌍 🏳️ Dar click en las banderas, enlazan a (.PDF). Accede a la investigación en archivos en tu idioma</h3>
  <div class="zona-general">
    <div class="columna-banderas">
       <a class="bandera-item" href="https://antibestia.wordpress.com/wp-content/uploads/2025/12/psychiatry-as-a-tool-of-religious-persecution-in-peru-the-case-of-jose-galindo.pdf" target="_blank" title="Psychiatry as a Tool of Religious Persecution in Peru: The Case of José Galindo">
    <img alt="Español" src="https://antibestia.wordpress.com/wp-content/uploads/2025/12/idi02-dr-chue-1.jpg" />
  </a>  
       <a class="bandera-item" href="https://antibestia.wordpress.com/wp-content/uploads/2025/12/psychiatry-as-a-tool-of-religious-persecution-in-peru-the-case-of-jose-galindo.pdf" target="_blank" title="Psychiatry as a Tool of Religious Persecution in Peru: The Case of José Carlos Galindo Hinostroza">
    <img alt="Español" src="https://antibestia.wordpress.com/wp-content/uploads/2025/12/idi02-jose-galindo-e28093-the-prisoner-who-must-be-granted-justice.jpg" />
  </a>  
      
  
     <a class="bandera-item" href="https://antibestia.wordpress.com/wp-content/uploads/2025/10/los-hijos-de-maldicion.pdf" target="_blank" title="Los Hijos de Maldición"><img alt="Y los libros fueron abiertos... El libro del juicio contra los hijos de Maldicíón" src="https://antibestia.wordpress.com/wp-content/uploads/2025/10/idi01-hijos-de-maldicion.jpg" /></a>   
       <a class="bandera-item" href="https://mutilitarios.blogspot.com/p/ensayos.html" target="_blank" title="The assays of Jose Galindo - Los ensayos de José Galindo">
    <img alt="Español" src="https://gabriels52.wordpress.com/wp-content/uploads/2025/12/ensayos-de-jose-galindo.jpg" />
  </a>           
    </div>
    <div class="contenedor-videos">
      <h1>🎬 Video aleatorio con navegación y búsqueda</h1>
      <div id="tituloVideo"></div>
      <div class="video-container">
        <iframe allow="autoplay; encrypted-media" allowfullscreen="" id="videoFrame"></iframe>
      </div>
      <div>
        <button onclick="irAlPrimero()">⏮️ Primero</button>
        <button onclick="anterior()">◀️ Anterior</button>
        <button onclick="siguiente()">▶️ Siguiente</button>
        <button onclick="irAlUltimo()">⏭️ Último</button>
        <button onclick="elegirAzar()">🎲 Elige al azar</button>
      </div>
      <div>
        <input id="numeroVideo" min="1" placeholder="N° de video" type="number" />
        <button onclick="irANumero()">Ir al número</button>
      </div>
      <h2>🔍 Buscar video por nombre</h2>
      <input id="buscador" placeholder="Escribe parte del título..." type="text" />
      <div id="listaVideos"></div>
    </div>
    <div class="columna-banderas">
     <a class="bandera-item" href="https://eltrabajodegabriel.wordpress.com/wp-content/uploads/2025/12/idi30-logic-sayings.pdf" target="_blank"><img alt="Coreano" src="https://antibestia.wordpress.com/wp-content/uploads/2025/08/idi30-corea.jpg" /></a>

<a class="bandera-item" href="https://eltrabajodegabriel.wordpress.com/wp-content/uploads/2025/12/idi23-logic-sayings.pdf" target="_blank"><img alt="Árabe" src="https://antibestia.wordpress.com/wp-content/uploads/2025/08/idi23-arabe.jpg" /></a>


 <a class="bandera-item" href="https://mutilitarios.blogspot.com/p/browse-publications-list.html" target="_blank" title="Explora la lista de publicaciones - Browse posts list">
    <img alt="Lista de entradas" src="https://antibestia.com/wp-content/uploads/2025/06/posts-list-icon.jpg" />
      </a>
      
          <a class="bandera-item" href="https://eltrabajodegabriel.wordpress.com/wp-content/uploads/2025/12/logic-defense.xlsx" target="_blank" title="A file in Excel with main themes and logic awakening phrases translated to 24 languages. █ Un archivo en Excel con los principales temas y frases de despertar lógico traducidas a 24 idiomas. "><img alt="Download Excel file. Descarfa archivo .xlsl" src="https://antibestia.com/wp-content/uploads/2025/06/download-zone-icon.jpg" /></a>
     <a class="bandera-item" href="https://gabriels58.wordpress.com/wp-content/uploads/2025/04/las-evidencias-presentadas-por-jose-galindo.pdf" target="_blank" title="El libro de la vida de José Galindo - El libro del juicio."><img alt="Y los libros fueron abiertos... libros del juicio" src="https://antibestia.com/wp-content/uploads/2025/09/los-libros-fueron-abiertos-1.jpg" /></a>
  
   <a class="bandera-item" href="https://naodanxxii.wordpress.com/wp-content/uploads/2025/11/idi01-las-cartas-paulinas-y-las-otras-mentiras-de-roma-en-la-biblia.pdf
" target="_blank" title="Charla con GEMINI y ChatGPT sobre la Biblia y sus contradicciones">
<img alt="Las Cartas Paulinas y las otras Mentiras de Roma en la Biblia" src="https://naodanxxii.wordpress.com/wp-content/uploads/2025/11/mejilla-1-de-zeus.jpg
" />
      </a>         
    </div>
  </div>
  <script>
   const videos = [
     
{ id:"GTncwqZ0giA", titulo:  "The Roman Empire and the faked gospel the Dragon loves because it does not demand resistance to its evil" },
{ id:"BZyKOlYhRrQ", titulo:  "El tribunal sentado, libros del juicio final abiertos. Daniel 7:25, Daniel 7:26, Daniel 7:27" },
{ id:"n1b8Wbh6AHI", titulo:  "Miguel y sus ángeles arrojan a Zeus y a sus ángeles al abismo del infierno." },
{ id:"H53YmhhtUaY", titulo:  "El protestante verdadero. La guerra en el ciberespacio." },
{ id:"VizNaxxNJ5Y", titulo:  "El arcángel Gabriel destruye la mala imagen hecha de él y desmiente a líderes de falsas religiones." },
{ id:"XiUEr67zafY", titulo:  "José Carlos Galindo Hinostroza, ¿Qué sucedió con el blog ai20 me ?, ¿Qué pasó con el 'OVNI' ai20 me?" }


     
    ];
    let videoActual = 0;
    function decodificarHTML(html) {
      const txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    }
    function mostrarVideo(index) {
      if (index < 0 || index >= videos.length) return;
      videoActual = index;
      const video = videos[videoActual];
      const videoUrl = `https://www.youtube.com/embed/${video.id}?mute=0&rel=0`;
      document.getElementById("videoFrame").src = videoUrl;
      document.getElementById("tituloVideo").textContent = `${videoActual + 1}. ${decodificarHTML(video.titulo)}`;
      document.querySelector(".video-container").scrollIntoView({ behavior: "smooth" });
    }
    function siguiente() { if (videoActual < videos.length - 1) mostrarVideo(videoActual + 1); }
    function anterior() { if (videoActual > 0) mostrarVideo(videoActual - 1); }
    function irAlPrimero() { mostrarVideo(0); }
    function irAlUltimo() { mostrarVideo(videos.length - 1); }
    function elegirAzar() { const aleatorio = Math.floor(Math.random() * videos.length); mostrarVideo(aleatorio); }
    function irANumero() {
      const num = parseInt(document.getElementById("numeroVideo").value);
      if (!isNaN(num) && num >= 1 && num <= videos.length) mostrarVideo(num - 1);
    }
    function renderizarLista(filtrados) {
      const contenedor = document.getElementById("listaVideos");
      contenedor.innerHTML = "";
      if (filtrados.length === 0) return;
      filtrados.forEach((video, index) => {
        const row = document.createElement("div");
        row.className = "video-row";
        row.innerHTML = `<span><strong>${index + 1}.</strong> ${video.titulo}</span>
                         <div>
                           <a href="https://youtu.be/${video.id}" target="_blank">YouTube</a>
                           <button onclick="mostrarVideoPorId('${video.id}')">▶ Reproducir</button>
                         </div>`;
        contenedor.appendChild(row);
      });
    }
    function mostrarVideoPorId(videoId) {
      const index = videos.findIndex(v => v.id === videoId);
      if (index !== -1) mostrarVideo(index);
    }
    document.getElementById("buscador").addEventListener("input", function () {
      const texto = this.value.toLowerCase();
      if (texto.length < 1) {
        document.getElementById("listaVideos").innerHTML = "";
        return;
      }
      const filtrados = videos.filter(v => v.titulo.toLowerCase().includes(texto));
      renderizarLista(filtrados);
      //agrego
   //   document.getElementById("listaVideos").scrollIntoView({ behavior: "smooth" });

    });
    elegirAzar();
   //   renderizarLista(videos);  // muestra toda la lista al inicio
  </script>
</body>
</html>
