import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Por favor ingresa tu email');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔍 Checking email configuration...');
      console.log('📧 Sending password reset email to:', email);

      const { error: resetError } = await resetPassword(email);
      
      if (resetError) {
        console.error('❌ Reset password error:', resetError);
        
        // Manejar errores específicos
        if (resetError.message.includes('rate_limit')) {
          setError('Demasiados intentos. Espera 15 minutos antes de intentar nuevamente.');
        } else if (resetError.message.includes('Invalid email')) {
          setError('El formato del email no es válido');
        } else if (resetError.message.includes('User not found')) {
          // Por seguridad, no revelamos si el usuario existe o no
          setSuccess(true);
        } else {
          setError('Error al enviar el email. Intenta nuevamente en unos minutos.');
        }
        return;
      }

      console.log('✅ Password reset email sent successfully');
      setSuccess(true);
      
    } catch (error: any) {
      console.error('❌ Unexpected error:', error);
      setError('Error inesperado. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-white">MaestroDirecto</span>
            </Link>
          </div>

          {/* Success Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-4">
              Email enviado
            </h1>

            <p className="text-blue-200 mb-6">
              Hemos enviado un enlace para restablecer tu contraseña a:
            </p>

            <div className="bg-white/10 rounded-xl p-4 mb-6">
              <p className="text-white font-semibold">{email}</p>
            </div>

            <p className="text-blue-200 text-sm mb-8">
              Revisa tu bandeja de entrada y carpeta de spam. El enlace expira en 1 hora.
            </p>

            {/* Instructions */}
            <div className="text-left mb-8">
              <h3 className="text-white font-semibold mb-3">Instrucciones:</h3>
              <ul className="text-blue-200 text-sm space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">1.</span>
                  Busca un email de "MaestroDirecto\" o "noreply@supabase.io"
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">2.</span>
                  Haz clic en "Restablecer contraseña"
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">3.</span>
                  Ingresa tu nueva contraseña
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">4.</span>
                  Inicia sesión con tu nueva contraseña
                </li>
              </ul>
            </div>

            {/* Back to login */}
            <Link
              to="/login"
              className="inline-flex items-center text-blue-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-white mb-2">Restablecer contraseña</h1>
          <p className="text-blue-200">Ingresa tu email para recibir un enlace de restablecimiento</p>
        </div>

        {/* Reset Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center text-red-200">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email registrado
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-blue-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                  placeholder="tu@email.com"
                  required
                />
              </div>
              <p className="text-blue-300 text-xs mt-2">
                Debe ser el mismo email con el que te registraste
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:transform-none"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  Enviar enlace de restablecimiento
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

          {/* Back to Login */}
          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-blue-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al login
            </Link>
          </div>
        </div>

        {/* Help */}
        <div className="mt-8 text-center">
          <p className="text-blue-200 text-sm">
            ¿Problemas para restablecer?{' '}
            <a href="mailto:soporte@maestrodirecto.cl" className="text-blue-300 hover:text-white">
              Contacta soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;