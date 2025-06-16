import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  MessageCircle, 
  Star, 
  Eye,
  TrendingUp,
  Calendar,
  Settings,
  Camera,
  Edit,
  DollarSign,
  Clock,
  Award,
  Bell,
  Download,
  AlertCircle,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import StarRating from '../components/common/StarRating';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface ProfessionalData {
  id: string;
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
  created_at: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [professionalData, setProfessionalData] = useState<ProfessionalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfessionalData();
    }
  }, [user]);

  const fetchProfessionalData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No se encontró perfil profesional
          setError('No se encontró tu perfil profesional. ¿Completaste el registro?');
        } else {
          throw error;
        }
      } else {
        setProfessionalData(data);
      }
    } catch (error: any) {
      console.error('Error fetching professional data:', error);
      setError('Error al cargar los datos del perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error al cargar el dashboard</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={fetchProfessionalData}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!professionalData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <Users className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Perfil no encontrado</h2>
            <p className="text-gray-600 mb-6">
              No encontramos tu perfil profesional. Esto puede suceder si no completaste el registro.
            </p>
            <a 
              href="/registro-profesional"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Completar Registro
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Datos calculados basados en los datos reales
  const stats = {
    profileViews: Math.floor(Math.random() * 1000) + 500, // Simulado por ahora
    contactsReceived: Math.floor(Math.random() * 50) + 20, // Simulado por ahora
    rating: professionalData.rating,
    totalReviews: professionalData.total_reviews,
    completedJobs: Math.floor(Math.random() * 100) + 50, // Simulado por ahora
    responseTime: '< 1h'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Profesional</h1>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                <Settings className="w-5 h-5" />
                <span>Configuración</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bienvenida personalizada */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center space-x-4">
            {professionalData.foto_url ? (
              <img 
                src={professionalData.foto_url} 
                alt={professionalData.nombre}
                className="w-16 h-16 rounded-full object-cover border-4 border-white"
              />
            ) : (
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold">¡Hola, {professionalData.nombre}!</h2>
              <p className="text-blue-100">
                {professionalData.especialidades.join(', ')} en {professionalData.comuna_principal}
              </p>
              <div className="flex items-center mt-2">
                {professionalData.verificado ? (
                  <div className="flex items-center text-green-300">
                    <Award className="w-4 h-4 mr-1" />
                    <span className="text-sm">Perfil verificado</span>
                  </div>
                ) : (
                  <div className="flex items-center text-yellow-300">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">Verificación pendiente</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Visualizaciones</p>
                <p className="text-2xl font-bold text-gray-900">{stats.profileViews.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12% este mes
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Contactos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.contactsReceived}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8% este mes
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.rating > 0 ? stats.rating.toFixed(1) : 'N/A'}
                </p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              {stats.totalReviews} reseñas
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Trabajos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedJobs}</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Completados
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'overview', label: 'Resumen', icon: BarChart3 },
                { id: 'profile', label: 'Mi Perfil', icon: Users },
                { id: 'subscription', label: 'Suscripción', icon: DollarSign }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Resumen de tu perfil</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-medium text-gray-900 mb-4">Información básica</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-600">Especialidades:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {professionalData.especialidades.map((esp, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {esp}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Experiencia:</span>
                          <span className="ml-2 text-gray-900">{professionalData.experiencia} años</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Ubicación:</span>
                          <span className="ml-2 text-gray-900">{professionalData.comuna_principal}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-medium text-gray-900 mb-4">Estado del perfil</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Verificado</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            professionalData.verificado 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {professionalData.verificado ? 'Sí' : 'Pendiente'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Plan activo</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            professionalData.plan_activo 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {professionalData.plan_activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Fotos subidas</span>
                          <span className="text-gray-900">{professionalData.fotos_trabajos.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Mi Perfil</h3>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-medium text-gray-900 mb-4">Información Personal</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600">Nombre</label>
                          <p className="font-medium text-gray-900">{professionalData.nombre}</p>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600">Email</label>
                          <p className="font-medium text-gray-900">{user?.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600">Teléfono</label>
                          <p className="font-medium text-gray-900">{professionalData.telefono}</p>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600">RUT</label>
                          <p className="font-medium text-gray-900">{professionalData.rut}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-medium text-gray-900 mb-4">Descripción</h4>
                      <p className="text-gray-700">{professionalData.descripcion}</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-medium text-gray-900 mb-4">Galería de Trabajos</h4>
                      {professionalData.fotos_trabajos.length > 0 ? (
                        <div className="grid grid-cols-3 gap-4">
                          {professionalData.fotos_trabajos.map((foto, index) => (
                            <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                              <img 
                                src={foto} 
                                alt={`Trabajo ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No has subido fotos de trabajos aún</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6 text-center">
                      {professionalData.foto_url ? (
                        <img 
                          src={professionalData.foto_url} 
                          alt={professionalData.nombre}
                          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <Camera className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Cambiar foto
                      </button>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-medium text-gray-900 mb-4">Estadísticas</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Perfil completado</span>
                          <span className="font-medium text-gray-900">
                            {Math.round((
                              (professionalData.foto_url ? 1 : 0) +
                              (professionalData.descripcion ? 1 : 0) +
                              (professionalData.fotos_trabajos.length > 0 ? 1 : 0) +
                              (professionalData.especialidades.length > 0 ? 1 : 0)
                            ) / 4 * 100)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Miembro desde</span>
                          <span className="font-medium text-gray-900">
                            {new Date(professionalData.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Suscripción</h3>
                  
                  <div className={`rounded-2xl p-8 border-2 ${
                    professionalData.plan_activo 
                      ? 'bg-gradient-to-br from-green-50 to-blue-50 border-green-200' 
                      : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">
                          {professionalData.plan_activo ? 'Plan Profesional Activo' : 'Plan Inactivo'}
                        </h4>
                        <p className="text-gray-600">
                          {professionalData.plan_activo 
                            ? 'Tu suscripción está activa y funcionando' 
                            : 'Activa tu plan para recibir clientes'
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">$5.990</div>
                        <div className="text-sm text-gray-600">por mes</div>
                      </div>
                    </div>

                    {!professionalData.plan_activo && (
                      <div className="bg-white/50 rounded-xl p-6 mb-6">
                        <h5 className="font-semibold text-gray-900 mb-2">¿Por qué activar tu plan?</h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Aparece en todas las búsquedas</li>
                          <li>• Recibe contactos directos de clientes</li>
                          <li>• Sin comisiones por trabajo</li>
                          <li>• Badge de profesional verificado</li>
                        </ul>
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        {professionalData.plan_activo ? 'Gestionar Plan' : 'Activar Plan'}
                      </button>
                      {professionalData.plan_activo && (
                        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          Cancelar suscripción
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;