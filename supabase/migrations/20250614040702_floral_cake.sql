/*
  # Agregar campos adicionales a la tabla users

  1. Nuevos campos
    - email (sincronizado con auth.users)
    - avatar_url (URL del avatar)
    - fecha_nacimiento (fecha de nacimiento)
    - direccion (dirección)
    - comuna (comuna)
    - region (región)
    - verificado (estado de verificación)
    - activo (usuario activo)
    - ultimo_acceso (último acceso)
    - preferencias (preferencias en JSON)
    - metadata (metadata adicional)

  2. Índices para mejor rendimiento
  3. Funciones auxiliares
*/

-- Agregar columnas una por una de forma segura
ALTER TABLE users ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS fecha_nacimiento date;
ALTER TABLE users ADD COLUMN IF NOT EXISTS direccion text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS comuna text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS region text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verificado boolean DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS activo boolean DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS ultimo_acceso timestamptz;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferencias jsonb DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}';

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_tipo_usuario ON users(tipo_usuario);
CREATE INDEX IF NOT EXISTS idx_users_activo ON users(activo);
CREATE INDEX IF NOT EXISTS idx_users_verificado ON users(verificado);
CREATE INDEX IF NOT EXISTS idx_users_comuna ON users(comuna);
CREATE INDEX IF NOT EXISTS idx_users_region ON users(region);
CREATE INDEX IF NOT EXISTS idx_users_ultimo_acceso ON users(ultimo_acceso);

-- Sincronizar datos existentes de auth.users
UPDATE users 
SET 
  email = auth_users.email,
  ultimo_acceso = COALESCE(auth_users.last_sign_in_at, users.ultimo_acceso),
  updated_at = now()
FROM auth.users auth_users
WHERE users.id = auth_users.id AND users.email IS NULL;

-- Insertar usuarios que existen en auth.users pero no en users
INSERT INTO users (id, email, nombre, telefono, tipo_usuario, ultimo_acceso)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'nombre', ''),
  COALESCE(au.raw_user_meta_data->>'telefono', ''),
  COALESCE(au.raw_user_meta_data->>'tipo_usuario', 'cliente'),
  au.last_sign_in_at
FROM auth.users au
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = au.id)
ON CONFLICT (id) DO NOTHING;

-- Función para sincronizar email desde auth.users
CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar o insertar en la tabla users cuando se crea o actualiza en auth.users
  INSERT INTO users (id, email, nombre, telefono, tipo_usuario, ultimo_acceso)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'nombre', ''), 
    COALESCE(NEW.raw_user_meta_data->>'telefono', ''), 
    COALESCE(NEW.raw_user_meta_data->>'tipo_usuario', 'cliente'),
    NEW.last_sign_in_at
  )
  ON CONFLICT (id) 
  DO UPDATE SET 
    email = NEW.email,
    ultimo_acceso = CASE 
      WHEN NEW.last_sign_in_at IS NOT NULL THEN NEW.last_sign_in_at 
      ELSE users.ultimo_acceso 
    END,
    updated_at = now();
  
  RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Trigger para sincronizar automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION sync_user_email();

-- Agregar constraint para email único si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'users' AND constraint_name = 'users_email_key'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
  END IF;
EXCEPTION
  WHEN duplicate_table THEN
    -- Ignorar si ya existe
    NULL;
END $$;

-- Función para obtener perfil completo del usuario
CREATE OR REPLACE FUNCTION get_user_profile(user_uuid uuid)
RETURNS TABLE (
  id uuid,
  email text,
  nombre text,
  telefono text,
  tipo_usuario text,
  avatar_url text,
  fecha_nacimiento date,
  direccion text,
  comuna text,
  region text,
  verificado boolean,
  activo boolean,
  ultimo_acceso timestamptz,
  preferencias jsonb,
  metadata jsonb,
  created_at timestamptz,
  updated_at timestamptz,
  is_professional boolean,
  professional_id uuid
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.nombre,
    u.telefono,
    u.tipo_usuario,
    u.avatar_url,
    u.fecha_nacimiento,
    u.direccion,
    u.comuna,
    u.region,
    u.verificado,
    u.activo,
    u.ultimo_acceso,
    u.preferencias,
    u.metadata,
    u.created_at,
    u.updated_at,
    (p.id IS NOT NULL) as is_professional,
    p.id as professional_id
  FROM users u
  LEFT JOIN professionals p ON u.id = p.user_id
  WHERE u.id = user_uuid;
END;
$$ language 'plpgsql' security definer;

-- Función para estadísticas de usuarios
CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS TABLE (
  total_users bigint,
  total_professionals bigint,
  total_clients bigint,
  active_users bigint,
  verified_users bigint,
  users_this_month bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE tipo_usuario = 'profesional') as total_professionals,
    COUNT(*) FILTER (WHERE tipo_usuario = 'cliente') as total_clients,
    COUNT(*) FILTER (WHERE activo = true) as active_users,
    COUNT(*) FILTER (WHERE verificado = true) as verified_users,
    COUNT(*) FILTER (WHERE created_at >= date_trunc('month', now())) as users_this_month
  FROM users;
END;
$$ language 'plpgsql' security definer;

-- Función auxiliar para actualizar último acceso
CREATE OR REPLACE FUNCTION update_user_last_access(user_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET ultimo_acceso = now(),
      updated_at = now()
  WHERE id = user_uuid;
END;
$$ language 'plpgsql' security definer;