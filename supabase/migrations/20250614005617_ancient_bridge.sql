/*
  # Create professionals table and related structures

  1. New Tables
    - `professionals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `nombre` (text)
      - `rut` (text, unique)
      - `telefono` (text)
      - `foto_url` (text, optional)
      - `especialidades` (text array)
      - `descripcion` (text)
      - `region_principal` (text)
      - `comuna_principal` (text)
      - `regiones_servicio` (text array)
      - `comunas_servicio` (text array)
      - `experiencia` (text)
      - `fotos_trabajos` (text array)
      - `precios` (jsonb)
      - `rating` (numeric, default 0)
      - `total_reviews` (integer, default 0)
      - `verificado` (boolean, default false)
      - `activo` (boolean, default true)
      - `plan_activo` (boolean, default false)
      - `fecha_ultimo_pago` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `reviews`
      - `id` (uuid, primary key)
      - `professional_id` (uuid, foreign key)
      - `client_name` (text)
      - `client_email` (text)
      - `rating` (integer, 1-5)
      - `comentario` (text)
      - `servicio` (text)
      - `verificado` (boolean, default false)
      - `created_at` (timestamptz)

    - `contacts`
      - `id` (uuid, primary key)
      - `professional_id` (uuid, foreign key)
      - `client_name` (text)
      - `client_email` (text)
      - `client_phone` (text)
      - `servicio` (text)
      - `mensaje` (text)
      - `estado` (text, default 'pendiente')
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for professionals to manage their own data

  3. Storage
    - Create storage bucket for photos
    - Set up policies for photo uploads
*/

-- Create professionals table
CREATE TABLE IF NOT EXISTS professionals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nombre text NOT NULL,
  rut text UNIQUE NOT NULL,
  telefono text NOT NULL,
  foto_url text,
  especialidades text[] NOT NULL DEFAULT '{}',
  descripcion text NOT NULL,
  region_principal text NOT NULL,
  comuna_principal text NOT NULL,
  regiones_servicio text[] NOT NULL DEFAULT '{}',
  comunas_servicio text[] NOT NULL DEFAULT '{}',
  experiencia text NOT NULL,
  fotos_trabajos text[] NOT NULL DEFAULT '{}',
  precios jsonb NOT NULL DEFAULT '{}',
  rating numeric(3,2) NOT NULL DEFAULT 0,
  total_reviews integer NOT NULL DEFAULT 0,
  verificado boolean NOT NULL DEFAULT false,
  activo boolean NOT NULL DEFAULT true,
  plan_activo boolean NOT NULL DEFAULT false,
  fecha_ultimo_pago timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid REFERENCES professionals(id) ON DELETE CASCADE NOT NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comentario text NOT NULL,
  servicio text NOT NULL,
  verificado boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid REFERENCES professionals(id) ON DELETE CASCADE NOT NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text NOT NULL,
  servicio text NOT NULL,
  mensaje text NOT NULL,
  estado text NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'respondido', 'completado')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policies for professionals table
CREATE POLICY "Professionals can read own data"
  ON professionals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Professionals can update own data"
  ON professionals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Professionals can insert own data"
  ON professionals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can read active professionals"
  ON professionals
  FOR SELECT
  TO anon, authenticated
  USING (activo = true AND plan_activo = true);

-- Policies for reviews table
CREATE POLICY "Anyone can read verified reviews"
  ON reviews
  FOR SELECT
  TO anon, authenticated
  USING (verificado = true);

CREATE POLICY "Anyone can insert reviews"
  ON reviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Professionals can read their reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (
    professional_id IN (
      SELECT id FROM professionals WHERE user_id = auth.uid()
    )
  );

-- Policies for contacts table
CREATE POLICY "Anyone can insert contacts"
  ON contacts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Professionals can read their contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (
    professional_id IN (
      SELECT id FROM professionals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Professionals can update their contacts"
  ON contacts
  FOR UPDATE
  TO authenticated
  USING (
    professional_id IN (
      SELECT id FROM professionals WHERE user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_professionals_user_id ON professionals(user_id);
CREATE INDEX IF NOT EXISTS idx_professionals_activo ON professionals(activo);
CREATE INDEX IF NOT EXISTS idx_professionals_plan_activo ON professionals(plan_activo);
CREATE INDEX IF NOT EXISTS idx_professionals_rating ON professionals(rating DESC);
CREATE INDEX IF NOT EXISTS idx_professionals_regiones ON professionals USING GIN(regiones_servicio);
CREATE INDEX IF NOT EXISTS idx_professionals_comunas ON professionals USING GIN(comunas_servicio);
CREATE INDEX IF NOT EXISTS idx_professionals_especialidades ON professionals USING GIN(especialidades);

CREATE INDEX IF NOT EXISTS idx_reviews_professional_id ON reviews(professional_id);
CREATE INDEX IF NOT EXISTS idx_reviews_verificado ON reviews(verificado);

CREATE INDEX IF NOT EXISTS idx_contacts_professional_id ON contacts(professional_id);
CREATE INDEX IF NOT EXISTS idx_contacts_estado ON contacts(estado);

-- Function to update rating when new review is added
CREATE OR REPLACE FUNCTION update_professional_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE professionals
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE professional_id = NEW.professional_id AND verificado = true
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE professional_id = NEW.professional_id AND verificado = true
    ),
    updated_at = now()
  WHERE id = NEW.professional_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update rating when review is verified
CREATE TRIGGER update_rating_on_review_verify
  AFTER UPDATE OF verificado ON reviews
  FOR EACH ROW
  WHEN (NEW.verificado = true AND OLD.verificado = false)
  EXECUTE FUNCTION update_professional_rating();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on professionals
CREATE TRIGGER update_professionals_updated_at
  BEFORE UPDATE ON professionals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view photos"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'photos');

CREATE POLICY "Authenticated users can upload photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Users can update their own photos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);