
# Backend Miniproyecto 2

Servidor backend desarrollado con Node.js, Express, TypeScript y Socket.IO como base para el sistema de chat y comunicación en tiempo real del proyecto.

## Tecnologías Utilizadas

- Node.js
- Express
- TypeScript
- Socket.IO
- Dotenv
- CORS
- Git & GitHub

---

# Instalación del Proyecto

## 1. Clonar el repositorio

```bash
git clone https://github.com/camilocord879/Backend-Miniproyecto-2.git
```

---

## 2. Entrar a la carpeta del proyecto

```bash
cd Backend-Miniproyecto-2
```

---

## 3. Instalar dependencias

```bash
npm install
```

---

# Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto.

Ejemplo:

```env
PORT=3000
```

---

# Ejecutar el Proyecto

## Modo desarrollo

```bash
npm run dev
```

---

# Endpoint de Prueba

## Ping del servidor

```http
GET /ping
```

Respuesta esperada:

```json
{
  "message": "Servidor funcionando correctamente"
}
```

---

# Estructura del Proyecto

```bash
backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── socket/
│   │   └── index.ts
│   ├── app.ts
│   └── server.ts
│
├── node_modules/
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

# Funcionalidades Implementadas

- Configuración base de Express
- Configuración de TypeScript
- Configuración inicial de Socket.IO
- Variables de entorno con dotenv
- Endpoint de prueba `/ping`
- Arquitectura inicial escalable
- Configuración para tiempo real

---

# Scripts Disponibles

## Ejecutar en desarrollo

```bash
npm run dev
```

## Compilar TypeScript

```bash
npm run build
```

## Ejecutar versión compilada

```bash
npm start
```

---

# Estado del Proyecto

Sprint 0 completado:

- Arquitectura base
- Servidor inicial
- Configuración WebSockets
- Integración GitHub
- Base preparada para Swagger y Firebase

---

# Autor

Camilo Córdoba