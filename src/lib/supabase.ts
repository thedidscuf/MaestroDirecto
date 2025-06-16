import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

console.log('🔧 Supabase Config:', {
  url: supabaseUrl,
  anonKey: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'missing',
  urlValid: supabaseUrl.includes('supabase.co'),
  keyValid: supabaseAnonKey.length > 100
});

// Configuración optimizada para emails y reset de contraseñas
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // ✅ IMPORTANTE: Detectar tokens en URL para reset password
    flowType: 'pkce', // ✅ PKCE para mejor seguridad
    debug: false
  },
  global: {
    headers: {
      'X-Client-Info': 'maestro-directo@1.0.0'
    }
  }
});

// Test connection function mejorado
export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test básico usando una consulta simple
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection test failed:', error);
      return { 
        success: false, 
        error: error.message,
        step: 'connection_test',
        details: error
      };
    }
    
    console.log('✅ Supabase connection successful');
    return { success: true, data };
    
  } catch (error) {
    console.error('❌ Connection test failed with exception:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown connection error',
      step: 'network_error'
    };
  }
};

// Función para verificar el estado de la base de datos
export const checkDatabaseStatus = async () => {
  try {
    console.log('🔍 Checking database status...');
    
    // Verificar que las tablas principales existen
    const tables = ['users', 'professionals', 'categories'];
    const results = [];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.error(`❌ Table ${table} check failed:`, error);
          results.push({ table, success: false, error: error.message });
        } else {
          console.log(`✅ Table ${table} accessible`);
          results.push({ table, success: true });
        }
      } catch (err) {
        console.error(`❌ Exception checking table ${table}:`, err);
        results.push({ 
          table, 
          success: false, 
          error: err instanceof Error ? err.message : 'Unknown error' 
        });
      }
    }
    
    const allSuccessful = results.every(r => r.success);
    
    if (allSuccessful) {
      console.log('✅ All database tables accessible');
      return { success: true, results };
    } else {
      console.error('❌ Some database tables not accessible:', results);
      return { 
        success: false, 
        error: 'Some database tables are not accessible',
        results
      };
    }
    
  } catch (error) {
    console.error('❌ Database status check failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Database check failed',
      suggestion: 'Verifica la configuración de Supabase y las variables de entorno'
    };
  }
};

// Función para verificar las credenciales específicas
export const verifyUserCredentials = async (email: string) => {
  try {
    console.log('🔍 Verifying user credentials for:', email);
    
    const { data, error } = await supabase
      .from('users')
      .select('id, email, verificado, activo')
      .eq('email', email.toLowerCase().trim())
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return { 
          exists: false, 
          message: 'No existe una cuenta con este email. ¿Necesitas registrarte?' 
        };
      }
      console.error('❌ Error verifying credentials:', error);
      throw error;
    }
    
    if (!data.activo) {
      return { 
        exists: true, 
        active: false,
        message: 'Tu cuenta está desactivada. Contacta soporte.' 
      };
    }
    
    console.log('✅ User credentials verified successfully');
    return { 
      exists: true, 
      active: true, 
      verified: data.verificado,
      message: 'Cuenta válida encontrada' 
    };
    
  } catch (error) {
    console.error('❌ Error verifying credentials:', error);
    return { 
      exists: false, 
      error: error instanceof Error ? error.message : 'Error verificando credenciales' 
    };
  }
};

// Función para limpiar completamente la sesión
export const clearAllAuthData = async () => {
  try {
    console.log('🧹 Clearing all auth data...');
    
    // 1. Cerrar sesión en Supabase
    await supabase.auth.signOut({ scope: 'global' });
    
    // 2. Limpiar localStorage completamente
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('supabase') || key.includes('auth') || key.includes('sb-'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed: ${key}`);
      } catch (error) {
        console.warn(`⚠️ Could not remove ${key}:`, error);
      }
    });
    
    // 3. Limpiar sessionStorage también
    try {
      sessionStorage.clear();
    } catch (error) {
      console.warn('⚠️ Could not clear sessionStorage:', error);
    }
    
    console.log('✅ All auth data cleared');
    return { success: true };
  } catch (error) {
    console.error('❌ Error clearing auth data:', error);
    return { success: false, error };
  }
};

// Función para hacer login con manejo de errores mejorado
export const performLogin = async (email: string, password: string) => {
  try {
    console.log('🔐 Starting enhanced login process for:', email);
    
    // 1. Verificar conexión primero
    const connectionTest = await testSupabaseConnection();
    if (!connectionTest.success) {
      throw new Error(`Connection failed: ${connectionTest.error}`);
    }
    
    // 2. Verificar base de datos
    const dbTest = await checkDatabaseStatus();
    if (!dbTest.success) {
      throw new Error(`Database check failed: ${dbTest.error}`);
    }
    
    // 3. Limpiar cualquier sesión previa
    await clearAllAuthData();
    
    // 4. Esperar un momento para que se limpie completamente
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 5. Intentar login
    console.log('🔑 Attempting authentication...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password: password
    });
    
    if (error) {
      console.error('❌ Authentication failed:', error);
      
      // Analizar el tipo de error específico
      if (error.status === 400) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email o contraseña incorrectos. Verifica tus credenciales.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Tu email no ha sido verificado. Revisa tu bandeja de entrada.');
        } else if (error.message.includes('Too many requests')) {
          throw new Error('Demasiados intentos. Espera 15 minutos antes de intentar nuevamente.');
        } else {
          throw new Error(`Error de autenticación: ${error.message}`);
        }
      } else if (error.status === 422) {
        throw new Error('Datos de login inválidos. Verifica el formato de tu email.');
      } else if (error.status === 429) {
        throw new Error('Demasiadas solicitudes. Espera unos minutos antes de intentar nuevamente.');
      } else {
        throw new Error(`Error de servidor (${error.status}): ${error.message}`);
      }
    }
    
    if (!data.user) {
      throw new Error('Login exitoso pero no se recibieron datos del usuario');
    }
    
    console.log('✅ Login successful:', {
      email: data.user.email,
      confirmed: !!data.user.email_confirmed_at,
      id: data.user.id
    });
    
    return { success: true, user: data.user, session: data.session };
    
  } catch (error) {
    console.error('❌ Login process failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido durante el login'
    };
  }
};

// ✅ FUNCIÓN MEJORADA: Actualizar contraseña con token
export const updatePasswordWithToken = async (newPassword: string) => {
  try {
    console.log('🔐 Starting password update process...');
    
    // 1. Verificar que hay una sesión activa
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Error getting session:', sessionError);
      throw new Error('Error de sesión. Solicita un nuevo enlace de restablecimiento.');
    }
    
    if (!session) {
      console.error('❌ No active session found');
      throw new Error('Sesión expirada. Solicita un nuevo enlace de restablecimiento.');
    }
    
    console.log('✅ Valid session found, updating password...');
    
    // 2. Actualizar la contraseña
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (updateError) {
      console.error('❌ Error updating password:', updateError);
      
      if (updateError.message.includes('session_not_found')) {
        throw new Error('Sesión expirada. Solicita un nuevo enlace de restablecimiento.');
      } else if (updateError.message.includes('weak_password')) {
        throw new Error('La contraseña es muy débil. Usa al menos 6 caracteres.');
      } else {
        throw new Error(`Error actualizando contraseña: ${updateError.message}`);
      }
    }
    
    console.log('✅ Password updated successfully');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Failed to update password:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error actualizando contraseña'
    };
  }
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// =============================================
// TIPOS DE DATOS PRINCIPALES
// =============================================

export interface User {
  id: string;
  nombre: string;
  telefono?: string;
  tipo_usuario: 'cliente' | 'profesional';
  created_at: string;
  updated_at: string;
}

export interface Professional {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  nombre: string;
  rut: string;
  telefono: string;
  foto_url?: string;
  especialidades: string[];
  descripcion: string;
  region_principal: string;
  comuna_principal: string;
  regiones_servicio: string[];
  comunas_servicio: string[];
  experiencia: string;
  fotos_trabajos: string[];
  precios: Record<string, string>;
  rating: number;
  total_reviews: number;
  verificado: boolean;
  activo: boolean;
  plan_activo: boolean;
  fecha_ultimo_pago?: string;
}

export interface Review {
  id: string;
  created_at: string;
  professional_id: string;
  client_name: string;
  client_email: string;
  rating: number;
  comentario: string;
  servicio: string;
  verificado: boolean;
}

export interface Contact {
  id: string;
  created_at: string;
  professional_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  servicio: string;
  mensaje: string;
  estado: 'pendiente' | 'respondido' | 'completado';
}

export interface Category {
  id: string;
  nombre: string;
  descripcion: string;
  icon: string;
  activo: boolean;
  orden: number;
  created_at: string;
}

export interface Region {
  id: string;
  nombre: string;
  codigo: string;
  activo: boolean;
  created_at: string;
}

export interface Commune {
  id: string;
  nombre: string;
  region_id: string;
  activo: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  professional_id: string;
  plan_type: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  price_monthly: number;
  start_date: string;
  end_date?: string;
  auto_renew: boolean;
  payment_method?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  subscription_id: string;
  professional_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method?: string;
  transaction_id?: string;
  payment_date?: string;
  invoice_number?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'contact' | 'review' | 'payment' | 'system' | 'verification';
  title: string;
  message: string;
  data: Record<string, any>;
  read: boolean;
  read_at?: string;
  created_at: string;
}

export interface ProfessionalStats {
  id: string;
  professional_id: string;
  date: string;
  profile_views: number;
  contact_requests: number;
  whatsapp_clicks: number;
  phone_clicks: number;
  search_appearances: number;
  created_at: string;
  updated_at: string;
}

export interface SearchLog {
  id: string;
  query?: string;
  category?: string;
  region?: string;
  commune?: string;
  results_count: number;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  contact_id: string;
  sender_id: string;
  message: string;
  read: boolean;
  read_at?: string;
  created_at: string;
}

export interface ProfessionalAvailability {
  id: string;
  professional_id: string;
  day_of_week: number; // 0 = Domingo, 6 = Sábado
  start_time: string;
  end_time: string;
  available: boolean;
  created_at: string;
}

export interface ProfessionalService {
  id: string;
  professional_id: string;
  category_id: string;
  service_name: string;
  description?: string;
  price_min?: number;
  price_max?: number;
  unit?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// =============================================
// TIPOS EXTENDIDOS CON RELACIONES
// =============================================

export interface ProfessionalWithStats extends Professional {
  subscription_status: string;
  subscription_end_date?: string;
  total_profile_views: number;
  total_contact_requests: number;
  total_whatsapp_clicks: number;
  region_name?: string;
  comunas_names?: string[];
}

export interface ContactWithMessages extends Contact {
  messages?: ContactMessage[];
  professional?: Professional;
}

export interface ReviewWithProfessional extends Review {
  professional?: Professional;
}

// =============================================
// FUNCIONES DE UTILIDAD PARA LA BASE DE DATOS
// =============================================

export const dbUtils = {
  // Incrementar estadística de profesional
  async incrementProfessionalStat(professionalId: string, statType: string) {
    const { error } = await supabase.rpc('increment_professional_stat', {
      prof_id: professionalId,
      stat_type: statType
    });
    
    if (error) {
      console.error('Error incrementing stat:', error);
    }
  },

  // Activar plan profesional
  async activateProfessionalPlan(professionalId: string) {
    const { error } = await supabase.rpc('activate_professional_plan', {
      prof_id: professionalId
    });
    
    if (error) {
      console.error('Error activating plan:', error);
      throw error;
    }
  },

  // Crear notificación
  async createNotification(
    userId: string, 
    type: string, 
    title: string, 
    message: string, 
    data: Record<string, any> = {}
  ) {
    const { data: notificationId, error } = await supabase.rpc('create_notification', {
      target_user_id: userId,
      notification_type: type,
      notification_title: title,
      notification_message: message,
      notification_data: data
    });
    
    if (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
    
    return notificationId;
  },

  // Registrar búsqueda para analytics
  async logSearch(searchParams: {
    query?: string;
    category?: string;
    region?: string;
    commune?: string;
    resultsCount: number;
    userId?: string;
  }) {
    const { error } = await supabase
      .from('search_logs')
      .insert([{
        query: searchParams.query,
        category: searchParams.category,
        region: searchParams.region,
        commune: searchParams.commune,
        results_count: searchParams.resultsCount,
        user_id: searchParams.userId,
        ip_address: null, // Se puede obtener del servidor
        user_agent: navigator.userAgent
      }]);
    
    if (error) {
      console.error('Error logging search:', error);
    }
  }
};