import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Star, 
  Shield, 
  Clock, 
  Award,
  CheckCircle,
  Camera,
  Calendar,
  DollarSign,
  Users,
  ThumbsUp
} from 'lucide-react';
import StarRating from '../components/common/StarRating';
import { PROFESIONALES_DESTACADOS, TESTIMONIOS } from '../utils/constants';

const ProfessionalDetail: React.FC = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(0);

  // Simular datos del profesional
  const professional = PROFESIONALES_DESTACADOS.find(p => p.id === id) || PROFESIONALES_DESTACADOS[0];
  
  const portfolioImages = [
    'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
  ];

  const handleWhatsAppContact = () => {
    const message = `Hola ${professional.nombre}, vi tu perfil en MaestroDirecto y me interesa contactarte para un trabajo de ${professional.especialidad}.`;
    const whatsappUrl = `https://wa.me/56912345678?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCall = () => {
    window.open('tel:+56912345678', '_self');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            to="/buscar" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a resultados
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Professional Header */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                <div className="flex items-start space-x-6">
                  <div className="relative">
                    <img
                      src={professional.foto}
                      alt={professional.nombre}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs px-3 py-1 rounded-full flex items-center font-bold shadow-lg">
                      <Award className="w-3 h-3 mr-1" />
                      Verificado
                    </div>
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{professional.nombre}</h1>
                    <p className="text-xl text-blue-100 mb-4">{professional.especialidad}</p>
                    
                    <div className="flex items-center space-x-6 mb-4">
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span>{professional.comuna}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        <span>Responde en {'< 1h'}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        <span>+150 trabajos</span>
                      </div>
                    </div>

                    <StarRating 
                      rating={professional.rating} 
                      totalReviews={professional.totalReviews}
                      size="lg"
                      className="mb-4"
                    />

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-green-300" />
                        <span>Identidad verificada</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
                        <span>Garantía incluida</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-8">
                  {[
                    { id: 'overview', label: 'Resumen' },
                    { id: 'portfolio', label: 'Trabajos' },
                    { id: 'reviews', label: 'Reseñas' },
                    { id: 'services', label: 'Servicios' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Sobre mí</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {professional.descripcion} Con más de 15 años de experiencia en el rubro, 
                        me especializo en brindar soluciones rápidas y efectivas para el hogar y la empresa. 
                        Mi compromiso es la calidad y la satisfacción del cliente.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-center mb-3">
                          <Award className="w-6 h-6 text-yellow-500 mr-2" />
                          <h4 className="font-semibold text-gray-900">Experiencia</h4>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">15+ años</p>
                        <p className="text-sm text-gray-600">En el rubro</p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-center mb-3">
                          <ThumbsUp className="w-6 h-6 text-green-500 mr-2" />
                          <h4 className="font-semibold text-gray-900">Satisfacción</h4>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">98%</p>
                        <p className="text-sm text-gray-600">Clientes satisfechos</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Especialidades</h4>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Instalaciones eléctricas',
                          'Reparaciones urgentes',
                          'Mantención preventiva',
                          'Sistemas de iluminación',
                          'Tableros eléctricos'
                        ].map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'portfolio' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Galería de Trabajos</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {portfolioImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative group cursor-pointer"
                          onClick={() => setSelectedImage(index)}
                        >
                          <img
                            src={image}
                            alt={`Trabajo ${index + 1}`}
                            className="w-full h-48 object-cover rounded-xl"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-xl flex items-center justify-center">
                            <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Selected Image Modal would go here */}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Reseñas de Clientes</h3>
                      <div className="text-sm text-gray-600">
                        {professional.totalReviews} reseñas
                      </div>
                    </div>

                    <div className="space-y-6">
                      {TESTIMONIOS.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-bold">
                                {review.nombre.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{review.nombre}</h4>
                                  <p className="text-sm text-gray-600">Servicio: {review.servicio}</p>
                                </div>
                                <StarRating rating={review.rating} showNumber={false} size="sm" />
                              </div>
                              <p className="text-gray-700 italic">"{review.comentario}"</p>
                              <p className="text-xs text-gray-500 mt-2">{review.fecha}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'services' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Servicios y Precios</h3>
                    
                    <div className="space-y-4">
                      {[
                        { service: 'Instalación de enchufes', price: '$15.000 - $25.000', time: '1-2 horas' },
                        { service: 'Reparación de cortocircuitos', price: '$20.000 - $40.000', time: '2-3 horas' },
                        { service: 'Instalación de luminarias', price: '$25.000 - $50.000', time: '2-4 horas' },
                        { service: 'Mantención de tableros', price: '$30.000 - $60.000', time: '3-5 horas' }
                      ].map((item, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{item.service}</h4>
                              <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center text-sm text-gray-600">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  {item.price}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {item.time}
                                </div>
                              </div>
                            </div>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                              Solicitar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 rounded-xl p-6">
                      <h4 className="font-semibold text-blue-900 mb-2">Garantía incluida</h4>
                      <p className="text-blue-800 text-sm">
                        Todos los trabajos incluyen garantía de 30 días. Si no estás satisfecho, 
                        volvemos sin costo adicional.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Contactar Profesional</h3>
              
              <div className="space-y-4">
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contactar por WhatsApp
                </button>

                <button
                  onClick={handleCall}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Llamar Ahora
                </button>

                <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Agendar Cita
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Tiempo de respuesta promedio: {'< 1 hora'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 mr-2" />
                  Profesional verificado por MaestroDirecto
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Trabajos completados</span>
                  <span className="font-semibold text-gray-900">150+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Años de experiencia</span>
                  <span className="font-semibold text-gray-900">15</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Clientes satisfechos</span>
                  <span className="font-semibold text-gray-900">98%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Respuesta promedio</span>
                  <span className="font-semibold text-gray-900">{'< 1h'}</span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Garantías</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm text-gray-700">Identidad verificada</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm text-gray-700">Garantía de 30 días</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm text-gray-700">Seguro de responsabilidad</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm text-gray-700">Presupuesto sin compromiso</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDetail;