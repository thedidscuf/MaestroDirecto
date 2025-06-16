import React from 'react';
import { Link } from 'react-router-dom';
import { Quote, Star, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { TESTIMONIOS } from '../../utils/constants';

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-800 font-medium mb-4">
            <Users className="w-4 h-4 mr-2" />
            +15,000 clientes satisfechos
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Lo que dicen{' '}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              nuestros clientes
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Miles de chilenos ya encontraron al profesional perfecto para sus proyectos.
          </p>
        </div>

        {/* Testimonials Grid - SOLO 3 TESTIMONIOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {TESTIMONIOS.slice(0, 3).map((testimonio, index) => (
            <div
              key={testimonio.id}
              className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 relative group transform hover:scale-105"
              style={{
                animationDelay: `${index * 200}ms`
              }}
            >
              {/* Quote Icon */}
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Quote className="w-5 h-5 text-white" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonio.rating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-600">
                  {testimonio.rating}.0/5.0
                </span>
              </div>

              {/* Comment */}
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "{testimonio.comentario}"
              </p>

              {/* Client Info */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold text-lg">
                    {testimonio.nombre.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">
                    {testimonio.nombre}
                  </div>
                  <div className="text-sm text-gray-600">
                    Servicio: {testimonio.servicio}
                  </div>
                  <div className="flex items-center mt-1">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600 font-medium">Cliente verificado</span>
                  </div>
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Trust indicators - MÁS COMPACTO */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Números que hablan por sí solos
            </h3>
            <p className="text-gray-600 text-sm">
              La confianza de miles de chilenos respalda nuestra plataforma
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="group">
              <div className="text-2xl font-bold text-gray-900 mb-1">4.9</div>
              <div className="text-gray-600 text-sm">Rating Promedio</div>
              <div className="text-xs text-gray-500 mt-1">De 15,000+ evaluaciones</div>
            </div>
            <div className="group">
              <div className="text-2xl font-bold text-gray-900 mb-1">2,500+</div>
              <div className="text-gray-600 text-sm">Trabajos Completados</div>
              <div className="text-xs text-gray-500 mt-1">Solo este mes</div>
            </div>
            <div className="group">
              <div className="text-2xl font-bold text-gray-900 mb-1">500+</div>
              <div className="text-gray-600 text-sm">Profesionales</div>
              <div className="text-xs text-gray-500 mt-1">Verificados y activos</div>
            </div>
            <div className="group">
              <div className="text-2xl font-bold text-gray-900 mb-1">32</div>
              <div className="text-gray-600 text-sm">Comunas</div>
              <div className="text-xs text-gray-500 mt-1">En toda la RM</div>
            </div>
          </div>
        </div>

        {/* CTA Section - MÁS COMPACTO */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
            <h3 className="text-2xl font-bold mb-3">
              ¿Listo para unirte a miles de clientes satisfechos?
            </h3>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              Encuentra al profesional perfecto para tu proyecto en menos de 5 minutos. 
              Sin comisiones, sin sorpresas, solo resultados garantizados.
            </p>
            <Link 
              to="/buscar"
              className="bg-white text-blue-600 font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition-colors transform hover:scale-105 shadow-lg"
            >
              Buscar Profesional Ahora
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;