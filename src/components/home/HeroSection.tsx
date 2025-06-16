import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, Clock, Star, CheckCircle, TrendingUp } from 'lucide-react';
import SearchBar from '../common/SearchBar';

const HeroSection: React.FC = () => {
  const handleSearch = (query: string, comuna: string) => {
    // Redirigir a la página de búsqueda con los parámetros
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (comuna) params.set('comuna', comuna);
    window.location.href = `/buscar?${params.toString()}`;
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
      {/* Simplified Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-blue-800/50 to-indigo-900/50"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white mb-6 animate-fade-in">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span className="text-xs sm:text-sm font-medium">+500 maestros verificados te esperan</span>
          </div>

          {/* Main Heading - MÁS COMPACTO */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 animate-slide-up">
            Encuentra al{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              maestro perfecto
            </span>
            <br />
            <span className="text-2xl sm:text-3xl md:text-4xl">para tu proyecto</span>
          </h1>
          
          {/* Subtitle - MÁS CORTO */}
          <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 max-w-3xl mx-auto animate-slide-up animation-delay-200 px-4">
            La plataforma líder en Chile que conecta clientes con profesionales verificados.
            <br className="hidden sm:block" />
            <span className="text-yellow-400 font-semibold">Sin comisiones. Solo confianza y calidad garantizada.</span>
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12 animate-slide-up animation-delay-400 px-4 relative z-50">
            <SearchBar 
              onSearch={handleSearch}
              size="large"
              className="drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
            />
            <p className="text-blue-200 text-xs sm:text-sm mt-3">
              💡 Prueba buscar: "electricista", "gasfiter", "carpintero", "mecánico"
            </p>
          </div>

          {/* Trust Indicators - MÁS COMPACTO EN UNA SOLA FILA */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mb-8 sm:mb-12 animate-slide-up animation-delay-600 px-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-white">
                <div className="font-bold text-sm sm:text-lg mb-1">100% Verificados</div>
                <div className="text-blue-200 text-xs sm:text-sm">Identidad validada</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-white">
                <div className="font-bold text-sm sm:text-lg mb-1">+500 Maestros</div>
                <div className="text-blue-200 text-xs sm:text-sm">En toda Chile</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-white">
                <div className="font-bold text-sm sm:text-lg mb-1">Respuesta Inmediata</div>
                <div className="text-blue-200 text-xs sm:text-sm">Contacto directo</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Star className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-white">
                <div className="font-bold text-sm sm:text-lg mb-1">4.9⭐ Rating</div>
                <div className="text-blue-200 text-xs sm:text-sm">15,000+ reseñas</div>
              </div>
            </div>
          </div>

          {/* CTA for Professionals - MÁS COMPACTO */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 max-w-3xl mx-auto shadow-2xl animate-slide-up animation-delay-1000 transform hover:scale-105 transition-all duration-300 mx-4">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="text-left mb-4 lg:mb-0">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  ¿Eres Maestro o Técnico?
                </h3>
                <p className="text-orange-100 text-sm sm:text-base mb-3">
                  Únete a la plataforma líder y recibe trabajo directo de clientes.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-white text-xs sm:text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-300" />
                    <span>Sin comisiones</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-300" />
                    <span>Solo $5.990/mes</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-300" />
                    <span>Clientes verificados</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2 w-full lg:w-auto">
                <Link
                  to="/registro-profesional"
                  className="bg-white text-orange-600 font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:bg-gray-100 hover:shadow-lg transform hover:scale-105 inline-flex items-center justify-center group"
                >
                  Registrarse Gratis
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="text-orange-200 text-xs text-center">
                  ⚡ Primer mes gratis para nuevos registros
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;