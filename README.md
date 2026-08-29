# 📱 Sistema de Asistencia de Talleres - E.E.T. N° 6

Aplicación web moderna, ágil y de alto rendimiento desarrollada para la toma y registro de asistencia técnica en los talleres de la **Escuela de Educación Técnica N° 6**. 

Funciona de forma híbrida: se puede acceder directamente desde **GitHub Pages** (como aplicación web / PWA independiente) o embebida dentro de **Google Apps Script**, comunicándose de forma segura y en tiempo real con **Google Sheets**.

---

## 🚀 Características Principales

### ⚡ Rendimiento & Experiencia de Usuario (UX)
- **Carga Instantánea en Memoria (0 ms)**: Toda la nómina de estudiantes, talleres y rotaciones se descarga al inicio, permitiendo cambiar de curso, fecha o turno sin tiempos de espera.
- **📱 Enfoque Mobile-First & PWA**: Diseñado específicamente para celulares y tablets de los docentes en el entorno de taller, con botones táctiles amplios y accesibles.
- **📳 Feedback Háptico**: Vibración táctil sutil en dispositivos móviles al marcar asistencia, agregar notas o guardar.
- **🌙 Modo Oscuro / Claro**: Detección automática de la preferencia del sistema operativo y selector manual con persistencia en el navegador (`localStorage`).
- **🧠 Recordatorio del Docente**: Guarda el último docente seleccionado en el dispositivo para no tener que elegirlo en cada apertura.

### 📋 Gestión y Control de Asistencia
- **📅 Filtrado Inteligente por Horarios Oficiales**: Al elegir la fecha y turno, el sistema cruza la grilla horaria del docente y muestra únicamente los cursos que le corresponden ese día de la semana.
- **🔘 Marcado Rápido (Presente / Tardanza / Ausente)**: Interfaz intuitiva con tres estados (P / T / A) y contadores en tiempo real con animación interactiva.
- **🚫 Detección de Asistencia Duplicada**: Alerta visual automática si ya se registró asistencia para ese curso, docente, turno y fecha hoy, informando cuántos presentes, tardanzas y ausentes se habían guardado.
- **📝 Observaciones Técnicas con Chips Rápidos**: Botón de observaciones por alumno con atajos de un solo toque:
  - 🥾 *Sin Calzado Seguridad*
  - 👕 *Sin Ropa de Grafa*
  - 🏃 *Retiro Anticipado*
  - 📄 *Certificado Médico*
  - ✍️ *Texto libre personalizado*
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
├── appsscript.json      # Configuración de manifiesto y permisos de ejecución
├── Código.js            # Backend: lectura de rotaciones, historial, API JSON y guardado
├── index.html           # Frontend: interfaz interactiva, temas, modales y lógica de toma
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
