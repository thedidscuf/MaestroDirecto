/*
  # Esquema completo de MaestroDirecto

  1. Tablas principales
    - `users` - Datos adicionales de usuarios
    - `professionals` - Perfiles de profesionales
    - `reviews` - Reseñas y calificaciones
    - `contacts` - Contactos entre clientes y profesionales
    - `categories` - Categorías de servicios
    - `regions` - Regiones de Chile
    - `communes` - Comunas de Chile
    - `subscriptions` - Suscripciones de profesionales
    - `payments` - Historial de pagos
    - `notifications` - Sistema de notificaciones
    - `professional_stats` - Estadísticas de profesionales
    - `search_logs` - Logs de búsquedas para analytics

  2. Funciones y triggers
    - Actualización automática de ratings
    - Cálculo de estadísticas
    - Notificaciones automáticas
    - Logs de actividad

  3. Políticas de seguridad (RLS)
    - Acceso controlado por usuario
    - Datos públicos vs privados
    - Permisos específicos por rol
*/

-- =============================================
-- EXTENSIONES NECESARIAS
-- =============================================

-- Extensión para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Extensión para búsqueda de texto completo
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================
-- FUNCIONES AUXILIARES
-- =============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para calcular rating promedio
CREATE OR REPLACE FUNCTION calculate_average_rating(professional_uuid uuid)
RETURNS numeric AS $$
DECLARE
  avg_rating numeric;
BEGIN
  SELECT COALESCE(AVG(rating), 0)
  INTO avg_rating
  FROM reviews
  WHERE professional_id = professional_uuid AND verificado = true;
  
  RETURN ROUND(avg_rating, 2);
END;
$$ language 'plpgsql';

-- Función para contar reseñas verificadas
CREATE OR REPLACE FUNCTION count_verified_reviews(professional_uuid uuid)
RETURNS integer AS $$
DECLARE
  review_count integer;
BEGIN
  SELECT COUNT(*)
  INTO review_count
  FROM reviews
  WHERE professional_id = professional_uuid AND verificado = true;
  
  RETURN review_count;
END;
$$ language 'plpgsql';

-- =============================================
-- TABLA: categories (Categorías de servicios)
-- =============================================

CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  nombre text NOT NULL,
  descripcion text NOT NULL,
  icon text NOT NULL DEFAULT 'Wrench',
  activo boolean DEFAULT true,
  orden integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Insertar categorías predefinidas
INSERT INTO categories (id, nombre, descripcion, icon, orden) VALUES
('electricista', 'Electricista', 'Instalaciones eléctricas, reparaciones y mantención', 'Zap', 1),
('gasfiter', 'Gasfiter', 'Plomería, cañerías, calefont y sistemas de agua', 'Wrench', 2),
('carpintero', 'Carpintero', 'Muebles, estructuras de madera y reparaciones', 'Hammer', 3),
('pintor', 'Pintor', 'Pintura de casas, edificios y superficies', 'Paintbrush', 4),
('albanil', 'Albañil', 'Construcción, remodelaciones y obras de albañilería', 'Brick', 5),
('techista', 'Techista', 'Reparación y mantención de techos', 'Home', 6),
('jardinero', 'Jardinero', 'Mantención de jardines y áreas verdes', 'TreePine', 7),
('cerrajero', 'Cerrajero', 'Cerraduras, llaves y sistemas de seguridad', 'Key', 8),
('mecanico', 'Mecánico', 'Reparación y mantención de vehículos', 'Wrench', 9),
('soldador', 'Soldador', 'Soldadura y trabajos en metal', 'Zap', 10),
('tapicero', 'Tapicero', 'Tapicería de muebles y vehículos', 'Home', 11),
('vidrieria', 'Vidriería', 'Instalación y reparación de vidrios', 'Home', 12)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- TABLA: regions (Regiones de Chile)
-- =============================================

CREATE TABLE IF NOT EXISTS regions (
  id text PRIMARY KEY,
  nombre text NOT NULL,
  codigo text,
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Insertar regiones de Chile
INSERT INTO regions (id, nombre, codigo) VALUES
('arica-parinacota', 'Arica y Parinacota', 'XV'),
('tarapaca', 'Tarapacá', 'I'),
('antofagasta', 'Antofagasta', 'II'),
('atacama', 'Atacama', 'III'),
('coquimbo', 'Coquimbo', 'IV'),
('valparaiso', 'Valparaíso', 'V'),
('metropolitana', 'Región Metropolitana', 'RM'),
('ohiggins', 'O''Higgins', 'VI'),
('maule', 'Maule', 'VII'),
('nuble', 'Ñuble', 'XVI'),
('biobio', 'Biobío', 'VIII'),
('araucania', 'La Araucanía', 'IX'),
('los-rios', 'Los Ríos', 'XIV'),
('los-lagos', 'Los Lagos', 'X'),
('aysen', 'Aysén', 'XI'),
('magallanes', 'Magallanes y Antártica Chilena', 'XII')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- TABLA: communes (Comunas de Chile)
-- =============================================

CREATE TABLE IF NOT EXISTS communes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre text NOT NULL,
  region_id text NOT NULL REFERENCES regions(id),
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_communes_region ON communes(region_id);
CREATE INDEX IF NOT EXISTS idx_communes_nombre ON communes USING gin(nombre gin_trgm_ops);

-- =============================================
-- TABLA: subscriptions (Planes de suscripción)
-- =============================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id uuid NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  plan_type text NOT NULL DEFAULT 'profesional',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled', 'expired')),
  price_monthly numeric(10,2) NOT NULL DEFAULT 5990.00,
  start_date timestamptz NOT NULL DEFAULT now(),
  end_date timestamptz,
  auto_renew boolean DEFAULT true,
  payment_method text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices para subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_professional ON subscriptions(professional_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date);

-- =============================================
-- TABLA: payments (Historial de pagos)
-- =============================================

CREATE TABLE IF NOT EXISTS payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id uuid NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  professional_id uuid NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'CLP',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method text,
  transaction_id text,
  payment_date timestamptz,
  invoice_number text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Índices para payments
CREATE INDEX IF NOT EXISTS idx_payments_professional ON payments(professional_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);

-- =============================================
-- TABLA: notifications (Sistema de notificaciones)
-- =============================================

CREATE TABLE IF NOT EXISTS notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('contact', 'review', 'payment', 'system', 'verification')),
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Índices para notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- =============================================
-- TABLA: professional_stats (Estadísticas de profesionales)
-- =============================================

CREATE TABLE IF NOT EXISTS professional_stats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id uuid NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  profile_views integer DEFAULT 0,
  contact_requests integer DEFAULT 0,
  whatsapp_clicks integer DEFAULT 0,
  phone_clicks integer DEFAULT 0,
  search_appearances integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(professional_id, date)
);

-- Índices para professional_stats
CREATE INDEX IF NOT EXISTS idx_professional_stats_professional ON professional_stats(professional_id);
CREATE INDEX IF NOT EXISTS idx_professional_stats_date ON professional_stats(date);

-- =============================================
-- TABLA: search_logs (Logs de búsquedas para analytics)
-- =============================================

CREATE TABLE IF NOT EXISTS search_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  query text,
  category text,
  region text,
  commune text,
  results_count integer DEFAULT 0,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Índices para search_logs
CREATE INDEX IF NOT EXISTS idx_search_logs_query ON search_logs USING gin(query gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_search_logs_category ON search_logs(category);
CREATE INDEX IF NOT EXISTS idx_search_logs_created ON search_logs(created_at);

-- =============================================
-- TABLA: contact_messages (Mensajes entre usuarios)
-- =============================================

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id uuid NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Índices para contact_messages
CREATE INDEX IF NOT EXISTS idx_contact_messages_contact ON contact_messages(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_sender ON contact_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at);

-- =============================================
-- TABLA: professional_availability (Disponibilidad de profesionales)
-- =============================================

CREATE TABLE IF NOT EXISTS professional_availability (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id uuid NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Domingo, 6 = Sábado
  start_time time NOT NULL,
  end_time time NOT NULL,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(professional_id, day_of_week)
);

-- Índices para professional_availability
CREATE INDEX IF NOT EXISTS idx_professional_availability_professional ON professional_availability(professional_id);

-- =============================================
-- TABLA: professional_services (Servicios específicos que ofrece cada profesional)
-- =============================================

CREATE TABLE IF NOT EXISTS professional_services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id uuid NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  category_id text NOT NULL REFERENCES categories(id),
  service_name text NOT NULL,
  description text,
  price_min numeric(10,2),
  price_max numeric(10,2),
  unit text, -- 'hora', 'trabajo', 'metro', etc.
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices para professional_services
CREATE INDEX IF NOT EXISTS idx_professional_services_professional ON professional_services(professional_id);
CREATE INDEX IF NOT EXISTS idx_professional_services_category ON professional_services(category_id);

-- =============================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- =============================================

-- Categories (público)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are publicly readable" ON categories FOR SELECT TO public USING (activo = true);

-- Regions (público)
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Regions are publicly readable" ON regions FOR SELECT TO public USING (activo = true);

-- Communes (público)
ALTER TABLE communes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Communes are publicly readable" ON communes FOR SELECT TO public USING (activo = true);

-- Subscriptions (solo el profesional puede ver sus suscripciones)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Professionals can read own subscriptions" ON subscriptions
  FOR SELECT TO authenticated
  USING (professional_id IN (
    SELECT id FROM professionals WHERE user_id = auth.uid()
  ));

CREATE POLICY "Professionals can update own subscriptions" ON subscriptions
  FOR UPDATE TO authenticated
  USING (professional_id IN (
    SELECT id FROM professionals WHERE user_id = auth.uid()
  ));

-- Payments (solo el profesional puede ver sus pagos)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Professionals can read own payments" ON payments
  FOR SELECT TO authenticated
  USING (professional_id IN (
    SELECT id FROM professionals WHERE user_id = auth.uid()
  ));

-- Notifications (solo el usuario puede ver sus notificaciones)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- Professional_stats (solo el profesional puede ver sus estadísticas)
ALTER TABLE professional_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Professionals can read own stats" ON professional_stats
  FOR SELECT TO authenticated
  USING (professional_id IN (
    SELECT id FROM professionals WHERE user_id = auth.uid()
  ));

-- Search_logs (solo para análisis interno)
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Search logs are insert only" ON search_logs
  FOR INSERT TO public
  WITH CHECK (true);

-- Contact_messages (participantes del contacto pueden leer)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contact participants can read messages" ON contact_messages
  FOR SELECT TO authenticated
  USING (
    contact_id IN (
      SELECT id FROM contacts 
      WHERE professional_id IN (
        SELECT id FROM professionals WHERE user_id = auth.uid()
      )
    ) OR sender_id = auth.uid()
  );

CREATE POLICY "Authenticated users can insert messages" ON contact_messages
  FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());

-- Professional_availability (profesional puede gestionar su disponibilidad)
ALTER TABLE professional_availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Professionals can manage own availability" ON professional_availability
  FOR ALL TO authenticated
  USING (professional_id IN (
    SELECT id FROM professionals WHERE user_id = auth.uid()
  ));

CREATE POLICY "Public can read availability" ON professional_availability
  FOR SELECT TO public
  USING (available = true);

-- Professional_services (profesional puede gestionar sus servicios)
ALTER TABLE professional_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Professionals can manage own services" ON professional_services
  FOR ALL TO authenticated
  USING (professional_id IN (
    SELECT id FROM professionals WHERE user_id = auth.uid()
  ));

CREATE POLICY "Public can read active services" ON professional_services
  FOR SELECT TO public
  USING (active = true);

-- =============================================
-- TRIGGERS AUTOMÁTICOS
-- =============================================

-- Trigger para actualizar updated_at en subscriptions
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar updated_at en professional_stats
CREATE TRIGGER update_professional_stats_updated_at
  BEFORE UPDATE ON professional_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar updated_at en professional_services
CREATE TRIGGER update_professional_services_updated_at
  BEFORE UPDATE ON professional_services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FUNCIÓN: Actualizar rating cuando se verifica una reseña
-- =============================================

CREATE OR REPLACE FUNCTION update_professional_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo actualizar si la reseña se está verificando
  IF NEW.verificado = true AND OLD.verificado = false THEN
    UPDATE professionals 
    SET 
      rating = calculate_average_rating(NEW.professional_id),
      total_reviews = count_verified_reviews(NEW.professional_id),
      updated_at = now()
    WHERE id = NEW.professional_id;
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar rating automáticamente
DROP TRIGGER IF EXISTS update_rating_on_review_verify ON reviews;
CREATE TRIGGER update_rating_on_review_verify
  AFTER UPDATE OF verificado ON reviews
  FOR EACH ROW
  WHEN (NEW.verificado = true AND OLD.verificado = false)
  EXECUTE FUNCTION update_professional_rating();

-- =============================================
-- FUNCIÓN: Crear notificación automática
-- =============================================

CREATE OR REPLACE FUNCTION create_notification(
  target_user_id uuid,
  notification_type text,
  notification_title text,
  notification_message text,
  notification_data jsonb DEFAULT '{}'
)
RETURNS uuid AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, data)
  VALUES (target_user_id, notification_type, notification_title, notification_message, notification_data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ language 'plpgsql';

-- =============================================
-- FUNCIÓN: Registrar estadística diaria
-- =============================================

CREATE OR REPLACE FUNCTION increment_professional_stat(
  prof_id uuid,
  stat_type text
)
RETURNS void AS $$
BEGIN
  INSERT INTO professional_stats (professional_id, date, profile_views, contact_requests, whatsapp_clicks, phone_clicks, search_appearances)
  VALUES (
    prof_id, 
    CURRENT_DATE,
    CASE WHEN stat_type = 'profile_view' THEN 1 ELSE 0 END,
    CASE WHEN stat_type = 'contact_request' THEN 1 ELSE 0 END,
    CASE WHEN stat_type = 'whatsapp_click' THEN 1 ELSE 0 END,
    CASE WHEN stat_type = 'phone_click' THEN 1 ELSE 0 END,
    CASE WHEN stat_type = 'search_appearance' THEN 1 ELSE 0 END
  )
  ON CONFLICT (professional_id, date)
  DO UPDATE SET
    profile_views = professional_stats.profile_views + CASE WHEN stat_type = 'profile_view' THEN 1 ELSE 0 END,
    contact_requests = professional_stats.contact_requests + CASE WHEN stat_type = 'contact_request' THEN 1 ELSE 0 END,
    whatsapp_clicks = professional_stats.whatsapp_clicks + CASE WHEN stat_type = 'whatsapp_click' THEN 1 ELSE 0 END,
    phone_clicks = professional_stats.phone_clicks + CASE WHEN stat_type = 'phone_click' THEN 1 ELSE 0 END,
    search_appearances = professional_stats.search_appearances + CASE WHEN stat_type = 'search_appearance' THEN 1 ELSE 0 END,
    updated_at = now();
END;
$$ language 'plpgsql';

-- =============================================
-- FUNCIÓN: Activar plan profesional
-- =============================================

CREATE OR REPLACE FUNCTION activate_professional_plan(prof_id uuid)
RETURNS void AS $$
BEGIN
  -- Actualizar el estado del profesional
  UPDATE professionals 
  SET 
    plan_activo = true,
    fecha_ultimo_pago = now(),
    updated_at = now()
  WHERE id = prof_id;
  
  -- Crear o actualizar suscripción
  INSERT INTO subscriptions (professional_id, plan_type, status, start_date)
  VALUES (prof_id, 'profesional', 'active', now())
  ON CONFLICT (professional_id) 
  DO UPDATE SET 
    status = 'active',
    start_date = now(),
    updated_at = now();
    
  -- Crear notificación
  PERFORM create_notification(
    (SELECT user_id FROM professionals WHERE id = prof_id),
    'system',
    'Plan Activado',
    'Tu plan profesional ha sido activado exitosamente. Ya puedes recibir contactos de clientes.',
    jsonb_build_object('plan_type', 'profesional')
  );
END;
$$ language 'plpgsql';

-- =============================================
-- VISTAS ÚTILES
-- =============================================

-- Vista para profesionales con estadísticas completas
CREATE OR REPLACE VIEW professionals_with_stats AS
SELECT 
  p.*,
  COALESCE(s.status, 'inactive') as subscription_status,
  COALESCE(s.end_date, null) as subscription_end_date,
  COALESCE(stats.total_views, 0) as total_profile_views,
  COALESCE(stats.total_contacts, 0) as total_contact_requests,
  COALESCE(stats.total_whatsapp, 0) as total_whatsapp_clicks,
  r.nombre as region_name,
  array_agg(DISTINCT c.nombre) FILTER (WHERE c.nombre IS NOT NULL) as comunas_names
FROM professionals p
LEFT JOIN subscriptions s ON p.id = s.professional_id AND s.status = 'active'
LEFT JOIN regions r ON p.region_principal = r.id
LEFT JOIN communes c ON c.nombre = ANY(p.comunas_servicio)
LEFT JOIN (
  SELECT 
    professional_id,
    SUM(profile_views) as total_views,
    SUM(contact_requests) as total_contacts,
    SUM(whatsapp_clicks) as total_whatsapp
  FROM professional_stats
  GROUP BY professional_id
) stats ON p.id = stats.professional_id
GROUP BY p.id, s.status, s.end_date, stats.total_views, stats.total_contacts, stats.total_whatsapp, r.nombre;

-- =============================================
-- DATOS INICIALES PARA TESTING
-- =============================================

-- Insertar algunas comunas de ejemplo (Región Metropolitana)
INSERT INTO communes (nombre, region_id) VALUES
('Santiago', 'metropolitana'),
('Las Condes', 'metropolitana'),
('Providencia', 'metropolitana'),
('Ñuñoa', 'metropolitana'),
('La Florida', 'metropolitana'),
('Maipú', 'metropolitana'),
('Puente Alto', 'metropolitana'),
('San Bernardo', 'metropolitana'),
('Quilicura', 'metropolitana'),
('Peñalolén', 'metropolitana'),
('La Reina', 'metropolitana'),
('Vitacura', 'metropolitana'),
('Lo Barnechea', 'metropolitana'),
('Huechuraba', 'metropolitana'),
('Independencia', 'metropolitana')
ON CONFLICT DO NOTHING;

-- Insertar algunas comunas de Valparaíso
INSERT INTO communes (nombre, region_id) VALUES
('Valparaíso', 'valparaiso'),
('Viña del Mar', 'valparaiso'),
('Concón', 'valparaiso'),
('Quilpué', 'valparaiso'),
('Villa Alemana', 'valparaiso'),
('Casablanca', 'valparaiso')
ON CONFLICT DO NOTHING;