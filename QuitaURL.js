<div class="mini-container">
  <h2>Extractor Compacto</h2>
  
  <div class="row-flex">
    <div class="col-flex">
      <div class="lbl-box">
        <span>1. Texto Principal</span>
      </div>
      <textarea id="textoEntrada" placeholder="Pega el texto aquí..."></textarea>
      
      <div class="lbl-box">
        <span>2. Texto Adicional (Opcional)</span>
        <button class="btn-sm btn-warn" onclick="limpiarOpcional()">Borrar</button>
      </div>
      <textarea id="textoAdicional" placeholder="Enlaces o extras sin procesar..."></textarea>
    </div>
    
    <div class="col-flex">
      <div class="lbl-box"><span>Resultado Final</span></div>
      <textarea id="textoResultado" readonly placeholder="El resultado aparecerá aquí..."></textarea>
      
      <button id="btnProcesar" onclick="procesarYCopiar()">Procesar, Unir y Copiar</button>
      
      <div class="botones-abajo">
        <button id="btnLimpiarPrincipales" onclick="limpiarPrincipales()">Limpiar Principales</button>
        <button id="btnBorrarTodo" onclick="borrarTodo()">Borrar Todo</button>
      </div>
    </div>
  </div>
</div>

<style>
  .mini-container {
    max-width: 750px;
    margin: 10px auto;
    padding: 12px;
    background-color: #f9f9f9;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    font-family: Arial, sans-serif;
  }
  .mini-container h2 {
    color: #333;
    font-size: 18px;
    margin: 0 0 10px 0;
    text-align: center;
  }
  .row-flex {
    display: flex;
    gap: 12px;
  }
  .col-flex {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .lbl-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    font-weight: bold;
    color: #555;
    margin-bottom: 2px;
    margin-top: 4px;
  }
  .mini-container textarea {
    width: 100%;
    height: 65px; /* Altura súper reducida */
    margin-bottom: 4px;
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    resize: none;
    font-size: 13px;
  }
  #textoResultado {
    height: 95px; /* Un poco más alto el del resultado */
    background-color: #e9ecef;
    color: #495057;
  }
  .mini-container button {
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.2s;
  }
  .btn-sm {
    font-size: 10px;
    padding: 2px 6px;
  }
  .btn-warn { background-color: #e67e22; }
  .btn-warn:hover { background-color: #d35400; }

  #btnProcesar {
    background-color: #007bff;
    padding: 10px;
    font-size: 14px;
    width: 100%;
    margin-top: 5px;
  }
  #btnProcesar:hover { background-color: #0056b3; }

  .botones-abajo {
    display: flex;
    gap: 6px;
    margin-top: 6px;
  }
  #btnLimpiarPrincipales {
    background-color: #6c757d;
    padding: 6px;
    font-size: 12px;
    flex: 1;
  }
  #btnLimpiarPrincipales:hover { background-color: #5a6268; }

  #btnBorrarTodo {
    background-color: #dc3545;
    padding: 6px;
    font-size: 12px;
    flex: 1;
  }
  #btnBorrarTodo:hover { background-color: #bd2130; }

  /* Adaptación para pantallas de celular */
  @media (max-width: 600px) {
    .row-flex { flex-direction: column; gap: 0; }
    .mini-container textarea { height: 60px; }
    #textoResultado { height: 75px; }
  }
</style>

<script>
  function procesarYCopiar() {
    const textoOriginal = document.getElementById('textoEntrada').value;
    const textoExtra = document.getElementById('textoAdicional').value;
    
    if (!textoOriginal.trim() && !textoExtra.trim()) {
      alert("Por favor, ingresa texto en alguna de las cajas.");
      return;
    }

    let textoLimpio = "";

    if (textoOriginal.trim()) {
      const regexURL = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
      textoLimpio = textoOriginal.replace(regexURL, '');
      textoLimpio = textoLimpio.replace(/\n{3,}/g, '\n\n');
      textoLimpio = textoLimpio.replace(/[ \t]{2,}/g, ' ').trim();
    }
    
    let resultadoFinal = textoLimpio;
    if (textoExtra.trim()) {
      if (resultadoFinal) {
        resultadoFinal += "\n\n" + textoExtra;
      } else {
        resultadoFinal = textoExtra;
      }
    }
    
    const contenedorResultado = document.getElementById('textoResultado');
    contenedorResultado.value = resultadoFinal;
    
    navigator.clipboard.writeText(resultadoFinal).then(() => {
      const btnProcesar = document.getElementById('btnProcesar');
      const textoOriginalBtn = btnProcesar.innerText;
      
      btnProcesar.innerText = "Procesado y Copiado";
      btnProcesar.style.backgroundColor = "#28a745";
      
      setTimeout(() => {
        btnProcesar.innerText = textoOriginalBtn;
        btnProcesar.style.backgroundColor = "#007bff";
      }, 2000);
    }).catch(err => {
      alert("Texto listo, pero copia manualmente: ", err);
    });
  }

  function limpiarPrincipales() {
    document.getElementById('textoEntrada').value = '';
    document.getElementById('textoResultado').value = '';
  }

  function limpiarOpcional() {
    document.getElementById('textoAdicional').value = '';
  }

  function borrarTodo() {
    document.getElementById('textoEntrada').value = '';
    document.getElementById('textoAdicional').value = '';
    document.getElementById('textoResultado').value = '';
  }
</script>
