# 🏠 CRM Inmobiliario - Sistema Completo de Gestión

> Sistema profesional de gestión de relaciones con clientes (CRM) especializado para el sector inmobiliario. Desarrollado con React, TypeScript y Supabase.

## 🚀 Estado del Proyecto

**✅ FUNCIONAL Y LISTO PARA PRODUCCIÓN**

- ✅ 120 viviendas de ejemplo en 3 promociones
- ✅ 100 clientes ficticios con datos realistas  
- ✅ Sistema completo de usuarios y roles
- ✅ Gestión de documentos y comisiones
- ✅ Reportes y estadísticas avanzadas
- ✅ Interfaz responsive y profesional

## 🏗️ Características Principales

### Gestión de Usuarios y Roles
- **Administrador**: Acceso completo al sistema, gestión de usuarios y asignación de permisos
- **Comercial**: Gestión de promociones asignadas, viviendas, clientes y documentos
- **Cliente**: Acceso limitado a sus viviendas y documentación personal

### Módulos del Sistema

#### 📊 Dashboard
- Indicadores clave de rendimiento (KPIs)
- Gráficos de ventas por promoción
- Distribución de estados de viviendas
- Actividad reciente del sistema

#### 🏢 Gestión de Promociones
- CRUD completo de promociones inmobiliarias
- Asignación de comerciales y comisiones
- Control de fases y estados
- Filtros y búsqueda avanzada

#### 🏠 Gestión de Viviendas
- Catálogo completo con 120 viviendas de ejemplo
- Características detalladas (planta, orientación, superficies, etc.)
- Estados de venta (activa, reservada, vendida, escriturada)
- Asignación de clientes y comerciales
- Importación masiva desde CSV/Excel

#### 👥 Gestión de Clientes
- Base de datos con 100 clientes ficticios
- Información completa (datos personales, contacto, bancarios)
- Relaciones familiares (compradores conjuntos)
- Historial de documentación

#### 📄 Sistema de Documentos
- Gestión de documentos por promoción, cliente y vivienda
- Control de versiones y visibilidad por roles
- Plantillas personalizables
- Carga y descarga de archivos

#### 📈 Reportes y Análisis
- Ventas totales y por promoción
- Rendimiento por comercial
- Reportes mensuales y anuales
- Exportación a PDF y Excel
- Cálculo de comisiones

### 🎨 Interfaz de Usuario
- Diseño moderno y responsive
- Navegación intuitiva con sidebar
- Filtros y búsquedas avanzadas
- Notificaciones en tiempo real
- Gráficos interactivos con Recharts

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **React Router** para navegación
- **React Hook Form** para formularios
- **Recharts** para gráficos
- **Lucide React** para iconos
- **React Hot Toast** para notificaciones

### Backend
- **Supabase** como BaaS (Backend as a Service)
- **PostgreSQL** como base de datos
- **Row Level Security (RLS)** para seguridad
- **Autenticación JWT** integrada

### Herramientas de Desarrollo
- **Vite** como bundler
- **ESLint** para linting
- **TypeScript** para tipado estático

## 📦 Instalación y Configuración

### 🔧 Instalación Rápida

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/crm-inmobiliario.git
cd crm-inmobiliario

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# 4. Iniciar servidor de desarrollo
npm run dev
```

### Prerrequisitos
- Node.js 18+ 
- Cuenta en Supabase
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd crm-inmobiliario
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Supabase**
- Crear un nuevo proyecto en [Supabase](https://supabase.com)
- Ejecutar las migraciones SQL desde la carpeta `supabase/migrations/`
- Copiar las credenciales del proyecto

4. **Configurar variables de entorno**
```bash
cp .env.example .env
```
Editar `.env` con tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

5. **Configurar autenticación en Supabase**
Para evitar errores de "Email not confirmed":
- Ve a tu dashboard de Supabase
- Navega a **Authentication** → **Settings**
- Desactiva **"Enable email confirmations"**
- Esto permite el login inmediato sin verificación de email

6. **Ejecutar migraciones**
Ejecutar los archivos SQL en el siguiente orden:
- `create_initial_schema.sql`
- `insert_sample_properties.sql`
- `insert_sample_clients.sql`
- `insert_promotion_assignments.sql`

7. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

## 👤 Usuarios de Prueba

El sistema incluye usuarios predefinidos para testing:

### Administrador
- **Email**: admin@crm.com
- **Contraseña**: admin123
- **Permisos**: Acceso completo al sistema

### Comerciales
- **Juan L. Herrero**: juan@crm.com / comercial123
- **Ignacio Tejerina**: ignacio@crm.com / comercial123
- **Yolanda Alba**: yolanda@crm.com / comercial123

### Cliente
- **Email**: cliente@crm.com
- **Contraseña**: cliente123
- **Permisos**: Acceso limitado a sus datos

## 📊 Datos de Ejemplo

### Promociones (3)
1. **Residencial Las Flores** (Madrid) - 40 viviendas
2. **Torre Azul** (Barcelona) - 40 viviendas  
3. **Jardines del Sur** (Valencia) - 40 viviendas

### Características de las Viviendas
- **Plantas**: 1-6 (incluye áticos)
- **Letras**: A-G
- **Dormitorios**: 1-3
- **Tipologías**: Interior/Exterior
- **Orientaciones**: Norte, Sur, Suroeste, Este, Oeste, Noroeste
- **Estados**: Activa, Reservada, Contrato firmado, Vendida, Escriturada

### Clientes (100)
- Datos ficticios pero realistas
- Variedad en ubicaciones geográficas
- Diferentes estados civiles
- Casos de compradores conjuntos (matrimonios)

## 🔒 Seguridad

### Row Level Security (RLS)
- Políticas de acceso basadas en roles
- Aislamiento de datos por usuario
- Protección contra accesos no autorizados

### Autenticación
- JWT tokens seguros
- Sesiones persistentes
- Logout automático por inactividad

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop**: Experiencia completa con sidebar
- **Tablet**: Navegación adaptada
- **Mobile**: Interfaz táctil optimizada

## 🔧 Funcionalidades Avanzadas

### Filtros y Búsquedas
- Filtros múltiples por promoción, estado, comercial
- Búsqueda en tiempo real
- Ordenación personalizable

### Exportación de Datos
- Reportes en PDF con jsPDF
- Gráficos exportables
- Datos tabulares en Excel

### Notificaciones
- Alertas de éxito/error
- Confirmaciones de acciones críticas
- Feedback visual inmediato

## 🚀 Despliegue

### Netlify (Recomendado)
```bash
npm run build
# Subir carpeta dist/ a Netlify
```

### Vercel
```bash
npm run build
vercel --prod
```

### Servidor Propio
```bash
npm run build
# Servir carpeta dist/ con nginx/apache
```

## 📈 Métricas y KPIs

El sistema proporciona métricas clave como:
- Total de promociones activas
- Viviendas vendidas vs disponibles
- Ingresos totales y por promoción
- Rendimiento por comercial
- Tendencias de ventas mensuales

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o consultas, crear un issue en GitHub.

## 🌟 Contribuidores

- **Desarrollador Principal**: [Tu nombre]
- **Asistente IA**: Claude (Anthropic)

---

**CRM Inmobiliario** - Gestión profesional para el sector inmobiliario 🏠 | Hecho con ❤️ y React