/*
  # Crear tabla users y arreglar estructura de base de datos

  1. Nueva tabla
    - `users` - tabla para datos adicionales de usuarios de Supabase Auth
      - `id` (uuid, primary key, referencia a auth.users)
      - `nombre` (text)
      - `telefono` (text)
      - `tipo_usuario` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Modificaciones a professionals
    - Agregar trigger para actualizar updated_at
    - Mejorar políticas RLS

  3. Seguridad
    - Enable RLS en users
    - Políticas para que usuarios puedan leer/actualizar sus propios datos
*/

-- Crear tabla users para datos adicionales
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  telefono text,
  tipo_usuario text DEFAULT 'cliente',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS en users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Trigger para actualizar updated_at en users
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Crear bucket para fotos si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Política para subir fotos
CREATE POLICY "Users can upload photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Photos are publicly accessible"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'photos');

CREATE POLICY "Users can update own photos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);