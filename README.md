# GrafomotorIA Frontend

Este proyecto es la base para el desarrollo del frontend de **GrafomotorIA**, utilizando **React + TypeScript**, siguiendo un enfoque tipo MVC y preparado para integrarse más adelante como una **PWA**.

---

## 📁 Estructura del proyecto

```
/src
├── assets/              # Imágenes, íconos, estilos
├── components/          # Componentes reutilizables
├── pages/               # Páginas principales (Vistas)
├── models/              # Interfaces y tipos TS (Modelo de datos)
├── services/            # Lógica de negocio / conexión a API (Controlador)
├── context/             # Estados globales (Auth, Sesión, etc.)
├── hooks/               # Custom hooks
├── utils/               # Funciones auxiliares
├── routes/              # Configuración de rutas
├── App.tsx              # Componente principal
└── main.tsx             # Entrada de la app
```

---

## 🚀 Cómo iniciar el proyecto

### 1. Instalar Node.js
Descárgalo desde: https://nodejs.org/

### 2. Abre terminal en esta carpeta y ejecuta:
```bash
npx create-vite .
```

> Si aparece el mensaje “Current directory is not empty”, selecciona:  
👉 `Ignore files and continue`

- Framework: **React**
- Variante: **TypeScript**

### 3. Instala las dependencias
```bash
npm install
npm install react-select
```

### 4. Ejecuta la app
```bash
npm run dev
```

Abre en tu navegador: `http://localhost:5173`

---

## 🛠️ Problemas comunes

### ❌ Error: scripts están deshabilitados
En PowerShell, ejecuta como administrador:

```powershell
Set-ExecutionPolicy RemoteSigned
```
Y luego responde con `Y`.

---

## 📦 Futuras integraciones
- Soporte **PWA** con `vite-plugin-pwa`
- Conexión a backend AWS
- Autenticación y roles
- Exportación de reportes

---

Proyecto mantenido por el equipo GrafomotorIA ✨


---

## 📁 Estructura explicada del proyecto

### Carpetas en `/src`

| Carpeta           | Propósito                                                                 |
|-------------------|---------------------------------------------------------------------------|
| `assets/`         | Imágenes, íconos, fuentes, estilos globales u otros recursos visuales     |
| `components/`     | Componentes **reutilizables**, como botones, tarjetas, inputs, formularios |
| `context/`        | Contextos de React para manejar **estado global**, como usuario autenticado |
| `hooks/`          | Hooks personalizados como `useForm`, `useSession`, etc.                   |
| `models/`         | Tipos e interfaces TypeScript (`Paciente`, `Sesión`, etc.)                 |
| `pages/`          | Vistas principales o páginas (por ruta), como `Dashboard`, `Login`         |
| `routes/`         | Configuración de rutas de React Router (si usas rutas declarativas)       |
| `services/`       | Lógica de negocio y peticiones HTTP al backend (API REST, etc.)           |
| `utils/`          | Funciones auxiliares, como formatear fechas, validar formularios, etc.    |

### Archivos dentro de `/src`

| Archivo             | Propósito                                                                 |
|---------------------|--------------------------------------------------------------------------|
| `App.tsx`           | Componente raíz: donde se declara el layout general y rutas principales |
| `main.tsx`          | Punto de entrada. Aquí se monta `App` en el DOM con React                |
| `App.css` / `index.css` | Estilos generales para toda la aplicación                              |
| `vite-env.d.ts`     | Tipos automáticos para TypeScript generados por Vite                     |

### Carpetas/archivos fuera de `/src`

| Carpeta/Archivo      | Propósito                                                               |
|----------------------|------------------------------------------------------------------------|
| `public/`            | Archivos públicos que no pasan por Webpack/Vite (ej: `manifest.json`, íconos) |
| `node_modules/`      | Dependencias instaladas por npm (no editar)                            |

### Archivos de configuración

| Archivo               | Propósito                                                                 |
|------------------------|--------------------------------------------------------------------------|
| `.gitignore`           | Archivos o carpetas que Git debe ignorar (ej: `node_modules`)            |
| `package.json`         | Lista de dependencias, scripts npm, configuración general del proyecto   |
| `package-lock.json`    | Versión exacta de dependencias instaladas                               |
| `vite.config.ts`       | Configuración de Vite (plugins, alias, etc.)                            |
| `tsconfig.json`        | Configuración global de TypeScript                                       |
| `tsconfig.app.json`    | Config específica para el código fuente                                  |
| `tsconfig.node.json`   | Config para herramientas que corren en Node (como Vite)                 |
| `eslint.config.js`     | Reglas de estilo y errores de código (opcional, si tienes ESLint activo) |
| `README.md`            | Documento de guía con instrucciones de instalación y uso                 |

