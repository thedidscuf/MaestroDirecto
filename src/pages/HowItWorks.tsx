import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MessageCircle, 
  CheckCircle, 
  Star,
  Shield,
  Clock,
  Users,
  ArrowRight,
  Phone,
  CreditCard,
  Award
} from 'lucide-react';

const HowItWorks: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            ¿Cómo funciona{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              MaestroDirecto
            </span>
            ?
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Conectamos clientes con profesionales verificados de forma simple, rápida y segura.
            Sin intermediarios, sin comisiones ocultas.
          </p>
        </div>
      </section>

      {/* Para Clientes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Para Clientes
            </h2>
            <p className="text-xl text-gray-600">
              Encuentra al profesional perfecto en 3 simples pasos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-blue-600" />
              </div>
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Busca y Filtra</h3>
              <p className="text-gray-600">
                Busca por servicio, ubicación y filtra por rating, precio y disponibilidad.
                Todos nuestros profesionales están verificados.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-green-600" />
              </div>
              <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contacta Directo</h3>
              <p className="text-gray-600">
                Contacta directamente por WhatsApp o teléfono. Sin intermediarios,
                sin comisiones adicionales para ti.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-purple-600" />
              </div>
              <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Trabajo Realizado</h3>
              <p className="text-gray-600">
                El profesional realiza el trabajo con garantía incluida.
                Después puedes dejar tu reseña para ayudar a otros.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Para Profesionales */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Para Profesionales
            </h2>
            <p className="text-xl text-gray-600">
              Haz crecer tu negocio con clientes verificados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Regístrate</h3>
              <p className="text-sm text-gray-600">
                Crea tu perfil profesional con fotos de trabajos
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Verificación</h3>
              <p className="text-sm text-gray-600">
                Verificamos tu identidad y experiencia
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Recibe Clientes</h3>
              <p className="text-sm text-gray-600">
                Los clientes te contactan directamente
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Cobra Directo</h3>
              <p className="text-sm text-gray-600">
                Sin comisiones, solo suscripción mensual
              </p>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <Shield className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">100% Verificados</h3>
              <p className="text-gray-600">
                Todos nuestros profesionales pasan por un proceso de verificación
                de identidad y experiencia.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <Clock className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Respuesta Rápida</h3>
              <p className="text-gray-600">
                Los profesionales responden en promedio en menos de 1 hora.
                Muchos están disponibles 24/7.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <Star className="w-12 h-12 text-yellow-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Calidad Garantizada</h3>
              <p className="text-gray-600">
                Sistema de reseñas transparente y garantía en todos los trabajos
                realizados por nuestros profesionales.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <MessageCircle className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sin Intermediarios</h3>
              <p className="text-gray-600">
                Contacto directo entre cliente y profesional. Sin comisiones
                ocultas ni costos adicionales.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <Award className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mejor Precio</h3>
              <p className="text-gray-600">
                Al no cobrar comisiones, los profesionales pueden ofrecer
                mejores precios que la competencia.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <Users className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Comunidad</h3>
              <p className="text-gray-600">
                Más de 500 profesionales y 15,000 clientes satisfechos
                en toda la Región Metropolitana.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a miles de chilenos que ya encontraron al profesional perfecto
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/buscar"
              className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              Buscar Profesionales
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/registro"
              className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
            >
              Soy Profesional
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;