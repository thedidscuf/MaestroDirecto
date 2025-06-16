import { supabase, Professional, dbUtils } from '../lib/supabase';

export const professionalService = {
  // =============================================
  // GESTIÓN DE PROFESIONALES
  // =============================================

  // Crear perfil de profesional
  async createProfessional(data: Omit<Professional, 'id' | 'created_at' | 'updated_at' | 'rating' | 'total_reviews' | 'verificado' | 'activo' | 'plan_activo'>) {
    try {
      const { data: professional, error } = await supabase
        .from('professionals')
        .insert([{
          ...data,
          rating: 0,
          total_reviews: 0,
          verificado: false,
          activo: true,
          plan_activo: false
        }])
        .select()
        .single();

      if (error) throw error;

      // Crear notificación de bienvenida
      if (professional) {
        await dbUtils.createNotification(
          data.user_id,
          'system',
          '¡Bienvenido a MaestroDirecto!',
          'Tu perfil profesional ha sido creado. Ahora puedes activar tu plan para comenzar a recibir clientes.',
          { professional_id: professional.id }
        );
      }

      return { data: professional, error: null };
    } catch (error) {
      console.error('Error creating professional:', error);
      return { data: null, error };
    }
  },

  // Obtener profesional por user_id
  async getProfessionalByUserId(userId: string) {
    try {
      // Use destructuring to get status directly if it's part of the successful response structure
      // when an error object is present. Typically, for HTTP errors, SupabaseError includes status.
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle(); // Changed to maybeSingle()

      if (error) {
        // Check if the error object has a 'status' property (common for SupabaseHttpError)
        // and if that status is 406.
        // Supabase errors might also have a 'code' string. e.g. error.code === 'PGRST116'
        // A direct 406 from the server would likely be an HttpError with a status.
        const supabaseError = error as any; // Use 'any' for robust checking of potential properties
        if (supabaseError.status === 406 || (supabaseError.details && supabaseError.details.includes('406'))) {
          console.warn(`Received HTTP 406 (or error containing 406) when fetching professional by user ID ${userId}. Treating as profile not found.`);
          return { data: null, error: null };
        }
        // For other errors, re-throw them to be caught by the catch block below
        throw error;
      }

      // If .maybeSingle() was used:
      // - If no row found, data is null, error is null.
      // - If one row found, data is the object, error is null.
      return { data, error: null };

    } catch (error: any) {
      // This catch block will handle errors re-thrown from the try block,
      // or other unexpected errors during the await supabase call.
      console.error(`Error in getProfessionalByUserId for user ID ${userId}:`, error);

      // Final check for 406 in the catch-all, in case the error was thrown
      // and then caught here.
      if (error.status === 406 || (error.details && error.details.includes('406'))) {
        console.warn(`Caught HTTP 406 (or error containing 406) in getProfessionalByUserId for user ID ${userId}. Treating as profile not found.`);
        return { data: null, error: null };
      }
      // For any other error caught, return it so the caller can decide how to handle.
      return { data: null, error };
    }
  },

  // Obtener profesional con estadísticas
  async getProfessionalWithStats(professionalId: string) {
    try {
      const { data, error } = await supabase
        .from('professionals_with_stats')
        .select('*')
        .eq('id', professionalId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching professional with stats:', error);
      return { data: null, error };
    }
  },

  // Buscar profesionales con filtros avanzados
  async searchProfessionals(filters: {
    query?: string;
    region?: string;
    commune?: string;
    category?: string;
    rating?: number;
    availability?: string;
    priceRange?: [number, number];
    limit?: number;
    offset?: number;
  }) {
    try {
      let query = supabase
        .from('professionals')
        .select(`
          *,
          regions!professionals_region_principal_fkey(nombre),
          professional_services(*)
        `)
        .eq('activo', true)
        .eq('plan_activo', true);

      // Filtro por texto de búsqueda
      if (filters.query) {
        query = query.or(`nombre.ilike.%${filters.query}%,especialidades.cs.{${filters.query}},descripcion.ilike.%${filters.query}%`);
      }

      // Filtro por región
      if (filters.region) {
        query = query.contains('regiones_servicio', [filters.region]);
      }

      // Filtro por comuna
      if (filters.commune) {
        query = query.or(`comuna_principal.eq.${filters.commune},comunas_servicio.cs.{${filters.commune}}`);
      }

      // Filtro por categoría
      if (filters.category) {
        query = query.contains('especialidades', [filters.category]);
      }

      // Filtro por rating mínimo
      if (filters.rating && filters.rating > 0) {
        query = query.gte('rating', filters.rating);
      }

      // Paginación
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      // Ordenar por relevancia (rating + reviews)
      query = query.order('rating', { ascending: false })
                   .order('total_reviews', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      // Registrar búsqueda para analytics
      await dbUtils.logSearch({
        query: filters.query,
        category: filters.category,
        region: filters.region,
        commune: filters.commune,
        resultsCount: data?.length || 0
      });

      return { data, error: null, count };
    } catch (error) {
      console.error('Error searching professionals:', error);
      return { data: null, error, count: 0 };
    }
  },

  // Actualizar profesional
  async updateProfessional(id: string, updates: Partial<Professional>) {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating professional:', error);
      return { data: null, error };
    }
  },

  // =============================================
  // GESTIÓN DE ARCHIVOS
  // =============================================

  // Subir foto
  async uploadPhoto(file: File, folder: string, userId: string) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      return { data: data.publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading photo:', error);
      return { data: null, error };
    }
  },

  // Eliminar foto
  async deletePhoto(photoUrl: string) {
    try {
      // Extraer el path de la URL
      const urlParts = photoUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const folder = urlParts[urlParts.length - 2];
      const filePath = `${folder}/${fileName}`;

      const { error } = await supabase.storage
        .from('photos')
        .remove([filePath]);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting photo:', error);
      return { error };
    }
  },

  // =============================================
  // GESTIÓN DE USUARIOS
  // =============================================

  // Crear datos de usuario adicionales
  async createUserData(userId: string, userData: { nombre: string; telefono: string; tipo_usuario: string }) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          id: userId,
          ...userData
        }])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating user data:', error);
      return { data: null, error };
    }
  },

  // =============================================
  // GESTIÓN DE CONTACTOS
  // =============================================

  // Crear contacto
  async createContact(contactData: {
    professional_id: string;
    client_name: string;
    client_email: string;
    client_phone: string;
    servicio: string;
    mensaje: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([contactData])
        .select()
        .single();

      if (error) throw error;

      // Incrementar estadística de contacto
      await dbUtils.incrementProfessionalStat(contactData.professional_id, 'contact_request');

      // Obtener el user_id del profesional para la notificación
      const { data: professional } = await supabase
        .from('professionals')
        .select('user_id, nombre')
        .eq('id', contactData.professional_id)
        .single();

      if (professional) {
        // Crear notificación para el profesional
        await dbUtils.createNotification(
          professional.user_id,
          'contact',
          'Nuevo contacto recibido',
          `${contactData.client_name} está interesado en tus servicios de ${contactData.servicio}`,
          { 
            contact_id: data.id,
            client_name: contactData.client_name,
            servicio: contactData.servicio
          }
        );
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error creating contact:', error);
      return { data: null, error };
    }
  },

  // Obtener contactos del profesional
  async getProfessionalContacts(professionalId: string) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('professional_id', professionalId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return { data: null, error };
    }
  },

  // =============================================
  // GESTIÓN DE RESEÑAS
  // =============================================

  // Crear reseña
  async createReview(reviewData: {
    professional_id: string;
    client_name: string;
    client_email: string;
    rating: number;
    comentario: string;
    servicio: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select()
        .single();

      if (error) throw error;

      // Obtener el user_id del profesional para la notificación
      const { data: professional } = await supabase
        .from('professionals')
        .select('user_id, nombre')
        .eq('id', reviewData.professional_id)
        .single();

      if (professional) {
        // Crear notificación para el profesional
        await dbUtils.createNotification(
          professional.user_id,
          'review',
          'Nueva reseña recibida',
          `${reviewData.client_name} te ha dejado una reseña de ${reviewData.rating} estrellas`,
          { 
            review_id: data.id,
            rating: reviewData.rating,
            client_name: reviewData.client_name
          }
        );
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error creating review:', error);
      return { data: null, error };
    }
  },

  // Obtener reseñas del profesional
  async getProfessionalReviews(professionalId: string, verified: boolean = true) {
    try {
      let query = supabase
        .from('reviews')
        .select('*')
        .eq('professional_id', professionalId)
        .order('created_at', { ascending: false });

      if (verified) {
        query = query.eq('verificado', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return { data: null, error };
    }
  },

  // =============================================
  // GESTIÓN DE ESTADÍSTICAS
  // =============================================

  // Registrar vista de perfil
  async recordProfileView(professionalId: string) {
    await dbUtils.incrementProfessionalStat(professionalId, 'profile_view');
  },

  // Registrar click en WhatsApp
  async recordWhatsAppClick(professionalId: string) {
    await dbUtils.incrementProfessionalStat(professionalId, 'whatsapp_click');
  },

  // Registrar click en teléfono
  async recordPhoneClick(professionalId: string) {
    await dbUtils.incrementProfessionalStat(professionalId, 'phone_click');
  },

  // Obtener estadísticas del profesional
  async getProfessionalStats(professionalId: string, days: number = 30) {
    try {
      const { data, error } = await supabase
        .from('professional_stats')
        .select('*')
        .eq('professional_id', professionalId)
        .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { data: null, error };
    }
  },

  // =============================================
  // GESTIÓN DE SUSCRIPCIONES
  // =============================================

  // Activar plan profesional
  async activatePlan(professionalId: string) {
    try {
      await dbUtils.activateProfessionalPlan(professionalId);
      return { error: null };
    } catch (error) {
      console.error('Error activating plan:', error);
      return { error };
    }
  },

  // Obtener suscripción activa
  async getActiveSubscription(professionalId: string) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('professional_id', professionalId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return { data: null, error };
    }
  },

  // =============================================
  // GESTIÓN DE NOTIFICACIONES
  // =============================================

  // Obtener notificaciones del usuario
  async getUserNotifications(userId: string, limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { data: null, error };
    }
  },

  // Marcar notificación como leída
  async markNotificationAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', notificationId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { error };
    }
  },

  // =============================================
  // DATOS MAESTROS
  // =============================================

  // Obtener categorías
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('activo', true)
        .order('orden');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { data: null, error };
    }
  },

  // Obtener regiones
  async getRegions() {
    try {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .eq('activo', true)
        .order('nombre');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching regions:', error);
      return { data: null, error };
    }
  },

  // Obtener comunas por región
  async getCommunesByRegion(regionId: string) {
    try {
      const { data, error } = await supabase
        .from('communes')
        .select('*')
        .eq('region_id', regionId)
        .eq('activo', true)
        .order('nombre');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching communes:', error);
      return { data: null, error };
    }
  }
};