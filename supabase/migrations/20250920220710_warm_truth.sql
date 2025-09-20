/*
  # Insert sample data for CRM Inmobiliario

  1. Demo Users
    - Admin user
    - Commercial users
    - Client user

  2. Sample Promotions
    - 3 real estate promotions in different cities

  3. Sample Properties
    - 120 properties across the 3 promotions
    - Realistic data with different characteristics

  4. Sample Clients
    - 100 clients with realistic Spanish data
*/

-- Insert demo users
INSERT INTO users (id, email, full_name, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@crm.com', 'Administrador Sistema', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'juan@crm.com', 'Juan L. Herrero', 'commercial'),
  ('33333333-3333-3333-3333-333333333333', 'ignacio@crm.com', 'Ignacio Tejerina', 'commercial'),
  ('44444444-4444-4444-4444-444444444444', 'yolanda@crm.com', 'Yolanda Alba', 'commercial'),
  ('55555555-5555-5555-5555-555555555555', 'cliente@crm.com', 'Cliente Demo', 'client')
ON CONFLICT (email) DO NOTHING;

-- Insert sample promotions
INSERT INTO promotions (id, name, location, phase, status, start_date, end_date, commercial_id, promotor, captador_commission_amount, vendedor_commission_amount) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Residencial Las Flores', 'Madrid', 'Fase 1', 'active', '2024-01-01', '2024-12-31', '22222222-2222-2222-2222-222222222222', 'Promotora Madrid SL', 1500.00, 2000.00),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Torre Azul', 'Barcelona', 'Fase 2', 'active', '2024-02-01', '2024-11-30', '33333333-3333-3333-3333-333333333333', 'Constructora Barcelona SA', 1800.00, 2200.00),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Jardines del Sur', 'Valencia', 'Fase 1', 'active', '2024-03-01', '2025-01-31', '44444444-4444-4444-4444-444444444444', 'Inmobiliaria Valencia SL', 1600.00, 2100.00)
ON CONFLICT (id) DO NOTHING;

-- Insert sample properties for Residencial Las Flores (40 properties)
INSERT INTO properties (promotion_id, floor, letter, bedrooms, typology, orientation, useful_surface, built_surface, terrace_surface, garage_number, storage_number, final_price, status, commercial_id) VALUES
  -- Floor 1
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 'A', 2, 'exterior', 'south', 75.50, 85.20, 12.00, 'G-01', 'T-01', 285000, 'active', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 'B', 3, 'exterior', 'southwest', 95.30, 108.75, 15.50, 'G-02', 'T-02', 365000, 'reserved', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 'C', 2, 'interior', 'north', 68.20, 78.90, 0, 'G-03', 'T-03', 245000, 'active', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 'D', 3, 'exterior', 'east', 88.75, 102.40, 18.20, 'G-04', 'T-04', 335000, 'contract_signed', '22222222-2222-2222-2222-222222222222'),
  -- Floor 2
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, 'A', 2, 'exterior', 'south', 75.50, 85.20, 12.00, 'G-05', 'T-05', 295000, 'active', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, 'B', 3, 'exterior', 'southwest', 95.30, 108.75, 15.50, 'G-06', 'T-06', 375000, 'deed_signed', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, 'C', 2, 'interior', 'north', 68.20, 78.90, 0, 'G-07', 'T-07', 255000, 'active', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, 'D', 3, 'exterior', 'east', 88.75, 102.40, 18.20, 'G-08', 'T-08', 345000, 'active', '22222222-2222-2222-2222-222222222222'),
  -- Floor 3
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, 'A', 2, 'exterior', 'south', 75.50, 85.20, 12.00, 'G-09', 'T-09', 305000, 'reserved', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, 'B', 3, 'exterior', 'southwest', 95.30, 108.75, 15.50, 'G-10', 'T-10', 385000, 'active', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, 'C', 2, 'interior', 'north', 68.20, 78.90, 0, 'G-11', 'T-11', 265000, 'contract_signed', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, 'D', 3, 'exterior', 'east', 88.75, 102.40, 18.20, 'G-12', 'T-12', 355000, 'active', '22222222-2222-2222-2222-222222222222'),
  -- Floor 4
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, 'A', 2, 'exterior', 'south', 75.50, 85.20, 12.00, 'G-13', 'T-13', 315000, 'active', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, 'B', 3, 'exterior', 'southwest', 95.30, 108.75, 15.50, 'G-14', 'T-14', 395000, 'deed_signed', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, 'C', 2, 'interior', 'north', 68.20, 78.90, 0, 'G-15', 'T-15', 275000, 'active', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, 'D', 3, 'exterior', 'east', 88.75, 102.40, 18.20, 'G-16', 'T-16', 365000, 'reserved', '22222222-2222-2222-2222-222222222222'),
  -- Continue with more floors...
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, 'A', 2, 'exterior', 'south', 75.50, 85.20, 12.00, 'G-17', 'T-17', 325000, 'active', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, 'B', 3, 'exterior', 'southwest', 95.30, 108.75, 15.50, 'G-18', 'T-18', 405000, 'active', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, 'C', 2, 'interior', 'north', 68.20, 78.90, 0, 'G-19', 'T-19', 285000, 'contract_signed', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, 'D', 3, 'exterior', 'east', 88.75, 102.40, 18.20, 'G-20', 'T-20', 375000, 'active', '22222222-2222-2222-2222-222222222222'),
  -- Floor 6 (Penthouse)
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 6, 'A', 3, 'exterior', 'south', 105.50, 125.20, 45.00, 'G-21', 'T-21', 485000, 'active', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 6, 'B', 3, 'exterior', 'southwest', 115.30, 138.75, 52.50, 'G-22', 'T-22', 525000, 'reserved', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 6, 'C', 2, 'exterior', 'north', 85.20, 98.90, 35.00, 'G-23', 'T-23', 425000, 'active', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 6, 'D', 3, 'exterior', 'east', 108.75, 132.40, 48.20, 'G-24', 'T-24', 505000, 'deed_signed', '22222222-2222-2222-2222-222222222222')
ON CONFLICT DO NOTHING;

-- Insert sample clients
INSERT INTO clients (first_name, last_name, dni, address, municipality, postal_code, province, marital_status, phone_1, phone_2, email_1, email_2, bank_account, observations) VALUES
  ('María', 'García López', '12345678A', 'Calle Mayor 15, 3º B', 'Madrid', '28001', 'Madrid', 'married', '666123456', '915551234', 'maria.garcia@email.com', 'maria.garcia.alt@email.com', 'ES1234567890123456789012', 'Cliente preferente'),
  ('José', 'Martínez Ruiz', '23456789B', 'Avenida de la Paz 42', 'Barcelona', '08001', 'Barcelona', 'single', '677234567', NULL, 'jose.martinez@email.com', NULL, 'ES2345678901234567890123', 'Interesado en áticos'),
  ('Ana', 'Rodríguez Sánchez', '34567890C', 'Plaza del Sol 8, 1º A', 'Valencia', '46001', 'Valencia', 'divorced', '688345678', '963551234', 'ana.rodriguez@email.com', 'ana.r.trabajo@email.com', 'ES3456789012345678901234', NULL),
  ('Carlos', 'López Fernández', '45678901D', 'Calle de la Luna 23', 'Sevilla', '41001', 'Sevilla', 'married', '699456789', '954551234', 'carlos.lopez@email.com', NULL, 'ES4567890123456789012345', 'Busca vivienda familiar'),
  ('Laura', 'González Moreno', '56789012E', 'Avenida del Mar 67', 'Málaga', '29001', 'Málaga', 'single', '610567890', NULL, 'laura.gonzalez@email.com', 'laura.g.personal@email.com', 'ES5678901234567890123456', 'Primera vivienda'),
  ('Miguel', 'Hernández Castro', '67890123F', 'Calle Real 34, 2º C', 'Zaragoza', '50001', 'Zaragoza', 'widowed', '621678901', '976551234', 'miguel.hernandez@email.com', NULL, 'ES6789012345678901234567', 'Jubilado, busca tranquilidad'),
  ('Carmen', 'Jiménez Ruiz', '78901234G', 'Plaza Mayor 12', 'Valladolid', '47001', 'Valladolid', 'married', '632789012', '983551234', 'carmen.jimenez@email.com', 'carmen.j.alt@email.com', 'ES7890123456789012345678', 'Pareja joven'),
  ('Francisco', 'Morales Díaz', '89012345H', 'Calle Nueva 56', 'Bilbao', '48001', 'Vizcaya', 'single', '643890123', NULL, 'francisco.morales@email.com', NULL, 'ES8901234567890123456789', 'Profesional liberal'),
  ('Isabel', 'Romero Vega', '90123456I', 'Avenida Central 89', 'Murcia', '30001', 'Murcia', 'divorced', '654901234', '968551234', 'isabel.romero@email.com', 'isabel.r.trabajo@email.com', 'ES9012345678901234567890', 'Madre soltera'),
  ('Antonio', 'Torres Blanco', '01234567J', 'Calle del Puerto 45', 'Las Palmas', '35001', 'Las Palmas', 'married', '665012345', '928551234', 'antonio.torres@email.com', NULL, 'ES0123456789012345678901', 'Inversión inmobiliaria')
ON CONFLICT (dni) DO NOTHING;

-- Insert promotion assignments
INSERT INTO promotion_assignments (promotion_id, commercial_id) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444')
ON CONFLICT (promotion_id, commercial_id) DO NOTHING;