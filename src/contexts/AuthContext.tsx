import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { 
  supabase, 
  testSupabaseConnection, 
  isValidEmail, 
  clearAllAuthData, 
  performLogin,
  checkDatabaseStatus,
  verifyUserCredentials
} from '../lib/supabase';
import { professionalService } from '../services/professionalService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  resendConfirmation: (email: string) => Promise<{ error: AuthError | null }>;
  pendingProfileFiles: { foto: File | null, fotos: File[] } | null;
  setPendingProfileFiles: (files: { foto: File | null, fotos: File[] } | null) => void;
  isCreatingProfile: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingProfileFiles, setPendingProfileFilesState] = useState<{ foto: File | null, fotos: File[] } | null>(null);
  const [isCreatingProfile, setIsCreatingProfile] = useState<boolean>(false);

  const setPendingProfileFiles = (files: { foto: File | null, fotos: File[] } | null) => {
    setPendingProfileFilesState(files);
  };

  useEffect(() => {
    // Test Supabase connection and database on startup
    const initializeApp = async () => {
      console.log('🚀 Initializing MaestroDirecto...');
      
      // Test connection
      const connectionTest = await testSupabaseConnection();
      if (!connectionTest.success) {
        console.error('❌ Failed to connect to Supabase:', connectionTest.error);
      }
      
      // Test database
      const dbTest = await checkDatabaseStatus();
      if (!dbTest.success) {
        console.error('❌ Database check failed:', dbTest.error);
      }
    };

    initializeApp();

    // Get initial session with comprehensive error handling
    const initializeAuth = async () => {
      try {
        console.log('🔍 Checking for existing session...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting initial session:', error);
          
          // Si hay error de sesión corrupta, limpiarla completamente
          if (error.message.includes('Invalid Refresh Token') || 
              error.message.includes('refresh_token_not_found') ||
              error.message.includes('invalid_grant') ||
              error.message.includes('JWT expired')) {
            console.log('🧹 Detected corrupted session, clearing completely...');
            await clearAllAuthData();
            setSession(null);
            setUser(null);
            setLoading(false);
            return;
          }
        }
        
        if (session?.user) {
          console.log('✅ Found existing session for:', session.user.email);
          setSession(session);
          setUser(session.user);
        } else {
          console.log('ℹ️ No existing session found');
          setSession(null);
          setUser(null);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('❌ Unexpected error initializing auth:', error);
        // En caso de error inesperado, limpiar todo
        await clearAllAuthData();
        setSession(null);
        setUser(null);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes with better error handling
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth event:', event, session?.user?.email || 'No user');
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle successful sign in - NO VERIFICACIÓN DE EMAIL
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('✅ User signed in successfully');
        
        // Crear datos de usuario si no existen
        try {
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('id', session.user.id)
            .single();

          if (!existingUser) {
            // Crear datos básicos del usuario
            const userData = session.user.user_metadata;
            await professionalService.createUserData(session.user.id, {
              nombre: userData.nombre || '',
              telefono: userData.telefono || '',
              tipo_usuario: userData.tipo_usuario || 'cliente'
            });
          }
        } catch (error) {
          console.error('❌ Error creating user data:', error);
        }

        // Crear perfil profesional si hay datos pendientes
        const pendingData = localStorage.getItem('pendingProfessionalData');
        if (pendingData && pendingProfileFiles) { // Ensure both exist before attempting
          setIsCreatingProfile(true); // Set loading state true
          try {
            const professionalDataFromStorage = JSON.parse(pendingData);
            // No need to check pendingProfileFiles again here, already checked in the outer if
            await createProfessionalProfile(session.user.id, professionalDataFromStorage, pendingProfileFiles);
            localStorage.removeItem('pendingProfessionalData');
            setPendingProfileFiles(null);
            console.log('✅ Professional profile created from pending data and files. Cleared localStorage and pending files state.');
          } catch (error) {
            console.error('❌ Critical error creating professional profile from pending data. Data will be kept for next attempt (localStorage & context state):', error);
            // localStorage and pendingProfileFiles are intentionally not cleared here
          } finally {
            setIsCreatingProfile(false); // Set loading state false
          }
        } else if (pendingData && !pendingProfileFiles) {
          // Handle case where localStorage data exists but files are missing in context state
          // This might indicate an incomplete previous registration attempt or an inconsistent state.
          console.warn('⚠️ Pending professional data found in localStorage, but no pending files in AuthContext state. Profile creation cannot proceed. Manual cleanup or re-registration might be needed.');
          // Optionally, clear localStorage.removeItem('pendingProfessionalData') here if it's considered stale without files.
          // For now, leave it, as the user might re-attempt registration which would call setPendingProfileFiles.
        }
      }

      // Handle token refresh errors
      if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token refreshed successfully');
      }

      // Handle sign out
      if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out');
        localStorage.removeItem('pendingProfessionalData');
      }

      // Handle auth errors
      if (event === 'SIGNED_OUT' && session === null) {
        // Esto puede indicar un error de autenticación
        console.log('🔍 Checking for auth errors...');
      }
    });

    return () => subscription.unsubscribe();
  }, [pendingProfileFiles]); // Add pendingProfileFiles to the dependency array

  const createProfessionalProfile = async (userId: string, profileData: any, filesToUpload: { foto: File | null, fotos: File[] }) => {
    try {
      console.log('Creating professional profile for user:', userId);
      
      // Subir fotos primero si existen
      let fotoUrl = '';
      const fotosTrabajos: string[] = [];

      // Subir foto de perfil
      if (filesToUpload && filesToUpload.foto instanceof File) {
        try {
          const { data: photoUrlData, error: photoError } = await professionalService.uploadPhoto(
            filesToUpload.foto, // Use filesToUpload.foto
            'profiles',
            userId
          );
          if (!photoError && photoUrlData) {
            fotoUrl = photoUrlData;
          } else if (photoError) {
            console.error('❌ Error uploading profile photo:', photoError);
          }
        } catch (error) {
          console.error('❌ Exception uploading profile photo:', error);
        }
      }

      // Subir fotos de trabajos
      if (filesToUpload && Array.isArray(filesToUpload.fotos)) {
        for (let i = 0; i < filesToUpload.fotos.length; i++) {
          const fotoFile = filesToUpload.fotos[i]; // Use filesToUpload.fotos
          if (fotoFile instanceof File) {
            try {
              const { data: photoUrlData, error: photoError } = await professionalService.uploadPhoto(
                fotoFile,
                'portfolio',
                userId
              );
              if (!photoError && photoUrlData) {
                fotosTrabajos.push(photoUrlData);
              } else if (photoError) {
                console.error('❌ Error uploading work photo:', photoError);
              }
            } catch (error) {
              console.error('❌ Exception uploading work photo:', error);
            }
          }
        }
      }

      const { error } = await professionalService.createProfessional({
        user_id: userId,
        nombre: profileData.nombre,
        rut: profileData.rut,
        telefono: profileData.telefono,
        foto_url: fotoUrl || null, // This is the generated URL
        especialidades: profileData.servicios || [],
        descripcion: profileData.descripcion,
        region_principal: profileData.regionPrincipal,
        comuna_principal: profileData.comunaPrincipal,
        regiones_servicio: profileData.regionesServicio || [],
        comunas_servicio: profileData.comunasServicio || [],
        experiencia: profileData.experiencia,
        fotos_trabajos: fotosTrabajos, // These are the generated URLs
        precios: profileData.precios || {}
      });

      if (error) throw error;
      console.log('✅ Professional profile created successfully');
    } catch (error) {
      console.error('❌ Error creating professional profile:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log('🔄 Attempting to sign up user:', email);
      
      // Validate email format
      if (!isValidEmail(email)) {
        return { error: { message: 'Formato de email inválido' } as AuthError };
      }

      // Validate password strength
      if (password.length < 6) {
        return { error: { message: 'La contraseña debe tener al menos 6 caracteres' } as AuthError };
      }
      
      // ✅ REGISTRO SIN VERIFICACIÓN DE EMAIL
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // NO configurar emailRedirectTo para evitar verificación
          data: {
            nombre: userData.nombre,
            telefono: userData.telefono,
            tipo_usuario: userData.tipo_usuario || 'profesional'
          }
        }
      });

      if (error) {
        console.error('❌ SignUp error:', error);
      } else {
        console.log('✅ SignUp successful for:', email);
        console.log('🎉 User can login immediately - no email verification required');
      }

      return { error };
    } catch (error) {
      console.error('❌ Unexpected signUp error:', error);
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔄 Starting enhanced login process for:', email);
      
      // Validate input
      if (!email || !password) {
        return { error: { message: 'Email y contraseña son requeridos' } as AuthError };
      }

      if (!isValidEmail(email)) {
        return { error: { message: 'Formato de email inválido' } as AuthError };
      }

      // Verificar credenciales en la base de datos primero
      const credentialsCheck = await verifyUserCredentials(email);
      if (!credentialsCheck.exists) {
        return { error: { message: credentialsCheck.message } as AuthError };
      }

      if (!credentialsCheck.active) {
        return { error: { message: credentialsCheck.message } as AuthError };
      }

      // Usar la función de login mejorada
      const loginResult = await performLogin(email, password);
      
      if (!loginResult.success) {
        return { error: { message: loginResult.error } as AuthError };
      }

      console.log('✅ Enhanced login successful');
      return { error: null };

    } catch (error) {
      console.error('❌ Unexpected signIn error:', error);
      return { error: { message: 'Error inesperado durante el login' } as AuthError };
    }
  };

  const signOut = async () => {
    try {
      console.log('🔄 Signing out user...');
      
      const { error } = await supabase.auth.signOut();
      
      // Limpiar localStorage independientemente del resultado
      localStorage.removeItem('pendingProfessionalData');
      
      if (error) {
        console.error('❌ SignOut error:', error);
      } else {
        console.log('✅ SignOut successful');
      }
      
      return { error };
    } catch (error) {
      console.error('❌ Unexpected signOut error:', error);
      return { error: error as AuthError };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('🔄 Starting password reset for:', email);
      
      if (!isValidEmail(email)) {
        return { error: { message: 'Formato de email inválido' } as AuthError };
      }

      // ✅ CONFIGURACIÓN CORRECTA PARA RESET PASSWORD
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`
      });

      if (error) {
        console.error('❌ Reset password error:', error);
        
        // Manejar errores específicos
        if (error.message.includes('rate limit')) {
          return { error: { message: 'Demasiados intentos. Espera 15 minutos antes de intentar nuevamente.' } as AuthError };
        } else if (error.message.includes('email not found')) {
          // Por seguridad, no revelar si el email existe
          return { error: null };
        } else {
          return { error: { message: 'Error al enviar el email. Intenta nuevamente.' } as AuthError };
        }
      }

      console.log('✅ Password reset email sent successfully');
      return { error: null };

    } catch (error) {
      console.error('❌ Unexpected reset password error:', error);
      return { error: error as AuthError };
    }
  };

  const resendConfirmation = async (email: string) => {
    try {
      if (!isValidEmail(email)) {
        return { error: { message: 'Formato de email inválido' } as AuthError };
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    resendConfirmation,
    pendingProfileFiles,
    setPendingProfileFiles,
    isCreatingProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};