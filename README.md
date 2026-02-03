# Sistema de Autenticación y Gestión de Usuarios

## Descripción General

Este sistema proporciona una solución completa de autenticación y gestión de usuarios para aplicaciones web basadas en Express y React con SQLite como base de datos. Implementa un enfoque de token doble (access token y refresh token) utilizando cookies HTTP-only seguras, lo que proporciona mayor seguridad contra ataques XSS y CSRF.

## Características Principales

-  Registro y autenticación de usuarios
-  Autenticación con JWT en cookies HTTP-only
-  Login con proveedores externos (Google OAuth)
-  Gestión de sesiones con refresh tokens
-  Recuperación y restablecimiento de contraseñas
-  Verificación de cuentas
-  Gestión de estado de usuarios (activo, suspendido, requiere verificación)
-  Sistema de detección de comportamiento sospechoso
-  Limitación de tasa (rate limiting) para prevenir ataques
-  Registro detallado de actividad de usuarios
-  Permisos basados en roles

## Estructura de la Base de Datos

### Tablas Principales

1. **users**: Almacena la información básica de los usuarios
   -  `user_id`: Identificador único (UUID)
   -  `username`: Nombre de usuario único
   -  `email`: Email único
   -  `password`: Contraseña hasheada con bcrypt
   -  `google_id`: ID de Google (opcional)
   -  `status`: Estado del usuario ('active', 'suspended', 'requires_verification')
   -  `created_at`: Fecha de creación
   -  `updated_at`: Fecha de última actualización
2. **profiles**: Almacena información adicional del perfil
   -  `id`: Identificador numérico
   -  `user_id`: Relación con la tabla users
   -  `avatar_url`: URL de la imagen de perfil
   -  `bio`: Descripción del usuario
   -  `social_links`: Enlaces a redes sociales (JSON)
   -  `preferences`: Preferencias del usuario (JSON)
3. **refresh_tokens**: Gestiona los tokens de refresco
   -  `id`: Identificador numérico
   -  `user_id`: Usuario al que pertenece el token
   -  `token`: Token JWT
   -  `expires_at`: Fecha de expiración
   -  `revoked`: Indica si ha sido revocado
4. **password_resets**: Gestiona solicitudes de restablecimiento de contraseña
   -  `id`: Identificador numérico
   -  `user_id`: Usuario que solicitó el reset
   -  `token`: Token único para restablecer
   -  `expires_at`: Fecha de expiración del token
   -  `used`: Indica si ya fue utilizado
5. **account_verifications**: Gestiona verificaciones de cuentas
   -  `id`: Identificador numérico
   -  `user_id`: Usuario a verificar
   -  `token`: Token único para verificación
   -  `expires_at`: Fecha de expiración
   -  `used`: Indica si ya fue utilizado
6. **auth_providers**: Gestiona proveedores de autenticación externos
   -  `id`: Identificador numérico
   -  `user_id`: Usuario vinculado
   -  `provider`: Nombre del proveedor (google, facebook, etc.)
   -  `provider_user_id`: ID del usuario en el proveedor
7. **user_activity_logs**: Registra la actividad de los usuarios
   -  `id`: Identificador numérico
   -  `user_id`: Usuario que realizó la acción
   -  `action`: Tipo de acción
   -  `ip`: Dirección IP
   -  `user_agent`: Agente de usuario (navegador)
   -  `details`: Detalles adicionales (JSON)
   -  `created_at`: Fecha y hora de la acción

## Flujos de Autenticación

### Registro de Usuario

1. El cliente envía datos de registro (username, email, password)
2. Se valida la unicidad del email y username
3. Se hashea la contraseña con bcrypt
4. Se crea el usuario con estado 'active'
5. Se crea un perfil vacío asociado
6. Se generan tokens de acceso y refresco
7. Se establecen cookies seguras con los tokens
8. Se devuelven los datos básicos del usuario

### Login

1. El cliente envía credenciales (email, password)
2. Se verifica si el usuario existe y está activo
3. Se verifica la contraseña con bcrypt
4. Se generan tokens de acceso y refresco
5. Se registra el inicio de sesión exitoso
6. Se establecen cookies seguras con los tokens
7. Se devuelven los datos básicos del usuario

### Refresh Token

1. Se extrae el refresh token de la cookie
2. Se verifica que el token existe en la base de datos y no está revocado
3. Se verifica la firma JWT y se obtiene el ID del usuario
4. Se comprueba que el usuario existe y está activo
5. Se generan nuevos tokens
6. Se revoca el token anterior
7. Se establecen nuevas cookies con los nuevos tokens

### Logout

1. Se extrae el refresh token de la cookie
2. Se elimina el token de la base de datos si existe
3. Se eliminan las cookies de autenticación
4. Se confirma el logout exitoso

### Recuperación de Contraseña

1. **Solicitud de recuperación**:
   -  El cliente envía el email
   -  Se verifica si el usuario existe
   -  Se genera un token único con expiración de 1 hora
   -  Se envía email con enlace que incluye el token
2. **Restablecimiento**:
   -  El cliente envía token y nueva contraseña
   -  Se verifica que el token existe, no ha expirado y no ha sido usado
   -  Se hashea la nueva contraseña y se actualiza
   -  Se marca el token como usado
   -  Se revocan todos los tokens de refresh existentes

### Autenticación con Google

1. El cliente obtiene un token de Google y lo envía al backend
2. El backend verifica el token con Google
3. Se busca si ya existe un usuario vinculado a ese ID de Google
4. Si no existe, se verifica si existe un usuario con ese email
   -  Si existe, se vincula la cuenta Google
   -  Si no existe, se crea un nuevo usuario y perfil
5. Se generan tokens y cookies
6. Se devuelven los datos del usuario

### Suspensión de Cuentas

1. Un administrador envía el ID del usuario y motivo
2. Se cambia el estado del usuario a 'suspended'
3. Se revocan todos los tokens de refresh
4. Se registra la acción con el motivo
5. Opcionalmente se notifica al usuario

### Verificación de Cuentas

1. **Solicitud de verificación**:
   -  El usuario solicita verificación con su email
   -  Se genera un token único con expiración de 24 horas
   -  Se envía email con enlace que incluye el token
2. **Proceso de verificación**:
   -  El usuario hace clic en el enlace y envía el token
   -  Se verifica que el token existe, no ha expirado y no ha sido usado
   -  Se cambia el estado del usuario a 'active'
   -  Se marca el token como usado

## Seguridad

### Medidas Implementadas

1. **Cookies HTTP-only seguras**:
   -  Los tokens no son accesibles mediante JavaScript
   -  Opción 'secure' para transmisión solo por HTTPS
   -  Opción 'sameSite: strict' para prevenir CSRF
2. **Sistema de token doble**:
   -  Access token de corta duración (15 minutos)
   -  Refresh token de larga duración (7 días)
   -  Capacidad de revocación de todos los tokens
3. **Protección contra ataques de fuerza bruta**:
   -  Rate limiting en rutas sensibles
   -  Registro de intentos fallidos
   -  Bloqueo progresivo después de múltiples intentos
4. **Gestión de estado de usuarios**:
   -  Capacidad para suspender cuentas sospechosas
   -  Verificación de cuentas para mayor seguridad
   -  Validación de estado en cada solicitud autenticada
5. **Detección de comportamiento sospechoso**:
   -  Monitoreo de cambios inusuales de IP
   -  Detección de actividad en horarios anómalos
   -  Sistema de puntuación de riesgo
   -  Acción automática basada en nivel de riesgo
6. **Registro completo de actividad**:
   -  Logging de todas las acciones importantes
   -  Almacenamiento de IP y User-Agent
   -  Trazabilidad para investigación de incidentes

## API Endpoints

### Autenticación

-  `POST /api/auth/register`: Registro de nuevos usuarios
-  `POST /api/auth/login`: Inicio de sesión
-  `POST /api/auth/refresh-token`: Renovación de tokens
-  `POST /api/auth/logout`: Cierre de sesión
-  `POST /api/auth/forgot-password`: Solicitud de recuperación de contraseña
-  `POST /api/auth/reset-password`: Restablecimiento de contraseña
-  `POST /api/auth/google`: Autenticación con Google
-  `POST /api/auth/verify-request`: Solicitud de verificación de cuenta
-  `POST /api/auth/verify-account`: Verificación de cuenta

### Administración

-  `POST /api/auth/suspend-user`: Suspensión de cuentas (solo admin/moderador)

### Usuarios

-  `GET /api/users/profile`: Obtener datos del perfil
-  `PUT /api/users/profile`: Actualizar perfil
-  `GET /api/users/id/:id`: Buscar usuario por ID
-  `GET /api/users`: Listar usuarios (paginado, solo admin)

## Rate Limiting

-  Login: 5 intentos por 15 minutos
-  Registro: 3 cuentas por hora desde una IP
-  API general: 100 solicitudes por minuto

## Middleware

-  `authenticateJWT`: Verifica tokens de acceso y estado de usuario
-  `checkRole`: Valida permisos basados en roles
-  `loginLimiter`: Limita intentos de login
-  `registerLimiter`: Limita creación de cuentas
-  `apiLimiter`: Limita solicitudes a la API
-  `logActivity`: Registra actividad de los usuarios
-  `detectSuspiciousActivity`: Detecta comportamientos sospechosos

## Integración en Frontend (React)

-  Configuración de axios para incluir cookies automáticamente
-  Interceptor para manejo de renovación de tokens
-  Almacenamiento de datos de usuario en localStorage (no tokens)
-  Verificación de autenticación al iniciar la aplicación

## Consideraciones de Implementación

1. **Variables de entorno requeridas**:
   -  `JWT_SECRET`: Clave para firmar tokens de acceso
   -  `REFRESH_TOKEN_SECRET`: Clave para firmar tokens de refresco
   -  `FRONTEND_URL`: URL del frontend para enlaces en emails
   -  `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASSWORD`: Configuración de email
   -  `NODE_ENV`: 'production' o 'development'
2. **Paquetes NPM necesarios**:
   -  express
   -  cookie-parser
   -  jsonwebtoken
   -  bcrypt
   -  uuid
   -  nodemailer
   -  express-rate-limit
   -  better-sqlite3 (o tu driver de SQLite preferido)

## Mejoras Futuras

-  Implementación de autenticación de dos factores (2FA)
-  Adición de más proveedores OAuth (Facebook, Apple, Twitter)
-  Implementación de sistema de caché para tokens revocados
-  Historial detallado de dispositivos y sesiones activas
-  Notificaciones por email de inicios de sesión inusuales
-  Implementación de captcha para protección adicional
