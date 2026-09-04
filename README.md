# 📱 Sistema de Asistencia de Talleres - E.E.T. N° 6

Aplicación web moderna, ágil y de alto rendimiento desarrollada para la toma y registro de asistencia técnica en los talleres de la **Escuela de Educación Técnica N° 6**. 

Funciona de forma híbrida: se puede acceder directamente desde **GitHub Pages** (como aplicación web / PWA independiente) o embebida dentro de **Google Apps Script**, comunicándose de forma segura y en tiempo real con **Google Sheets**.

---

## 🚀 Características Principales

### ⚡ Rendimiento & Experiencia de Usuario (UX)
- **Carga Instantánea en Memoria (0 ms)**: Toda la nómina de estudiantes, talleres y rotaciones se descarga al inicio, permitiendo cambiar de curso, fecha o turno sin tiempos de espera.
- **📱 PWA Instalable & Modo Offline**: Manifiesto web (`manifest.json`) y Service Worker (`sw.js`) que permiten instalar la aplicación en la pantalla de inicio del celular docente con ícono propio y carga ultrarrápida del shell de la app.
- **🔍 Buscador en Vivo de Alumnos**: Campo de filtrado instantáneo por nombre y apellido en el panel de asistencia que localiza estudiantes en grupos numerosos sin alterar los estados ya marcados.
- **📳 Feedback Háptico**: Vibración táctil sutil en dispositivos móviles al marcar asistencia, agregar notas o guardar.
- **🌙 Modo Oscuro / Claro**: Detección automática de la preferencia del sistema operativo y selector manual con persistencia en el navegador (`localStorage`).
- **🧠 Recordatorio del Docente**: Guarda el último docente seleccionado en el dispositivo para no tener que elegirlo en cada apertura.

### 📋 Gestión y Control de Asistencia
- **📅 Filtrado Inteligente por Horarios Oficiales**: Al elegir la fecha y turno, el sistema cruza la grilla horaria del docente y muestra únicamente los cursos que le corresponden ese día de la semana.
- **🔘 Marcado Rápido (Presente / Tardanza / Ausente)**: Interfaz intuitiva con tres estados (P / T / A) y contadores en tiempo real con animación interactiva.
- **✏️ Edición / Actualización de Asistencia Previa**: Al detectar que un curso ya fue tomado hoy, permite cargar los datos guardados con un toque y actualizar el registro existente limpiamente sin generar filas duplicadas.
- **🚨 Monitoreo de Inasistencias Críticas**: Botón de escudo en el encabezado con badge indicador y modal interactivo para consultar qué alumnos acumulan 2-3 inasistencias (advertencia) o ≥ 4 inasistencias (límite crítico en taller), con filtros por curso y buscador.
- **🚫 Detección de Asistencia Duplicada**: Alerta visual automática si ya se registró asistencia para ese curso, docente, turno y fecha hoy, informando cuántos presentes, tardanzas y ausentes se habían guardado.
- **📝 Observaciones Técnicas & Novedades de Seguridad (EPP)**: Registro con apercibimiento técnico y distintivo de protección laboral:
  - 🥾 *Sin Calzado Seguridad (EPP)*
  - 👕 *Sin Ropa de Grafa (EPP)*
  - 🏃 *Retiro Anticipado*
  - 📄 *Certificado Médico*
  - ✍️ *Texto libre personalizado*
- **🧾 Comprobante Digital Oficial de Cierre**: Al guardar, genera una constancia formal con código de validación único, fecha, hora, docente, taller, desglose de presentes/ausentes y botón para **enviar el parte formal directo a Preceptoría por WhatsApp**.
- **📶 Modo Offline Real & Cola de Sincronización**: Si el docente no tiene señal en el taller, la asistencia se almacena en memoria local (`localStorage`) con confirmación inmediata y se sincroniza automáticamente con Google Sheets apenas se detecta conexión o con el botón manual de subida.
- **🛡️ Monitor en Tiempo Real de Jefatura de Taller (Acceso PIN)**: Panel directivo protegido por PIN para verificar en vivo el estado del turno:
  - Semáforo de talleres tomados (🟢) vs pendientes (🔴).
  - Alumnos presentes reales en los talleres vs inasistencias generales.
  - Conteo consolidado de novedades EPP del turno.
- **🖨️ Parte Diario Oficial Imprimible (A4 / PDF)**: Generador con formato administrativo formal que incluye membrete del Consejo General de Educación / EET N° 6, grilla de talleres del turno, resumen y casilleros de firma para Preceptoría y Jefatura de Taller.
- **🔍 Recuperación Automática del Nombre del Taller**: Muestra e integra el nombre del taller específico (ej: *Ajuste, Electricidad, Herrería, Mecanizado, etc.*) en el selector, el modal de confirmación y el historial.
- **📋 Modal de Confirmación Previo**: Resumen detallado con desglose de presentes, ausencias y lista de observaciones antes de enviar los datos para evitar errores involuntarios.
- **👀 Historial y Consulta en Tiempo Real**: Modal para consultar qué asistencias ya fueron cargadas durante el día en la escuela, con botón para recargar directamente desde la planilla.

---

## 🛠️ Arquitectura y Tecnologías

- **Frontend**: HTML5 Semántico, CSS3 Vanilla con variables y temas personalizados, Bootstrap 5.3, Bootstrap Icons.
- **Backend / API**: Google Apps Script (Endpoints `doGet` y `doPost` en formato JSON).
- **Base de Datos**: Google Sheets (lectura por lotes e inserción masiva en bloque con `setValues`).
- **Despliegue y Hosting**:
  - **GitHub Pages**: Cliente web estático accesible desde cualquier navegador.
  - **Google Clasp**: Sincronización y versionado continuo del código hacia Google Apps Script.

---

## 📊 Estructura de Google Sheets

La aplicación se alimenta y registra en un libro de Google Sheets compuesto por dos pestañas:

### 1. `Rotaciones_T3` (Nómina y Distribución)
Contiene la base de datos de los alumnos y su asignación a docentes y talleres:
| Columna | Campo | Descripción |
|---|---|---|
| **A** | `ID Alumno` | Identificador único del alumno |
| **B** | `Nombre` | Apellido y Nombre del estudiante |
| **C** | `Curso` | División técnica (ej: `2° 2°`, `5° 1°`) |
| **D** | `Taller` | Nombre del taller / rotación (ej: `Ajuste`, `Herrería`) |
| **E** | `Docente` | Nombre completo del docente a cargo |
| **F** | `Turno` | Turno correspondiente (`Mañana` / `Tarde`) |

### 2. `Asistencia_Historica` (Libro de Asistencias)
Registro secuencial e histórico de cada alumno evaluado:
| Columna | Campo | Descripción |
|---|---|---|
| **A** | `Fecha` | Fecha en formato estandarizado `DD/MM/AA` |
| **B** | `Docente` | Docente que tomó la asistencia |
| **C** | `Taller` | Taller correspondiente |
| **D** | `Curso` | Curso y división |
| **E** | `Turno` | Turno (`Mañana` / `Tarde`) |
| **F** | `Alumno` | Apellido y Nombre del estudiante |
| **G** | `Estado` | `Presente`, `Tardanza` o `Ausente` |
| **H** | `Observaciones` | Observación técnica o médica (opcional) |

---

## 📁 Estructura del Repositorio

```text
asistencia_eet6/
├── .clasp.json          # Identificador del script en Google Apps Script
├── .claspignore         # Reglas para aislar archivos estáticos de Apps Script
├── appsscript.json      # Configuración de manifiesto y permisos de ejecución
├── Código.js            # Backend: rotaciones, historial, API JSON y guardado/sobrescritura
├── index.html           # Frontend PWA: interfaz táctil, temas, modales y lógica de asistencia
├── manifest.json        # Manifiesto de Progressive Web App (PWA)
├── sw.js                # Service Worker para caché offline y rendimiento instantáneo
├── icons/               # Íconos vectoriales SVG y PNG de alta resolución (192 y 512px)
├── .gitignore           # Archivos ignorados por Git
└── README.md            # Documentación general del sistema
```

---

## 💻 Flujo de Desarrollo y Despliegues

### 1. Clonar el repositorio localmente
```bash
git clone https://github.com/ea00d009/asistencia_eet6.git
cd asistencia_eet6
```

### 2. Sincronizar cambios con Google Apps Script
```bash
npx @google/clasp push
```

### 3. Publicar cambios en GitHub / GitHub Pages
```bash
git add .
git commit -m "Descripción de las mejoras"
git push origin main
```

---

## 📄 Licencia

Desarrollado exclusivamente para la **E.E.T. N° 6**. Todos los derechos reservados.
