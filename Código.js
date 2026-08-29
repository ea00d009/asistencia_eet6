function doGet(e) {
  // Manejo de peticiones de API JSON desde GitHub Pages u otros clientes
  if (e && e.parameter && e.parameter.action) {
    const action = e.parameter.action;
    
    if (action === 'getInitialData') {
      try {
        const data = getInitialData();
        return ContentService.createTextOutput(JSON.stringify({ success: true, data: data }))
                             .setMimeType(ContentService.MimeType.JSON);
      } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
                             .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    if (action === 'getHistorial') {
      try {
        const fecha = e.parameter.fecha || "";
        const data = getAsistenciasPorFecha(fecha);
        return ContentService.createTextOutput(JSON.stringify({ success: true, data: data }))
                             .setMimeType(ContentService.MimeType.JSON);
      } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
                             .setMimeType(ContentService.MimeType.JSON);
      }
    }
  }

  // Renderizado HTML directo si se accede por Apps Script
  const template = HtmlService.createTemplateFromFile('index');
  try {
    template.initialData = getInitialData();
  } catch (err) {
    template.initialData = { error: err.message, docentes: [], registros: [], horarios: HORARIOS, asistenciasHoy: [] };
  }
  
  return template.evaluate()
      .setTitle('Asistencia Talleres - EET N° 6')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Endpoint POST para guardar la asistencia desde GitHub Pages o Apps Script
 */
function doPost(e) {
  try {
    let payload = null;
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      payload = e.parameter;
    }
    
    if (!payload) {
      throw new Error("No se recibieron datos para procesar.");
    }
    
    const res = guardarAsistencia(
      payload.registros,
      payload.docente,
      payload.fechaElegida,
      payload.turnoElegido
    );
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, message: res }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

// Diccionario oficial de horarios cargado según la grilla oficial
const HORARIOS = {
  "Zucco Alejandro": { "Lunes": ["5° 2°"], "Miércoles": ["3° 1°"], "Jueves": ["3° 1°"], "Viernes": ["5° 2°"] },
  "Wooldridge Maximiliano": { "Martes": ["5° 1°"], "Jueves": ["5° 1°"] },
  "Frutos Gabriel": { "Lunes": ["6° 1°"], "Martes": ["7° 1°"], "Miércoles": ["7° 1°"], "Jueves": ["7° 1°", "6° 1°"], "Viernes": ["6° 1°"] },
  "Cuello Sergio": { "Lunes": ["4° 1°"], "Viernes": ["4° 2°"] },
  "Camejo Julio": { "Lunes": ["1° 2°"], "Miércoles": ["1° 1°"], "Jueves": ["2° 2°", "2° 3°"] },
  "Michel Rubén": { "Lunes": ["1° 2°"], "Martes": ["3° 2°"], "Miércoles": ["1° 1°"], "Jueves": ["3° 2°"] },
  "Macor Mariano": { "Martes": ["2° 1°", "2° 3°"] }, 
  "Bleile Fabian": { "Martes": ["2° 1°", "2° 3°"], "Jueves": ["2° 1°", "2° 3°"] },
  "González Eduardo": { "Miércoles": ["2° 2°", "2° 3°"], "Viernes": ["2° 2°", "2° 3°"] },
  "Irigaray Martin": { "Lunes": ["3° 1°"], "Martes": ["2° 1°", "2° 3°", "4° 2°"], "Miércoles": ["3° 1°"], "Jueves": ["2° 1°", "2° 3°", "4° 1°"] },
  "Hussein Marcelo": { "Lunes": ["1° 2°"], "Martes": ["3° 2°"], "Miércoles": ["2° 2°", "2° 3°"], "Jueves": ["3° 2°"], "Viernes": ["2° 2°", "2° 3°"] },
  "Ortiz Soledad": { "Lunes": ["3° 1°"], "Jueves": ["3° 2°"] },
  "Medail Leandro": { "Martes": ["5° 2°"], "Jueves": ["5° 1°"] },
  "Boujon Marcelo": { "Martes": ["5° 2°"], "Jueves": ["5° 1°"] },
  "Álvarez Fabricio": { "Lunes": ["6° 1°"], "Martes": ["7° 1°"], "Miércoles": ["7° 1°", "6° 2°"], "Jueves": ["6° 1°"], "Viernes": ["6° 2°"] }
};

/**
 * Carga todos los datos necesarios en una sola lectura de la planilla.
 */
function getInitialData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Rotaciones_T3');
  if (!sheet) throw new Error("No se encontró la pestaña 'Rotaciones_T3'.");
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return { docentes: [], registros: [], horarios: HORARIOS, asistenciasHoy: [] };
  }
  
  const data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
  const docentesSet = new Set();
  const registros = [];
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const id = row[0] !== undefined && row[0] !== null ? row[0].toString().trim() : "";
    const nombre = row[1] ? row[1].toString().trim() : "";
    const curso = row[2] ? row[2].toString().trim() : "";
    const taller = row[3] ? row[3].toString().trim() : "";
    const docente = row[4] ? row[4].toString().trim() : "";
    const turno = row[5] ? row[5].toString().trim().toLowerCase() : "";
    
    if (docente) docentesSet.add(docente);
    
    if (nombre && curso && docente) {
      registros.push({
        id: id,
        n: nombre,
        c: curso,
        t: taller,
        d: docente,
        u: turno
      });
    }
  }
  
  const hoyStr = Utilities.formatDate(new Date(), "GMT-3", "dd/MM/yy");
  const asistenciasHoy = getAsistenciasPorFecha(hoyStr);
  
  return {
    docentes: Array.from(docentesSet).sort((a, b) => a.localeCompare(b)),
    registros: registros,
    horarios: HORARIOS,
    fechaHoyStr: hoyStr,
    asistenciasHoy: asistenciasHoy
  };
}

/**
 * Consulta el historial de asistencias guardadas para una fecha dada (formato DD/MM/AA)
 */
function getAsistenciasPorFecha(fechaConsultada) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Asistencia_Historica');
    if (!sheet) return [];
    
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return [];
    
    const numRows = Math.min(lastRow - 1, 600);
    const startRow = lastRow - numRows + 1;
    const data = sheet.getRange(startRow, 1, numRows, 8).getValues();
    
    const gruposMap = new Map();
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const fecha = row[0] ? row[0].toString().trim() : "";
      if (fecha !== fechaConsultada) continue;
      
      const docente = row[1] ? row[1].toString().trim() : "";
      const taller = row[2] ? row[2].toString().trim() : "";
      const curso = row[3] ? row[3].toString().trim() : "";
      const turno = row[4] ? row[4].toString().trim() : "";
      const alumno = row[5] ? row[5].toString().trim() : "";
      const estado = row[6] ? row[6].toString().trim() : "Presente";
      const observacion = row[7] ? row[7].toString().trim() : "";
      
      const key = `${fecha}|${docente}|${curso}|${turno}`;
      if (!gruposMap.has(key)) {
        gruposMap.set(key, {
          key: key,
          fecha: fecha,
          docente: docente,
          taller: taller,
          curso: curso,
          turno: turno,
          total: 0,
          presentes: 0,
          tardanzas: 0,
          ausentes: 0,
          alumnos: []
        });
      }
      
      const g = gruposMap.get(key);
      g.total++;
      if (estado === 'Presente') g.presentes++;
      else if (estado === 'Tardanza') g.tardanzas++;
      else if (estado === 'Ausente') g.ausentes++;
      
      g.alumnos.push({
        nombre: alumno,
        estado: estado,
        observacion: observacion
      });
    }
    
    return Array.from(gruposMap.values()).reverse();
  } catch (e) {
    return [];
  }
}

/**
 * Guarda el lote completo de asistencia en un único llamado a la API de Sheets.
 */
function guardarAsistencia(registros, docente, fechaElegida, turnoElegido) {
  try {
    if (!registros || !Array.isArray(registros) || registros.length === 0) {
      throw new Error("No hay alumnos para registrar.");
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Asistencia_Historica');
    if (!sheet) throw new Error("No existe la pestaña 'Asistencia_Historica'.");
    
    const filaInicio = sheet.getLastRow() + 1;
    
    // Mapeo masivo: Fecha | Docente | Taller | Curso | Turno | Alumno | Estado | Observaciones
    const filasParaGuardar = registros.map(reg => [
      fechaElegida,
      docente,
      reg.taller || "",
      reg.curso || "",
      turnoElegido || "",
      reg.nombre || "",
      reg.estado || "Presente",
      reg.observacion || ""
    ]);
    
    sheet.getRange(filaInicio, 1, filasParaGuardar.length, 8).setValues(filasParaGuardar);
    
    sheet.getRange(filaInicio, 1, 1, 8)
         .setBorder(true, false, false, false, false, false, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
         
    return `✅ Asistencia registrada correctamente (${filasParaGuardar.length} alumnos).`;
  } catch (error) {
    throw new Error(error.message);
  }
}