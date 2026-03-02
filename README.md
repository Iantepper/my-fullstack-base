# Plataforma de Networking y Mentoreo Profesional

Sistema de gestión de mentorías que conecta mentores con estudiantes. Permite agendar sesiones, gestionar disponibilidad y dejar feedback.

## 📋 TABLA DE CONTENIDOS
- [Requisitos Previos](#requisitos-previos)
- [Instalación Rápida](#instalación-rápida)
- [Instalación Paso a Paso](#instalación-paso-a-paso)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Base de Datos](#base-de-datos)
  - [Migraciones](#migraciones)
  - [Seed de Datos](#seed-de-datos)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Cuentas de Prueba](#cuentas-de-prueba)
- [Solución de Problemas](#solución-de-problemas)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)

## ⚙️ REQUISITOS PREVIOS

- **Node.js** v18 o superior
- **MongoDB** v6 o superior (local o Atlas)
- **Git**
- **npm** o **yarn**

## 🚀 INSTALACIÓN RÁPIDA (Todo en uno)

```bash
# 1. Clonar el repositorio
git clone https://github.com/Iantepper/my-fullstack-base
cd base-react-ts

# 2. Instalar dependencias del frontend
npm install

# 3. Instalar dependencias del backend
cd backend-mentores
npm install
cd ..

# 4. Ejecutar migraciones
npm run migrate:up

# 5. Cargar datos de prueba
npm run seed

# 6. Iniciar backend y frontend
npm run dev:backend
npm run dev:frontend
```

## 📦 INSTALACIÓN PASO A PASO

### Backend

```bash
# Entrar al directorio del backend
cd backend-mentores

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus datos
```

**Archivo `.env` necesario:**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/mentores-pro
JWT_SECRET=tu_clave_secreta_aqui_cambiar_en_produccion
NODE_ENV=development
```

### Frontend

```bash
# Volver a la raíz y entrar al frontend
cd ..
npm install

# Configurar variables de entorno
cp .env.example .env
```

**Archivo `.env` frontend:**
```env
VITE_API_URL=http://localhost:3001/api
```

## 🗄️ BASE DE DATOS

### Migraciones

Las migraciones crean la estructura de la base de datos:

```bash
# Aplicar migraciones
npm run migrate:up

# Ver estado de migraciones
npm run migrate:status

# Revertir última migración
npm run migrate:down
```

**Migraciones disponibles:**
- `create-users.js` - Creación de usuarios
- `create-mentors.js` - Perfiles de mentores
- `create-sessions.js` - Sesiones de mentoring
- `create-feedback.js` - Reseñas y calificaciones
- `create-availabilities.js` - Disponibilidad horaria

### Seed de Datos

Carga datos de prueba para desarrollo:

```bash
npm run seed
```

Esto creará:
- 3 mentores con perfiles completos
- 5 estudiantes (mentees)
- Sesiones de ejemplo
- Feedback de prueba
- Disponibilidades para los mentores

## 🏃 EJECUCIÓN

### Desarrollo (Backend + Frontend separados)

**Terminal 1 - Backend:**
```bash
cd backend-mentores
npm run dev
# Servidor en http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Aplicación en http://localhost:5173
```

### Desarrollo (Todo en uno - desde la raíz)

```bash
# Instalar concurrently si no está
npm install -D concurrently

# En package.json agregar script:
"dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\""

# Ejecutar
npm run dev
```

### Producción

```bash
# Backend
cd backend-mentores
npm run build
npm start

# Frontend
npm run build
# Servir ./dist con nginx/serve
```

## 📁 ESTRUCTURA DEL PROYECTO

```
/
├── backend-mentores/          # Backend API
│   ├── src/
│   │   ├── controllers/      # Lógica de negocio
│   │   ├── models/           # Modelos de MongoDB
│   │   ├── routes/           # Rutas de la API
│   │   ├── middleware/       # Auth y validaciones
│   │   ├── utils/            # Utilidades (logger)
│   │   └── server.ts         # Punto de entrada
│   ├── logs/                  # Archivos de log
│   └── package.json
│
├── src/                       # Frontend React
│   ├── modules/               # Módulos de la app
│   │   ├── auth/              # Login/Register
│   │   ├── mentors/           # Gestión de mentores
│   │   ├── sessions/          # Sesiones
│   │   ├── availability/      # Disponibilidad
│   │   └── feedback/          # Reseñas
│   ├── services/              # API services
│   ├── hooks/                 # Custom hooks
│   └── routes/                # Router configuración
│
├── migrations/                 # Migraciones BD
├── scripts/                    # Scripts utilidades
├── logs/                       # Logs de aplicación
└── package.json
```

## 🔌 API ENDPOINTS

### Autenticación
```
POST   /api/auth/register    # Registro de usuario
POST   /api/auth/login       # Inicio de sesión
```

### Usuarios
```
GET    /api/users/profile    # Perfil del usuario
PUT    /api/users/profile    # Actualizar perfil
```

### Mentores
```
GET    /api/mentors          # Listar mentores
GET    /api/mentors/:id      # Detalle de mentor
POST   /api/mentors          # Crear perfil de mentor
```

### Sesiones
```
GET    /api/sessions/my      # Mis sesiones (mentee)
GET    /api/sessions/mentor  # Sesiones como mentor
POST   /api/sessions         # Crear sesión
PATCH  /api/sessions/:id     # Actualizar estado
DELETE /api/sessions/:id     # Cancelar sesión
```

### Disponibilidad
```
GET    /api/availability/:mentorId    # Ver disponibilidad
POST   /api/availability              # Configurar disponibilidad
```

### Feedback
```
POST   /api/feedback/:sessionId       # Dejar feedback
GET    /api/feedback/mentor/:mentorId # Ver feedback de mentor
```

## 👥 CUENTAS DE PRUEBA

Después de ejecutar `npm run seed`, puedes usar:

**Mentores:**
```
Email: ana.mentor@test.com
Password: password123
Rol: mentor

Email: carlos.mentor@test.com  
Password: password123
Rol: mentor
```

**Mentees:**
```
Email: juan.estudiante@test.com
Password: password123
Rol: mentee

Email: maria.estudiante@test.com
Password: password123
Rol: mentee
```

Ver `TEST_ACCOUNTS.txt` para más cuentas.

## 🔧 SOLUCIÓN DE PROBLEMAS

### Error de conexión a MongoDB
```bash
# Verificar que MongoDB está corriendo
mongod --version
# En Windows: 
net start MongoDB
# En Mac/Linux:
sudo systemctl status mongod
```

### Error "JWT_SECRET not defined"
```bash
# Asegurar que .env tiene la variable
echo "JWT_SECRET=tu_clave_secreta" >> .env
```

### Migraciones no se ejecutan
```bash
# Verificar conexión a BD
npm run migrate:status
# Si hay error, revisar MONGODB_URI en .env
```

### Puerto en uso
```bash
# Cambiar puerto en .env
PORT=3002
```

## 🛠️ TECNOLOGÍAS UTILIZADAS

### Backend
- **Node.js** + **Express** - Servidor API
- **MongoDB** + **Mongoose** - Base de datos
- **JWT** - Autenticación
- **migrate-mongo** - Migraciones
- **Winston / fs** - Logging de errores
- **TypeScript** - Tipado estático

### Frontend
- **React** + **Vite** - UI y build tool
- **TypeScript** - Tipado estático
- **React Router** - Navegación
- **Context API / Hooks** - Estado global
- **Ant Design / MaterialUI** - Componentes UI

## 📄 LICENCIA

Este proyecto es creado con fines educativos para el curso de Programación 3.

## 👨‍💻 AUTOR

Ian Tepper - ian_sber@live.com.ar
