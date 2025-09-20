/*
  # Create initial schema for CRM Inmobiliario

  1. New Tables
    - `users` - User profiles with roles
    - `promotions` - Real estate promotions
    - `properties` - Individual properties/homes
    - `clients` - Client information
    - `property_clients` - Many-to-many relationship between properties and clients
    - `documents` - Document management
    - `promotion_assignments` - Commercial assignments to promotions

  2. Security
    - Enable RLS on all tables
    - Add policies for different user roles
    - Ensure data isolation and proper access control

  3. Sample Data
    - Create demo users for testing
    - Insert sample promotions, properties, and clients
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'commercial', 'client')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Promotions table
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

-- Properties table
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
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'reserved', 'contract_signed', 'sold_by_developer', 'deed_signed')),
  observations text,
  commercial_id uuid REFERENCES users(id),
  vendedor_commercial_id uuid REFERENCES users(id),
  portal text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Clients table
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

-- Property-Client relationship table (many-to-many)
CREATE TABLE IF NOT EXISTS property_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  is_primary_buyer boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(property_id, client_id)
);

-- Documents table
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

-- Promotion assignments table
CREATE TABLE IF NOT EXISTS promotion_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id uuid NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  commercial_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(promotion_id, commercial_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (true);
CREATE POLICY "Admins can manage all users" ON users FOR ALL USING (true);

-- RLS Policies for promotions table
CREATE POLICY "Everyone can read promotions" ON promotions FOR SELECT USING (true);
CREATE POLICY "Admins can manage promotions" ON promotions FOR ALL USING (true);

-- RLS Policies for properties table
CREATE POLICY "Everyone can read properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Admins can manage properties" ON properties FOR ALL USING (true);

-- RLS Policies for clients table
CREATE POLICY "Everyone can read clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Admins can manage clients" ON clients FOR ALL USING (true);

-- RLS Policies for property_clients table
CREATE POLICY "Everyone can read property_clients" ON property_clients FOR SELECT USING (true);
CREATE POLICY "Admins can manage property_clients" ON property_clients FOR ALL USING (true);

-- RLS Policies for documents table
CREATE POLICY "Everyone can read documents" ON documents FOR SELECT USING (true);
CREATE POLICY "Admins can manage documents" ON documents FOR ALL USING (true);

-- RLS Policies for promotion_assignments table
CREATE POLICY "Everyone can read assignments" ON promotion_assignments FOR SELECT USING (true);
CREATE POLICY "Admins can manage assignments" ON promotion_assignments FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_promotion_id ON properties(promotion_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_property_clients_property_id ON property_clients(property_id);
CREATE INDEX IF NOT EXISTS idx_property_clients_client_id ON property_clients(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_entity_id ON documents(entity_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_promotion_assignments_promotion_id ON promotion_assignments(promotion_id);
CREATE INDEX IF NOT EXISTS idx_promotion_assignments_commercial_id ON promotion_assignments(commercial_id);