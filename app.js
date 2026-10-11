// 1. ACTUALIZACIÓN DE LA FUNCIÓN DE CÁLCULO DE NOTA
function calcularNotaLibreta(porcentaje, pistasTotales = 0) {
  const p = Math.round(porcentaje || 0);
  let notaBase = 1;

  if (p <= 19) notaBase = 1;
  else if (p <= 29) notaBase = 2;
  else if (p <= 39) notaBase = 3;
  else if (p <= 49) notaBase = 4;
  else if (p <= 59) notaBase = 5;
  else if (p <= 69) notaBase = 6;
  else if (p <= 79) notaBase = 7;
  else if (p <= 89) notaBase = 8;
  else if (p <= 94) notaBase = 9;
  else notaBase = 10;

  // Descuento de 0.5 puntos por cada pista utilizada
  const penalizacionPistas = pistasTotales * 0.5;
  
  // La nota final no puede ser menor a 1 ni mayor a 10
  const notaFinal = Math.max(1, Math.round((notaBase - penalizacionPistas) * 10) / 10);

  let desc = "";
  if (notaFinal >= 9) desc = `${notaFinal}: Excelente desempeño`;
  else if (notaFinal >= 7) desc = `${notaFinal}: Buen desempeño`;
  else if (notaFinal >= 6) desc = `${notaFinal}: Logro aceptable`;
  else if (notaFinal >= 4) desc = `${notaFinal}: En proceso, requiere apoyo`;
  else desc = `${notaFinal}: Requiere acompañamiento`;

  return { nota: notaFinal, desc: desc, penalizacion: penalizacionPistas };
}

// 2. ACTUALIZACIÓN DE MÉTODOS DENTRO DE WINDOW.PYLOGIC

window.PyLogic = {
  // ... (tus otras funciones se mantienen igual) ...

  cargarNivel: function (num) {
    PyLogicState.nivelActual = num;
    const cfg = CONFIG_NIVELES[num];
    if (!cfg) return;

    document.getElementById("levelBadge").textContent = cfg.badge;
    document.getElementById("levelTitle").textContent = cfg.titulo;
    document.getElementById("levelTheory").innerHTML = cfg.teoria;
    document.getElementById("levelConsigna").innerHTML = `<strong>Consigna:</strong> ${cfg.consigna}`;

    const prog = PyLogicState.progresosNivel[num];
    document.getElementById("codeEditor").value = prog.codigoGuardado || cfg.codigoInicial;
    
    // Ocultar y limpiar el cuadro de pistas al cargar o cambiar de nivel
    const hintEl = document.getElementById("hintText");
    hintEl.style.display = "none";
    hintEl.innerHTML = "";
    
    document.getElementById("hintCount").textContent = prog.pistasUsadas;

    this.actualizarBarraProgreso();
  },

  pedirPista: function () {
    const num = PyLogicState.nivelActual;
    const cfg = CONFIG_NIVELES[num];
    const prog = PyLogicState.progresosNivel[num];

    if (prog.pistasUsadas < cfg.pistas.length) {
      // Pista actual que le corresponde ver
      const pistaActual = cfg.pistas[prog.pistasUsadas];
      
      prog.pistasUsadas++;
      PyLogicState.pistasTotales++;
      
      document.getElementById("hintCount").textContent = prog.pistasUsadas;

      const hintEl = document.getElementById("hintText");
      hintEl.style.display = "block";
      
      // Muestra ÚNICAMENTE la pista recién