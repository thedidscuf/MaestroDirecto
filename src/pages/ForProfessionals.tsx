import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  DollarSign, 
  Star, 
  Shield,
  Clock,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Award,
  BarChart3,
  Camera,
  Phone
} from 'lucide-react';

const ForProfessionals: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-900 via-blue-800 to-purple-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white mb-6">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">+500 profesionales activos</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Haz crecer tu{' '}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  negocio
                </span>
                {' '}con MaestroDirecto
              </h1>
              
              <p className="text-xl text-blue-100 mb-8">
                Únete a la plataforma líder en Chile para profesionales independientes.
                Sin comisiones, solo una suscripción mensual fija.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/registro"
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 px-8 rounded-xl hover:from-orange-600 hover:to-red-700 transition-colors inline-flex items-center justify-center"
                >
                  Registrarse Gratis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white hover:text-gray-900 transition-colors inline-flex items-center justify-center"
                >
                  Ya tengo cuenta
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
                  <span>Primer mes gratis</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
                  <span>Sin comisiones</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
                  <span>Clientes verificados</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6">Plan Profesional</h3>
                <div className="text-4xl font-bold mb-2">
                  $5.990
                  <span className="text-lg font-normal text-blue-200">/mes</span>
                </div>
                <p className="text-blue-200 mb-6">Sin comisiones por trabajo</p>
                
                <div className="space-y-3 mb-8">
                  {[
                    'Perfil verificado con badge',
                    'Aparece en todas las búsquedas',
                    'Contacto directo de clientes',
                    'Galería de fotos ilimitada',
                    'Dashboard con estadísticas',
                    'Soporte prioritario 24/7'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-300 mr-3" />
                      <span className="text-blue-100">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-400/20 border border-yellow-400/30 rounded-xl p-4">
                  <div className="flex items-center">
                    <div className="text-yellow-300 mr-3">🎉</div>
                    <div>
                      <p className="font-semibold text-yellow-200">¡Oferta especial!</p>
                      <p className="text-sm text-yellow-300">Primer mes completamente gratis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir MaestroDirecto?
            </h2>
            <p className="text-xl text-gray-600">
              La plataforma que realmente funciona para profesionales independientes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sin Comisiones</h3>
              <p className="text-gray-700 mb-4">
                Solo pagas $5.990 al mes. Todo lo que ganes es 100% tuyo.
                Sin comisiones ocultas ni descuentos por trabajo.
              </p>
              <div className="text-sm text-green-700 font-semibold">
                Ahorra hasta $200.000 al mes vs. competencia
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Más Clientes</h3>
              <p className="text-gray-700 mb-4">
                Accede a miles de clientes que buscan profesionales cada día.
                Promedio de 15 contactos nuevos por mes.
              </p>
              <div className="text-sm text-blue-700 font-semibold">
                +2,500 búsquedas diarias en la plataforma
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Clientes Verificados</h3>
              <p className="text-gray-700 mb-4">
                Todos los clientes pasan por verificación. Sin pérdida de tiempo
                con contactos falsos o no serios.
              </p>
              <div className="text-sm text-purple-700 font-semibold">
                98% de contactos resultan en trabajos reales
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 border border-yellow-200">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Construye tu Reputación</h3>
              <p className="text-gray-700 mb-4">
                Sistema de reseñas transparente que te ayuda a destacar
                y conseguir más trabajos.
              </p>
              <div className="text-sm text-yellow-700 font-semibold">
                Profesionales 5⭐ reciben 3x más contactos
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 border border-red-200">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Respuesta Inmediata</h3>
              <p className="text-gray-700 mb-4">
                Los clientes te contactan directamente por WhatsApp.
                Sin esperas, sin intermediarios.
              </p>
              <div className="text-sm text-red-700 font-semibold">
                Contacto directo en menos de 5 minutos
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 border border-indigo-200">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Dashboard Completo</h3>
              <p className="text-gray-700 mb-4">
                Estadísticas detalladas, gestión de contactos y
                herramientas para hacer crecer tu negocio.
              </p>
              <div className="text-sm text-indigo-700 font-semibold">
                Aumenta tus ingresos hasta 40% con nuestras herramientas
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros profesionales
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <img
                  src="https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Carlos"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-900">Carlos M.</h4>
                  <p className="text-gray-600">Electricista</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Desde que me uní a MaestroDirecto, mis ingresos aumentaron 60%. 
                Los clientes son serios y el pago es directo. ¡Excelente plataforma!"
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <img
                  src="https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Ana"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-900">Ana R.</h4>
                  <p className="text-gray-600">Gasfiter</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Lo mejor es que no cobran comisiones. Todo lo que gano es mío. 
                Además, el dashboard me ayuda a organizar mejor mi trabajo."
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <img
                  src="https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Miguel"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-900">Miguel T.</h4>
                  <p className="text-gray-600">Carpintero</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Recibo contactos de calidad todos los días. Los clientes ya vienen 
                convencidos porque ven mi perfil completo y mis trabajos anteriores."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proceso de Registro */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Únete en 4 simples pasos
            </h2>
            <p className="text-xl text-gray-600">
              El proceso de registro toma menos de 10 minutos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Datos Básicos</h3>
              <p className="text-gray-600 text-sm">
                Nombre, RUT, contacto y foto de perfil profesional
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-green-600" />
              </div>
              <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Servicios</h3>
              <p className="text-gray-600 text-sm">
                Especialidades, experiencia y zonas donde trabajas
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-10 h-10 text-purple-600" />
              </div>
              <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Portfolio</h3>
              <p className="text-gray-600 text-sm">
                Fotos de trabajos realizados y precios referenciales
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-10 h-10 text-orange-600" />
              </div>
              <div className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                4
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Suscripción</h3>
              <p className="text-gray-600 text-sm">
                Activa tu plan y comienza a recibir clientes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para hacer crecer tu negocio?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Únete a más de 500 profesionales que ya están ganando más con MaestroDirecto
          </p>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2">$5.990</div>
                <div className="text-green-200">Suscripción mensual</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">0%</div>
                <div className="text-green-200">Comisiones</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">30 días</div>
                <div className="text-green-200">Primer mes gratis</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/registro"
              className="bg-white text-green-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors inline-flex items-center justify-center text-lg"
            >
              Registrarse Ahora
              <ArrowRight className="ml-2 w-6 h-6" />
            </Link>
            <Link
              to="/como-funciona"
              className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white hover:text-green-600 transition-colors inline-flex items-center justify-center"
            >
              Ver Cómo Funciona
            </Link>
          </div>

          <p className="text-green-200 text-sm mt-6">
            Sin permanencia • Cancela cuando quieras • Soporte 24/7
          </p>
        </div>
      </section>
    </div>
  );
};

export default ForProfessionals;