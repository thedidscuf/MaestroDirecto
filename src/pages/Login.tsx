import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const from = location.state?.from?.pathname || '/dashboard';

  // Mostrar mensaje de éxito si viene del reset de contraseña
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Limpiar el mensaje después de 5 segundos
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [location.state]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      console.log('🔐 Attempting login for:', formData.email);
      
      const { error: authError } = await signIn(formData.email, formData.password);
      
      if (authError) {
        console.error('❌ Login error:', authError);
        
        // Manejar errores específicos de manera amigable
        if (authError.message.includes('Invalid login credentials')) {
          setError('Email o contraseña incorrectos. Verifica tus datos.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Tu cuenta necesita verificación. Contacta soporte si tienes problemas.');
        } else if (authError.message.includes('Too many requests')) {
          setError('Demasiados intentos. Espera unos minutos antes de intentar nuevamente.');
        } else {
          setError('Error al iniciar sesión. Verifica tus datos e intenta nuevamente.');
        }
        return;
      }

      console.log('✅ Login successful, redirecting to:', from);
      navigate(from, { replace: true });
      
    } catch (error: any) {
      console.error('❌ Unexpected login error:', error);
      setError('Error inesperado. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-white">MaestroDirecto</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Bienvenido de vuelta</h1>
          <p className="text-blue-200">Accede a tu cuenta profesional</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-500/20 border border-green-500/30 rounded-xl p-4 flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-green-200 text-sm font-medium">¡Éxito!</p>
                <p className="text-green-200 text-sm mt-1">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-300 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-200 text-sm font-medium">Error de inicio de sesión</p>
                <p className="text-red-200 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-blue-300" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  placeholder="tu@email.com"
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-blue-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  placeholder="Tu contraseña"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-blue-300 hover:text-white transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="mr-2 text-blue-600 focus:ring-blue-500 rounded bg-white/10 border-white/20"
                  disabled={loading}
                />
                <span className="text-sm text-blue-200">Recordarme</span>
              </label>
              <Link to="/reset-password" className="text-sm text-blue-300 hover:text-white transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-sm text-blue-200">o</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-blue-200 mb-4">¿No tienes cuenta?</p>
            <Link
              to="/registro"
              className="inline-flex items-center px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              Registrarse como Profesional
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-blue-200 text-sm">
            ¿Problemas para acceder?{' '}
            <a href="mailto:soporte@maestrodirecto.cl" className="text-blue-300 hover:text-white">
              Contacta soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;