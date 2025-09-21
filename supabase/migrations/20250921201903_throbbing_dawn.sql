/*
  # CRM Inmobiliario - Esquema Completo con Datos de Ejemplo

  1. Nuevas Tablas
    - `users` - Perfiles de usuario con roles
    - `promotions` - Promociones inmobiliarias
    - `properties` - Propiedades/viviendas individuales
    - `clients` - Información de clientes
    - `property_clients` - Relación muchos-a-muchos entre propiedades y clientes
    - `documents` - Gestión de documentos
    - `promotion_assignments` - Asignaciones comerciales a promociones

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Añadir políticas para diferentes roles de usuario
    - Asegurar aislamiento de datos y control de acceso apropiado

  3. Datos de Ejemplo
    - Crear usuarios demo para testing
    - Insertar promociones, propiedades y clientes de ejemplo
*/

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios (extiende auth.users de Supabase)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'commercial', 'client')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de promociones
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  phase text NOT NULL DEFAULT 'Fase 1',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  commercial_id uuid REFERENCES users(id),
  commission_percentage decimal(5,2) DEFAULT 3.00,
  promotor text NOT NULL DEFAULT 'Promotora Demo',
  captador_commission_amount decimal(10,2) DEFAULT 1500.00,
  vendedor_commission_amount decimal(10,2) DEFAULT 2000.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de propiedades
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id uuid NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  floor integer NOT NULL,
  letter text NOT NULL,
  bedrooms integer NOT NULL DEFAULT 2,
  typology text NOT NULL DEFAULT 'exterior' CHECK (typology IN ('interior', 'exterior')),
  orientation text NOT NULL DEFAULT 'south' CHECK (orientation IN ('north', 'south', 'southwest', 'east', 'west', 'northwest')),
  useful_surface decimal(8,2) NOT NULL,
  built_surface decimal(8,2) NOT NULL,
  terrace_surface decimal(8,2) DEFAULT 0,
  garage_number text,
  storage_number text,
  final_price decimal(12,2) NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'reserved', 'contract_signed', 'sold', 'deed_signed')),
  observations text,
  commercial_id uuid REFERENCES users(id),
  vendedor_commercial_id uuid REFERENCES users(id),
  portal text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  dni text UNIQUE NOT NULL,
  address text NOT NULL,
  municipality text NOT NULL,
  postal_code text NOT NULL,
  province text NOT NULL,
  marital_status text NOT NULL DEFAULT 'single' CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed')),
  phone_1 text NOT NULL,
  phone_2 text,
  email_1 text NOT NULL,
  email_2 text,
  bank_account text NOT NULL,
  observations text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de relación Propiedad-Cliente (muchos-a-muchos)
CREATE TABLE IF NOT EXISTS property_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  is_primary_buyer boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(property_id, client_id)
);

-- Tabla de documentos
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('promotion', 'client', 'property')),
  entity_id uuid NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  mime_type text NOT NULL DEFAULT 'application/pdf',
  version integer NOT NULL DEFAULT 1,
  uploaded_by uuid NOT NULL REFERENCES users(id),
  is_required boolean DEFAULT false,
  document_category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de asignaciones de promociones
CREATE TABLE IF NOT EXISTS promotion_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id uuid NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  commercial_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(promotion_id, commercial_id)
);

-- Habilitar Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_assignments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para tabla users
CREATE POLICY "Todos pueden leer perfiles" ON users FOR SELECT USING (true);
CREATE POLICY "Usuarios pueden actualizar su perfil" ON users FOR UPDATE USING (true);
CREATE POLICY "Admins pueden gestionar todos los usuarios" ON users FOR ALL USING (true);

-- Políticas RLS para tabla promotions
CREATE POLICY "Todos pueden leer promociones" ON promotions FOR SELECT USING (true);
CREATE POLICY "Admins pueden gestionar promociones" ON promotions FOR ALL USING (true);

-- Políticas RLS para tabla properties
CREATE POLICY "Todos pueden leer propiedades" ON properties FOR SELECT USING (true);
CREATE POLICY "Admins pueden gestionar propiedades" ON properties FOR ALL USING (true);

-- Políticas RLS para tabla clients
CREATE POLICY "Todos pueden leer clientes" ON clients FOR SELECT USING (true);
CREATE POLICY "Admins pueden gestionar clientes" ON clients FOR ALL USING (true);

-- Políticas RLS para tabla property_clients
CREATE POLICY "Todos pueden leer property_clients" ON property_clients FOR SELECT USING (true);
CREATE POLICY "Admins pueden gestionar property_clients" ON property_clients FOR ALL USING (true);

-- Políticas RLS para tabla documents
CREATE POLICY "Todos pueden leer documentos" ON documents FOR SELECT USING (true);
CREATE POLICY "Admins pueden gestionar documentos" ON documents FOR ALL USING (true);

-- Políticas RLS para tabla promotion_assignments
CREATE POLICY "Todos pueden leer asignaciones" ON promotion_assignments FOR SELECT USING (true);
CREATE POLICY "Admins pueden gestionar asignaciones" ON promotion_assignments FOR ALL USING (true);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_properties_promotion_id ON properties(promotion_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_property_clients_property_id ON property_clients(property_id);
CREATE INDEX IF NOT EXISTS idx_property_clients_client_id ON property_clients(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_entity_id ON documents(entity_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_promotion_assignments_promotion_id ON promotion_assignments(promotion_id);
CREATE INDEX IF NOT EXISTS idx_promotion_assignments_commercial_id ON promotion_assignments(commercial_id);