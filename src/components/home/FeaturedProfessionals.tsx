import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Award, Verified, MessageCircle } from 'lucide-react';
import ProfessionalCard from '../professional/ProfessionalCard';
import { PROFESIONALES_DESTACADOS } from '../../utils/constants';

const FeaturedProfessionals: React.FC = () => {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-0 w-64 h-64 bg-gradient-to-l from-blue-100 to-transparent rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-10 left-0 w-64 h-64 bg-gradient-to-r from-purple-100 to-transparent rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full text-orange-800 font-medium mb-4">
            <Award className="w-4 h-4 mr-2" />
            Maestros destacados del mes
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Los{' '}
            <span className="bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
              mejores profesionales
            </span>
            {' '}de Chile
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Conoce a nuestros profesionales mejor evaluados, con años de experiencia 
            y miles de clientes satisfechos.
          </p>
        </div>

        {/* Featured badges - MÁS COMPACTO */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <div className="flex items-center px-3 py-2 bg-green-100 rounded-full text-green-800 font-medium text-sm">
              <Verified className="w-4 h-4 mr-2" />
              100% Verificados
            </div>
            <div className="flex items-center px-3 py-2 bg-blue-100 rounded-full text-blue-800 font-medium text-sm">
              <Award className="w-4 h-4 mr-2" />
              +4.8 ⭐ Rating
            </div>
            <div className="flex items-center px-3 py-2 bg-purple-100 rounded-full text-purple-800 font-medium text-sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              {"Respuesta < 1 hora"}
            </div>
          </div>
        </div>

        {/* Professionals Grid - SOLO 3 PROFESIONALES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PROFESIONALES_DESTACADOS.slice(0, 3).map((professional, index) => (
            <div
              key={professional.id}
              className="animate-fade-in"
              style={{
                animationDelay: `${index * 200}ms`
              }}
            >
              <ProfessionalCard 
                professional={professional}
                className="transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
              />
            </div>
          ))}
        </div>

        {/* Success stories - MÁS COMPACTO */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Historias de Éxito
            </h3>
            <p className="text-gray-600 text-sm">
              Estos profesionales han transformado miles de hogares chilenos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">2,500+</div>
              <div className="text-gray-600 text-sm mb-1">Trabajos completados</div>
              <div className="text-xs text-gray-500">En los últimos 12 meses</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">4.9⭐</div>
              <div className="text-gray-600 text-sm mb-1">Rating promedio</div>
              <div className="text-xs text-gray-500">De 15,000+ evaluaciones</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">98%</div>
              <div className="text-gray-600 text-sm mb-1">Clientes satisfechos</div>
              <div className="text-xs text-gray-500">Recomendarían el servicio</div>
            </div>
          </div>
        </div>

        {/* CTA Section - MÁS COMPACTO */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-3">
              ¿Necesitas un profesional ahora?
            </h3>
            <p className="text-blue-200 mb-4 max-w-xl mx-auto text-sm">
              No esperes más. Encuentra al maestro perfecto para tu proyecto en menos de 5 minutos.
              Contacto directo, sin intermediarios.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                to="/buscar"
                className="bg-white text-gray-900 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors transform hover:scale-105"
              >
                Buscar Profesionales
              </Link>
              <Link 
                to="/buscar"
                className="border-2 border-white text-white font-bold py-3 px-6 rounded-xl hover:bg-white hover:text-gray-900 transition-colors transform hover:scale-105"
              >
                Ver Todos los Maestros
                <ChevronRight className="ml-2 w-5 h-5 inline" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProfessionals;