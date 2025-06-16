import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, Shield, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { updatePasswordWithToken } from '../lib/supabase';

const UpdatePassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(false);

  // Verificar tokens en la URL
  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');
    
    console.log('🔍 Checking URL parameters:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      type: type,
      fullUrl: window.location.href
    });
    
    if (!accessToken || type !== 'recovery') {
      console.error('❌ Invalid or missing tokens in URL');
      setError('Enlace inválido o expirado. Solicita un nuevo enlace de restablecimiento.');
    } else {
      console.log('✅ Valid recovery tokens found');
      setTokenValid(true);
    }
  }, [searchParams]);

  const validatePassword = (pwd: string): string[] => {
    const errors = [];
    if (pwd.length < 6) errors.push('Mínimo 6 caracteres');
    if (pwd.length > 72) errors.push('Máximo 72 caracteres');
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tokenValid) {
      setError('Enlace inválido. Solicita un nuevo enlace de restablecimiento.');
      return;
    }
    
    if (!password || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join(', '));
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔐 Updating password...');
      
      const result = await updatePasswordWithToken(password);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar la contraseña');
      }

      console.log('✅ Password updated successfully');
      setSuccess(true);
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Contraseña actualizada exitosamente. Puedes iniciar sesión con tu nueva contraseña.' 
          }
        });
      }, 3000);
      
    } catch (error: any) {
      console.error('❌ Update password error:', error);
      if (error.message?.includes('session_not_found') || error.message?.includes('invalid_grant')) {
        setError('Sesión expirada. Solicita un nuevo enlace de restablecimiento.');
      } else if (error.message?.includes('weak_password')) {
        setError('La contraseña es muy débil. Usa al menos 6 caracteres con variedad.');
      } else {
        setError(error.message || 'Error al actualizar la contraseña');
      }
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
              ¡Contraseña actualizada!
            </h1>

            <p className="text-blue-200 mb-8">
              Tu contraseña ha sido actualizada exitosamente. 
              Serás redirigido al login en unos segundos.
            </p>

            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Ir al login ahora
              <ArrowRight className="w-4 h-4 ml-2" />
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
          <h1 className="text-3xl font-bold text-white mb-2">Nueva contraseña</h1>
          <p className="text-blue-200">Ingresa tu nueva contraseña segura</p>
        </div>

        {/* Update Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center text-red-200">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="text-sm">{error}</span>
              </div>
              {error.includes('Sesión expirada') && (
                <div className="mt-3 pt-3 border-t border-red-300/30">
                  <Link 
                    to="/reset-password" 
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Solicitar nuevo enlace
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {!tokenValid ? (
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Enlace inválido</h3>
              <p className="text-blue-200 mb-6">
                Este enlace ha expirado o no es válido. Solicita un nuevo enlace de restablecimiento.
              </p>
              <Link
                to="/reset-password"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Solicitar nuevo enlace
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-blue-300" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="Mínimo 6 caracteres"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-blue-300 hover:text-white"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-blue-300" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError('');
                    }}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="Repite tu nueva contraseña"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-blue-300 hover:text-white"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
                <h4 className="text-blue-200 font-medium mb-2">Requisitos de la contraseña:</h4>
                <ul className="text-blue-300 text-sm space-y-1">
                  <li className={`flex items-center ${password.length >= 6 ? 'text-green-300' : ''}`}>
                    <span className="mr-2">{password.length >= 6 ? '✓' : '•'}</span>
                    Mínimo 6 caracteres
                  </li>
                  <li className={`flex items-center ${password === confirmPassword && password ? 'text-green-300' : ''}`}>
                    <span className="mr-2">{password === confirmPassword && password ? '✓' : '•'}</span>
                    Las contraseñas coinciden
                  </li>
                  <li className={`flex items-center ${password && password !== password.toLowerCase() ? 'text-green-300' : 'text-blue-300'}`}>
                    <span className="mr-2">{password && password !== password.toLowerCase() ? '✓' : '•'}</span>
                    Incluye mayúsculas (recomendado)
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !password || !confirmPassword}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Actualizando...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Actualizar contraseña
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Help */}
        <div className="mt-8 text-center">
          <p className="text-blue-200 text-sm">
            ¿Problemas?{' '}
            <a href="mailto:soporte@maestrodirecto.cl" className="text-blue-300 hover:text-white">
              Contacta soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;