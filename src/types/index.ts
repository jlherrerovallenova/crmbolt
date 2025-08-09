export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'commercial' | 'client';
  created_at?: string;
  updated_at?: string;
}

export interface Promotion {
  id: string;
  name: string;
  location: string;
  phase: string;
  status: 'active' | 'inactive' | 'completed';
  start_date: string;
  end_date?: string;
  commercial_id?: string;
  commission_percentage?: number;
  promotor: string;
  captador_commission_amount: number;
  vendedor_commission_amount: number;
  created_at?: string;
  updated_at?: string;
}

export interface Property {
  id: string;
  promotion_id: string;
  floor: number;
  letter: string;
  bedrooms: number;
  typology: 'interior' | 'exterior';
  orientation: 'north' | 'south' | 'southwest' | 'east' | 'west' | 'northwest';
  useful_surface: number;
  built_surface: number;
  terrace_surface?: number;
  garage_number?: string;
  storage_number?: string;
  final_price: number;
  status: 'active' | 'reserved' | 'contract_signed' | 'sold_by_developer' | 'deed_signed';
  observations?: string;
  commercial_id?: string;
  vendedor_commercial_id?: string;
  portal?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  dni: string;
  address: string;
  municipality: string;
  postal_code: string;
  province: string;
  marital_status: 'single' | 'married' | 'divorced' | 'widowed';
  phone_1: string;
  phone_2?: string;
  email_1: string;
  email_2?: string;
  bank_account: string;
  observations?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'promotion' | 'client' | 'property';
  entity_id: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  version: number;
  uploaded_by: string;
  is_required: boolean;
  document_category?: string;
  created_at?: string;
  updated_at?: string;
}