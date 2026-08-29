# 📱 Sistema de Asistencia de Talleres - E.E.T. N° 6

Aplicación web desarrollada sobre **Google Apps Script** y **HTML5 / JavaScript** para la toma y registro ágil de asistencia de los talleres técnicos de la Escuela de Educación Técnica N° 6.

---

## 🚀 Características Principales

- **⚡ Alto Rendimiento y Respuesta Inmediata (0 ms)**: Toda la información de docentes, cursos y alumnos se procesa en memoria en el cliente, eliminando tiempos de espera al cambiar de fecha, turno o curso.
- **🧠 Persistencia del Docente**: La aplicación recuerda el último docente seleccionado en el dispositivo (`localStorage`) para agilizar la carga diaria.
- **🚫 Detección de Asistencia Duplicada**: Alerta visual instantánea si ya se registró asistencia para ese mismo curso, turno y fecha hoy.
- **📝 Observaciones y Notas por Alumno**: Botón para registrar novedades técnicas (ej: *Sin calzado de seguridad*, *Sin ropa de grafa*, *Retiro anticipado*, *Certificado médico*).
- **📋 Modal de Confirmación**: Resumen previo detallado antes de guardar la asistencia para evitar errores involuntarios.
- **👀 Consulta e Historial del Día**: Pestaña / Modal para consultar en tiempo real qué asistencias ya se cargaron en la escuela durante la jornada.
- **👤 Avatares con Iniciales**: Círculos identificadores de color para cada alumno con sus iniciales.
- **📳 Feedback Háptico**: Vibración táctil sutil en dispositivos móviles al interactuar con los botones de asistencia.
- **🌙 Modo Oscuro / Claro**: Selector de tema con detección automática de preferencia del sistema y persistencia en el navegador.
- **📱 PWA & Mobile First**: Diseño optimizado e instalable en la pantalla de inicio de celulares y tablets.
- **💾 Guardado Masivo por Lotes**: Inserción en bloque (`setValues`), registrando la asistencia de todo el curso en menos de 1 segundo.
- **📅 Formato Estandarizado de Fechas**: Registro histórico en formato `DD/MM/AA` con separador de bloques para auditoría.

---

## 🛠️ Tecnologías Utilizadas

- **Google Apps Script**: Backend serverless conectado directamente con Google Sheets.
- **HTML5 & Vanilla JavaScript**: Lógica de filtrado, renderizado dinámico, almacenamiento local y vibración háptica.
- **CSS3 & Bootstrap 5.3**: Estructura de diseño responsivo y variables CSS para el sistema de temas claro/oscuro.
- **Google Clasp**: Gestión de código fuente, versionado y despliegues desde el entorno local.

---

## 📁 Estructura del Proyecto

```text
asistencia_eet6/
├── .clasp.json          # Configuración del proyecto en Google Apps Script
├── appsscript.json      # Manifiesto y permisos de Apps Script
├── Código.js            # Lógica del servidor (lectura, horarios, historial y guardado masivo)
├── index.html           # Interfaz de usuario, temas, contadores, modales y notas
├── .gitignore           # Archivos ignorados para control de versiones
└── README.md            # Documentación del proyecto
```

---

## 📊 Estructura de Google Sheets

La aplicación interactúa con un libro de Google Sheets que contiene dos pestañas:

1. **`Rotaciones_T3`**:
   - **Columna A**: ID Alumno
   - **Columna B**: Nombre y Apellido
   - **Columna C**: Curso (ej: `5° 2°`)
   - **Columna D**: Taller
   - **Columna E**: Docente
   - **Columna F**: Turno (`Mañana` / `Tarde`)

2. **`Asistencia_Historica`**:
   - **Columnas**: `Fecha` | `Docente` | `Taller` | `Curso` | `Turno` | `Alumno` | `Estado` | `Observaciones`

---

## 💻 Desarrollo y Despliegue con Clasp

### 1. Clonar el repositorio
```bash
git clone https://github.com/ea00d009/asistencia_eet6.git
cd asistencia_eet6
```

### 2. Iniciar sesión en Google Clasp
```bash
clasp login
```

### 3. Subir cambios al servidor de Google
```bash
clasp push
```

### 4. Desplegar una nueva versión pública
```bash
clasp deploy -d "Descripción de los cambios"
```

---

## 📄 Licencia

Desarrollado para la **E.E.T. N° 6**. Todos los derechos reservados.
