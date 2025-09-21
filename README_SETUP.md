# 🚀 Configuración de Base de Datos - CRM Inmobiliario

## 📋 Instrucciones para Configurar Supabase

### 1. Crear Proyecto en Supabase
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Haz clic en "New Project"
3. Elige tu organización
4. Asigna un nombre al proyecto: `crm-inmobiliario`
5. Crea una contraseña segura para la base de datos
6. Selecciona una región cercana
7. Haz clic en "Create new project"

### 2. Ejecutar Migraciones SQL

Una vez creado el proyecto:

1. **Ve a SQL Editor**:
   - En el dashboard de Supabase, ve a "SQL Editor"
   - Haz clic en "New query"

2. **Ejecutar primera migración**:
   - Copia todo el contenido de `supabase/migrations/create_complete_schema.sql`
   - Pégalo en el editor SQL
   - Haz clic en "Run" (▶️)
   - Espera a que se complete (debería mostrar "Success")

3. **Ejecutar segunda migración**:
   - Crea una nueva query
   - Copia todo el contenido de `supabase/migrations/insert_sample_data.sql`
   - Pégalo en el editor SQL
   - Haz clic en "Run" (▶️)
   - Espera a que se complete

### 3. Verificar Datos

Después de ejecutar las migraciones, verifica que los datos se insertaron correctamente:

1. **Ve a Table Editor**:
   - En el sidebar, haz clic en "Table Editor"
   - Deberías ver las siguientes tablas:
     - `users` (5 usuarios)
     - `promotions` (3 promociones)
     - `properties` (~32 propiedades)
     - `clients` (20 clientes)
     - `property_clients` (relaciones)
     - `documents` (documentos de ejemplo)
     - `promotion_assignments` (asignaciones)

2. **Verificar contenido**:
   - Haz clic en cada tabla para ver los datos
   - Confirma que hay registros en cada una

### 4. Obtener Credenciales

1. **Ve a Settings → API**:
   - En el sidebar, ve a "Settings"
   - Haz clic en "API"
   - Copia la "Project URL"
   - Copia la "anon public" key

2. **Configurar variables de entorno**:
   - La URL del proyecto
   - La clave anónima (anon key)

### 5. Configurar Autenticación (Opcional)

Si quieres usar el sistema de login:

1. **Ve a Authentication → Settings**:
   - Busca "Enable email confirmations"
   - Desactívalo para facilitar las pruebas

2. **Crear usuarios manualmente** (alternativa):
   - Ve a Authentication → Users
   - Haz clic en "Add user"
   - Crea usuarios con los emails de la tabla `users`

## 📊 Datos de Ejemplo Incluidos

### Usuarios (5)
- **admin@crm.com** - Administrador Sistema
- **juan@crm.com** - Juan L. Herrero (Comercial)
- **ignacio@crm.com** - Ignacio Tejerina (Comercial)
- **yolanda@crm.com** - Yolanda Alba (Comercial)
- **cliente@crm.com** - Cliente Demo

### Promociones (3)
1. **Residencial Las Flores** (Madrid) - 24 viviendas
2. **Torre Azul** (Barcelona) - 12 viviendas
3. **Jardines del Sur** (Valencia) - 8 viviendas

### Propiedades (~44 total)
- Diferentes plantas (1-6)
- Variedad de dormitorios (1-3)
- Diferentes orientaciones
- Estados variados (activa, reservada, vendida, etc.)
- Precios realistas

### Clientes (20)
- Datos españoles realistas
- Diferentes provincias
- Estados civiles variados
- Información completa de contacto

## 🔧 Solución de Problemas

### Error: "relation does not exist"
- Asegúrate de ejecutar primero `create_complete_schema.sql`
- Verifica que todas las tablas se crearon correctamente

### Error: "duplicate key value"
- Normal en la segunda ejecución
- Los `ON CONFLICT DO NOTHING` evitan duplicados

### No se ven datos en la aplicación
- Verifica las variables de entorno
- Confirma que las credenciales son correctas
- Revisa la consola del navegador para errores

### Problemas de permisos
- Las políticas RLS están configuradas para permitir acceso público
- Si hay problemas, revisa las políticas en "Authentication → Policies"

## ✅ Verificación Final

Una vez completada la configuración:

1. ✅ Proyecto Supabase creado
2. ✅ Migraciones ejecutadas sin errores
3. ✅ Datos visibles en Table Editor
4. ✅ Variables de entorno configuradas
5. ✅ Aplicación conectada y mostrando datos

¡Tu CRM Inmobiliario debería estar funcionando completamente! 🎉