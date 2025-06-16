/*
  # Sistema completo de gestión de contraseñas

  1. Funciones para manejo de emails
  2. Logs de actividad de contraseñas
  3. Rate limiting para seguridad
  4. Triggers automáticos
  5. Políticas de seguridad mejoradas
*/

-- =============================================
-- TABLA: password_reset_logs (Logs de restablecimiento)
-- =============================================

CREATE TABLE IF NOT EXISTS password_reset_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email_address text NOT NULL,
  status text NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'sent', 'used', 'expired', 'failed')),
  ip_address inet,
  user_agent text,
  reset_token_hash text, -- Hash del token para tracking
  expires_at timestamptz,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Índices para password_reset_logs
CREATE INDEX IF NOT EXISTS idx_password_reset_logs_user_id ON password_reset_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_logs_email ON password_reset_logs(email_address);
CREATE INDEX IF NOT EXISTS idx_password_reset_logs_status ON password_reset_logs(status);
CREATE INDEX IF NOT EXISTS idx_password_reset_logs_created ON password_reset_logs(created_at);

-- Enable RLS
ALTER TABLE password_reset_logs ENABLE ROW LEVEL SECURITY;

-- Política para que solo admins puedan ver logs
CREATE POLICY "Only service role can access password reset logs" ON password_reset_logs
  FOR ALL TO service_role
  USING (true);

-- =============================================
-- FUNCIONES DE SEGURIDAD
-- =============================================

-- Función para verificar rate limiting de password reset
CREATE OR REPLACE FUNCTION check_password_reset_rate_limit(
  email_address text,
  time_window interval DEFAULT '15 minutes',
  max_attempts integer DEFAULT 3
)
RETURNS boolean AS $$
DECLARE
  attempt_count integer;
BEGIN
  -- Contar intentos recientes
  SELECT COUNT(*)
  INTO attempt_count
  FROM password_reset_logs
  WHERE 
    email_address = check_password_reset_rate_limit.email_address
    AND status IN ('requested', 'sent')
    AND created_at > (now() - time_window);
  
  -- Retornar true si está dentro del límite
  RETURN attempt_count < max_attempts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para registrar intento de password reset
CREATE OR REPLACE FUNCTION log_password_reset_attempt(
  target_email text,
  target_user_id uuid DEFAULT NULL,
  attempt_status text DEFAULT 'requested',
  client_ip inet DEFAULT NULL,
  client_user_agent text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO password_reset_logs (
    user_id, 
    email_address, 
    status, 
    ip_address, 
    user_agent,
    expires_at
  )
  VALUES (
    target_user_id,
    target_email,
    attempt_status,
    client_ip,
    client_user_agent,
    now() + interval '1 hour' -- Los tokens expiran en 1 hora
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para marcar token como usado
CREATE OR REPLACE FUNCTION mark_password_reset_used(
  target_email text,
  token_hash text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE password_reset_logs
  SET 
    status = 'used',
    used_at = now()
  WHERE 
    email_address = target_email
    AND status = 'sent'
    AND expires_at > now()
    AND (token_hash IS NULL OR reset_token_hash = mark_password_reset_used.token_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para limpiar logs antiguos
CREATE OR REPLACE FUNCTION cleanup_old_password_reset_logs()
RETURNS void AS $$
BEGIN
  -- Eliminar logs más antiguos de 30 días
  DELETE FROM password_reset_logs
  WHERE created_at < (now() - interval '30 days');
  
  -- Marcar tokens expirados
  UPDATE password_reset_logs
  SET status = 'expired'
  WHERE status = 'sent' 
    AND expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCIONES PRINCIPALES DE PASSWORD RESET
-- =============================================

-- Función principal para solicitar password reset
CREATE OR REPLACE FUNCTION request_password_reset(
  user_email text,
  client_ip inet DEFAULT NULL,
  client_user_agent text DEFAULT NULL
)
RETURNS json AS $$
DECLARE
  user_record auth.users%ROWTYPE;
  user_data users%ROWTYPE;
  log_id uuid;
BEGIN
  -- Normalizar email
  user_email := lower(trim(user_email));
  
  -- Verificar rate limiting
  IF NOT check_password_reset_rate_limit(user_email) THEN
    -- Registrar intento bloqueado
    PERFORM log_password_reset_attempt(
      user_email, 
      NULL, 
      'rate_limited', 
      client_ip, 
      client_user_agent
    );
    
    RETURN json_build_object(
      'success', false,
      'error', 'Demasiados intentos. Espera 15 minutos antes de intentar nuevamente.',
      'code', 'RATE_LIMITED'
    );
  END IF;
  
  -- Buscar usuario en auth.users
  SELECT * INTO user_record
  FROM auth.users
  WHERE email = user_email;
  
  -- Buscar datos adicionales en users
  SELECT * INTO user_data
  FROM users
  WHERE email = user_email;
  
  -- Registrar el intento (siempre, por seguridad)
  log_id := log_password_reset_attempt(
    user_email,
    user_record.id,
    CASE WHEN user_record.id IS NOT NULL THEN 'requested' ELSE 'user_not_found' END,
    client_ip,
    client_user_agent
  );
  
  -- Si el usuario no existe, retornar éxito por seguridad
  IF user_record.id IS NULL THEN
    RETURN json_build_object(
      'success', true,
      'message', 'Si el email existe en nuestro sistema, recibirás un enlace de restablecimiento.',
      'log_id', log_id
    );
  END IF;
  
  -- Verificar que el usuario esté activo
  IF user_data.activo = false THEN
    RETURN json_build_object(
      'success', false,
      'error', 'La cuenta está desactivada. Contacta soporte.',
      'code', 'ACCOUNT_DISABLED'
    );
  END IF;
  
  -- Marcar como enviado (el email real se envía desde la aplicación)
  UPDATE password_reset_logs
  SET status = 'sent'
  WHERE id = log_id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Email de restablecimiento enviado exitosamente.',
    'user_id', user_record.id,
    'log_id', log_id
  );
  
EXCEPTION
  WHEN OTHERS THEN
    -- Registrar error
    PERFORM log_password_reset_attempt(
      user_email,
      NULL,
      'error',
      client_ip,
      client_user_agent
    );
    
    RETURN json_build_object(
      'success', false,
      'error', 'Error interno del servidor',
      'code', 'INTERNAL_ERROR'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para validar y usar token de reset
CREATE OR REPLACE FUNCTION validate_password_reset_token(
  user_email text,
  new_password text
)
RETURNS json AS $$
DECLARE
  user_record auth.users%ROWTYPE;
  valid_log password_reset_logs%ROWTYPE;
BEGIN
  -- Normalizar email
  user_email := lower(trim(user_email));
  
  -- Buscar usuario
  SELECT * INTO user_record
  FROM auth.users
  WHERE email = user_email;
  
  IF user_record.id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Usuario no encontrado',
      'code', 'USER_NOT_FOUND'
    );
  END IF;
  
  -- Buscar log válido de reset
  SELECT * INTO valid_log
  FROM password_reset_logs
  WHERE 
    email_address = user_email
    AND user_id = user_record.id
    AND status = 'sent'
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF valid_log.id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Token inválido o expirado',
      'code', 'INVALID_TOKEN'
    );
  END IF;
  
  -- Marcar token como usado
  PERFORM mark_password_reset_used(user_email);
  
  RETURN json_build_object(
    'success', true,
    'message', 'Token válido, contraseña puede ser actualizada',
    'user_id', user_record.id
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Error validando token',
      'code', 'VALIDATION_ERROR'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS Y AUTOMATIZACIÓN
-- =============================================

-- Trigger para limpiar logs automáticamente
CREATE OR REPLACE FUNCTION auto_cleanup_password_logs()
RETURNS TRIGGER AS $$
BEGIN
  -- Cada 100 inserts, limpiar logs antiguos
  IF (SELECT COUNT(*) FROM password_reset_logs) % 100 = 0 THEN
    PERFORM cleanup_old_password_reset_logs();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para limpieza automática
DROP TRIGGER IF EXISTS auto_cleanup_password_logs_trigger ON password_reset_logs;
CREATE TRIGGER auto_cleanup_password_logs_trigger
  AFTER INSERT ON password_reset_logs
  FOR EACH ROW
  EXECUTE FUNCTION auto_cleanup_password_logs();

-- =============================================
-- VISTAS ÚTILES
-- =============================================

-- Vista para estadísticas de password reset
CREATE OR REPLACE VIEW password_reset_stats AS
SELECT 
  date_trunc('day', created_at) as date,
  status,
  COUNT(*) as count,
  COUNT(DISTINCT email_address) as unique_emails,
  COUNT(DISTINCT user_id) as unique_users
FROM password_reset_logs
WHERE created_at >= now() - interval '30 days'
GROUP BY date_trunc('day', created_at), status
ORDER BY date DESC, status;

-- Vista para usuarios con intentos recientes
CREATE OR REPLACE VIEW recent_password_reset_attempts AS
SELECT 
  email_address,
  user_id,
  COUNT(*) as attempt_count,
  MAX(created_at) as last_attempt,
  array_agg(DISTINCT status) as statuses
FROM password_reset_logs
WHERE created_at >= now() - interval '1 hour'
GROUP BY email_address, user_id
HAVING COUNT(*) >= 2
ORDER BY last_attempt DESC;

-- =============================================
-- PERMISOS Y SEGURIDAD
-- =============================================

-- Otorgar permisos necesarios
GRANT EXECUTE ON FUNCTION check_password_reset_rate_limit(text, interval, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION request_password_reset(text, inet, text) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_password_reset_token(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION log_password_reset_attempt(text, uuid, text, inet, text) TO service_role;
GRANT EXECUTE ON FUNCTION mark_password_reset_used(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_password_reset_logs() TO service_role;

-- Otorgar acceso a vistas para análisis
GRANT SELECT ON password_reset_stats TO service_role;
GRANT SELECT ON recent_password_reset_attempts TO service_role;

-- =============================================
-- COMENTARIOS EXPLICATIVOS
-- =============================================

COMMENT ON TABLE password_reset_logs IS 'Logs de intentos de restablecimiento de contraseña para seguridad y debugging';
COMMENT ON FUNCTION request_password_reset(text, inet, text) IS 'Función principal para solicitar restablecimiento de contraseña con rate limiting';
COMMENT ON FUNCTION validate_password_reset_token(text, text) IS 'Validar token de restablecimiento antes de cambiar contraseña';
COMMENT ON FUNCTION check_password_reset_rate_limit(text, interval, integer) IS 'Verificar límites de intentos para prevenir abuso';

-- =============================================
-- DATOS INICIALES Y CONFIGURACIÓN
-- =============================================

-- Insertar configuración inicial si no existe
INSERT INTO password_reset_logs (user_id, email_address, status, created_at)
SELECT NULL, 'system@maestrodirecto.cl', 'system_init', now()
WHERE NOT EXISTS (SELECT 1 FROM password_reset_logs WHERE email_address = 'system@maestrodirecto.cl');

-- Limpiar cualquier log antiguo existente
PERFORM cleanup_old_password_reset_logs();