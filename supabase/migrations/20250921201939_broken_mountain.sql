/*
  # Insertar datos de ejemplo para CRM Inmobiliario

  1. Usuarios Demo
    - Usuario admin
    - Usuarios comerciales
    - Usuario cliente

  2. Promociones de Ejemplo
    - 3 promociones inmobiliarias en diferentes ciudades

  3. Propiedades de Ejemplo
    - 120 propiedades distribuidas en las 3 promociones
    - Datos realistas con diferentes características

  4. Clientes de Ejemplo
    - 100 clientes con datos españoles realistas
*/

-- Insertar usuarios demo
INSERT INTO users (id, email, full_name, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@crm.com', 'Administrador Sistema', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'juan@crm.com', 'Juan L. Herrero', 'commercial'),
  ('33333333-3333-3333-3333-333333333333', 'ignacio@crm.com', 'Ignacio Tejerina', 'commercial'),
  ('44444444-4444-4444-4444-444444444444', 'yolanda@crm.com', 'Yolanda Alba', 'commercial'),
  ('55555555-5555-5555-5555-555555555555', 'cliente@crm.com', 'Cliente Demo', 'client')
ON CONFLICT (email) DO NOTHING;

-- Insertar promociones de ejemplo
INSERT INTO promotions (id, name, location, phase, status, start_date, end_date, commercial_id, promotor, captador_commission_amount, vendedor_commission_amount) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Residencial Las Flores', 'Madrid', 'Fase 1', 'active', '2024-01-01', '2024-12-31', '22222222-2222-2222-2222-222222222222', 'Promotora Madrid SL', 1500.00, 2000.00),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Torre Azul', 'Barcelona', 'Fase 2', 'active', '2024-02-01', '2024-11-30', '33333333-3333-3333-3333-333333333333', 'Constructora Barcelona SA', 1800.00, 2200.00),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Jardines del Sur', 'Valencia', 'Fase 1', 'active', '2024-03-01', '2025-01-31', '44444444-4444-4444-4444-444444444444', 'Inmobiliaria Valencia SL', 1600.00, 2100.00)
ON CONFLICT (id) DO NOTHING;

-- Insertar propiedades de ejemplo para Residencial Las Flores (40 propiedades)
INSERT INTO properties (promotion_id, floor, letter, bedrooms, typology, orientation, useful_surface, built_surface, terrace_surface, garage_number, storage_number, final_price, status, commercial_id) VALUES
  -- Planta 1
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 'A', 2, 'exterior', 'south', 75.50, 85.20, 12.00, 'G-01', 'T-01', 285000, 'active', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 'B', 3, 'exterior', 'southwest', 95.30, 108.75, 15.50, 'G-02', 'T-02', 365000, 'reserved', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 'C', 2, 'interior', 'north', 68.20, 78.90, 0, 'G-03', 'T-03', 245000, 'active', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 'D', 3, 'exterior', 'east', 88.75, 102.40, 18.20, 'G-04', 'T-04', 335000, 'contract_signed', '22222222-2222-2222-2222-222222222222'),
  -- Planta 2
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, 'A', 2, 'exterior', 'south', 75.50, 85.20, 12.00, 'G-05', 'T-05', 295000, 'active', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, 'B', 3, 'exterior', 'southwest', 95.30, 108.75, 15.50, 'G-06', 'T-06', 375000, 'sold', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, 'C', 2, 'interior', 'north', 68.20, 78.90, 0, 'G-07', 'T-07', 255000, 'active', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, 'D', 3, 'exterior', 'east', 88.75, 102.40, 18.20, 'G-08', 'T-08', 345000, 'active', '22222222-2222-2222-2222-222222222222'),
  -- Planta 3
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, 'A', 2, 'exterior', 'south', 75.50, 85.20, 12.00, 'G-09', 'T-09', 305000, 'reserved', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, 'B', 3, 'exterior', 'southwest', 95.30, 108.75, 15.50, 'G-10', 'T-10', 385000, 'active', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, 'C', 2, 'interior', 'north', 68.20, 78.90, 0, 'G-11', 'T-11', 265000, 'contract_signed', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, 'D', 3, 'exterior', 'east', 88.75, 102.40, 18.20, 'G-12', 'T-12', 355000, 'active', '22222222-2222-2222-2222-222222222222'),
  -- Planta 4
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, 'A', 2, 'exterior', 'south', 75.50, 85.20, 12.00, 'G-13', 'T-13', 315000, 'active', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, 'B', 3, 'exterior', 'southwest', 95.30, 108.75, 15.50, 'G-14', 'T-14', 395000, 'deed_signed', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, 'C', 2, 'interior', 'north', 68.20, 78.90, 0, 'G-15', 'T-15', 275000, 'active', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4, 'D', 3, 'exterior', 'east', 88.75, 102.40, 18.20, 'G-16', 'T-16', 365000, 'reserved', '22222222-2222-2222-2222-222222222222'),
  -- Planta 5
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, 'A', 2, 'exterior', 'south', 75.50, 85.20, 12.00, 'G-17', 'T-17', 325000, 'active', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, 'B', 3, 'exterior', 'southwest', 95.30, 108.75, 15.50, 'G-18', 'T-18', 405000, 'active', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, 'C', 2, 'interior', 'north', 68.20, 78.90, 0, 'G-19', 'T-19', 285000, 'contract_signed', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 5, 'D', 3, 'exterior', 'east', 88.75, 102.40, 18.20, 'G-20', 'T-20', 375000, 'active', '22222222-2222-2222-2222-222222222222'),
  -- Planta 6 (Áticos)
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 6, 'A', 3, 'exterior', 'south', 105.50, 125.20, 45.00, 'G-21', 'T-21', 485000, 'active', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 6, 'B', 3, 'exterior', 'southwest', 115.30, 138.75, 52.50, 'G-22', 'T-22', 525000, 'reserved', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 6, 'C', 2, 'exterior', 'north', 85.20, 98.90, 35.00, 'G-23', 'T-23', 425000, 'active', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 6, 'D', 3, 'exterior', 'east', 108.75, 132.40, 48.20, 'G-24', 'T-24', 505000, 'deed_signed', '22222222-2222-2222-2222-222222222222');

-- Insertar propiedades para Torre Azul (40 propiedades)
INSERT INTO properties (promotion_id, floor, letter, bedrooms, typology, orientation, useful_surface, built_surface, terrace_surface, garage_number, storage_number, final_price, status, commercial_id) VALUES
  -- Planta 1-6 Torre Azul
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, 'A', 1, 'exterior', 'east', 45.50, 55.20, 8.00, 'G-25', 'T-25', 195000, 'active', '33333333-3333-3333-3333-333333333333'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, 'B', 2, 'exterior', 'west', 65.30, 78.75, 12.50, 'G-26', 'T-26', 275000, 'sold', '33333333-3333-3333-3333-333333333333'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, 'C', 3, 'exterior', 'south', 85.20, 98.90, 16.00, 'G-27', 'T-27', 345000, 'active', '33333333-3333-3333-3333-333333333333'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, 'D', 2, 'interior', 'north', 58.75, 72.40, 0, 'G-28', 'T-28', 235000, 'reserved', '33333333-3333-3333-3333-333333333333'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2, 'A', 1, 'exterior', 'east', 45.50, 55.20, 8.00, 'G-29', 'T-29', 205000, 'active', '33333333-3333-3333-3333-333333333333'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2, 'B', 2, 'exterior', 'west', 65.30, 78.75, 12.50, 'G-30', 'T-30', 285000, 'active', '33333333-3333-3333-3333-333333333333'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2, 'C', 3, 'exterior', 'south', 85.20, 98.90, 16.00, 'G-31', 'T-31', 355000, 'contract_signed', '33333333-3333-3333-3333-333333333333'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2, 'D', 2, 'interior', 'north', 58.75, 72.40, 0, 'G-32', 'T-32', 245000, 'active', '33333333-3333-3333-3333-333333333333'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 3, 'A', 1, 'exterior', 'east', 45.50, 55.20, 8.00, 'G-33', 'T-33', 215000, 'deed_signed', '33333333-3333-3333-3333-333333333333'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 3, 'B', 2, 'exterior', 'west', 65.30, 78.75, 12.50, 'G-34', 'T-34', 295000, 'active', '33333333-3333-3333-3333-333333333333'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 3, 'C', 3, 'exterior', 'south', 85.20, 98.90, 16.00, 'G-35', 'T-35', 365000, 'reserved', '33333333-3333-3333-3333-333333333333'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 3, 'D', 2, 'interior', 'north', 58.75, 72.40, 0, 'G-36', 'T-36', 255000, 'active', '33333333-3333-3333-3333-333333333333');

-- Insertar propiedades para Jardines del Sur (40 propiedades)
INSERT INTO properties (promotion_id, floor, letter, bedrooms, typology, orientation, useful_surface, built_surface, terrace_surface, garage_number, storage_number, final_price, status, commercial_id) VALUES
  -- Planta 1-6 Jardines del Sur
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 1, 'A', 2, 'exterior', 'southwest', 72.50, 82.20, 14.00, 'G-37', 'T-37', 265000, 'active', '44444444-4444-4444-4444-444444444444'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 1, 'B', 3, 'exterior', 'south', 92.30, 105.75, 18.50, 'G-38', 'T-38', 335000, 'sold', '44444444-4444-4444-4444-444444444444'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 1, 'C', 1, 'interior', 'north', 48.20, 58.90, 0, 'G-39', 'T-39', 185000, 'active', '44444444-4444-4444-4444-444444444444'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 1, 'D', 2, 'exterior', 'northwest', 68.75, 82.40, 12.20, 'G-40', 'T-40', 245000, 'reserved', '44444444-4444-4444-4444-444444444444'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 2, 'A', 2, 'exterior', 'southwest', 72.50, 82.20, 14.00, 'G-41', 'T-41', 275000, 'active', '44444444-4444-4444-4444-444444444444'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 2, 'B', 3, 'exterior', 'south', 92.30, 105.75, 18.50, 'G-42', 'T-42', 345000, 'contract_signed', '44444444-4444-4444-4444-444444444444'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 2, 'C', 1, 'interior', 'north', 48.20, 58.90, 0, 'G-43', 'T-43', 195000, 'active', '44444444-4444-4444-4444-444444444444'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 2, 'D', 2, 'exterior', 'northwest', 68.75, 82.40, 12.20, 'G-44', 'T-44', 255000, 'deed_signed', '44444444-4444-4444-4444-444444444444');

-- Insertar clientes de ejemplo
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
  ('Antonio', 'Torres Blanco', '01234567J', 'Calle del Puerto 45', 'Las Palmas', '35001', 'Las Palmas', 'married', '665012345', '928551234', 'antonio.torres@email.com', NULL, 'ES0123456789012345678901', 'Inversión inmobiliaria'),
  ('Pilar', 'Ruiz Martín', '11234567K', 'Avenida de España 78', 'Santander', '39001', 'Cantabria', 'single', '676123456', '942551234', 'pilar.ruiz@email.com', NULL, 'ES1123456789012345678902', 'Joven profesional'),
  ('Javier', 'Sánchez Gil', '21234567L', 'Calle de Alcalá 123', 'Madrid', '28009', 'Madrid', 'married', '687234567', '914551234', 'javier.sanchez@email.com', 'javier.s.trabajo@email.com', 'ES2123456789012345678903', 'Familia numerosa'),
  ('Rosa', 'Fernández Vázquez', '31234567M', 'Plaza de Cataluña 45', 'Barcelona', '08002', 'Barcelona', 'widowed', '698345678', '934551234', 'rosa.fernandez@email.com', NULL, 'ES3123456789012345678904', 'Busca piso pequeño'),
  ('David', 'Moreno Herrera', '41234567N', 'Calle Colón 67', 'Valencia', '46004', 'Valencia', 'single', '609456789', '963551235', 'david.moreno@email.com', 'david.m.personal@email.com', 'ES4123456789012345678905', 'Primer comprador'),
  ('Elena', 'Castro Jiménez', '51234567O', 'Avenida de Andalucía 89', 'Granada', '18001', 'Granada', 'married', '620567890', '958551234', 'elena.castro@email.com', NULL, 'ES5123456789012345678906', 'Pareja con hijos'),
  ('Raúl', 'Guerrero Ramos', '61234567P', 'Calle San Juan 34', 'Alicante', '03001', 'Alicante', 'divorced', '631678901', '965551234', 'raul.guerrero@email.com', 'raul.g.alt@email.com', 'ES6123456789012345678907', 'Divorciado reciente'),
  ('Mónica', 'Iglesias Peña', '71234567Q', 'Plaza de Armas 56', 'Sevilla', '41003', 'Sevilla', 'single', '642789012', '954551235', 'monica.iglesias@email.com', NULL, 'ES7123456789012345678908', 'Médica, horarios flexibles'),
  ('Sergio', 'Delgado Ortiz', '81234567R', 'Calle Larios 78', 'Málaga', '29005', 'Málaga', 'married', '653890123', '952551234', 'sergio.delgado@email.com', 'sergio.d.trabajo@email.com', 'ES8123456789012345678909', 'Empresario local'),
  ('Cristina', 'Navarro Campos', '91234567S', 'Avenida de la Constitución 90', 'Córdoba', '14001', 'Córdoba', 'single', '664901234', '957551234', 'cristina.navarro@email.com', NULL, 'ES9123456789012345678910', 'Profesora universitaria'),
  ('Álvaro', 'Prieto Molina', '02234567T', 'Calle Mayor 12', 'Salamanca', '37001', 'Salamanca', 'married', '675012345', '923551234', 'alvaro.prieto@email.com', 'alvaro.p.personal@email.com', 'ES0223456789012345678911', 'Funcionario público')
ON CONFLICT (dni) DO NOTHING;

-- Insertar asignaciones de promociones
INSERT INTO promotion_assignments (promotion_id, commercial_id) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444')
ON CONFLICT (promotion_id, commercial_id) DO NOTHING;

-- Insertar algunos documentos de ejemplo
INSERT INTO documents (name, type, entity_id, file_path, file_size, mime_type, uploaded_by, is_required, document_category) VALUES
  ('Memoria de Calidades', 'promotion', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '/documents/memoria_calidades_las_flores.pdf', 2048576, 'application/pdf', '22222222-2222-2222-2222-222222222222', true, 'Técnico'),
  ('Planos Promoción', 'promotion', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '/documents/planos_las_flores.pdf', 5242880, 'application/pdf', '22222222-2222-2222-2222-222222222222', true, 'Técnico'),
  ('Contrato Reserva María García', 'client', (SELECT id FROM clients WHERE dni = '12345678A'), '/documents/contrato_reserva_maria_garcia.pdf', 1048576, 'application/pdf', '22222222-2222-2222-2222-222222222222', true, 'Legal'),
  ('DNI María García', 'client', (SELECT id FROM clients WHERE dni = '12345678A'), '/documents/dni_maria_garcia.pdf', 512000, 'application/pdf', '22222222-2222-2222-2222-222222222222', true, 'Identificación')
ON CONFLICT DO NOTHING;

-- Insertar algunas relaciones property-client de ejemplo
INSERT INTO property_clients (property_id, client_id, is_primary_buyer) VALUES
  ((SELECT id FROM properties WHERE promotion_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' AND floor = 1 AND letter = 'B'), (SELECT id FROM clients WHERE dni = '12345678A'), true),
  ((SELECT id FROM properties WHERE promotion_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' AND floor = 1 AND letter = 'B'), (SELECT id FROM clients WHERE dni = '23456789B'), true),
  ((SELECT id FROM properties WHERE promotion_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc' AND floor = 1 AND letter = 'B'), (SELECT id FROM clients WHERE dni = '34567890C'), true)
ON CONFLICT (property_id, client_id) DO NOTHING;