import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Wrench, 
  Hammer, 
  Paintbrush, 
  Home, 
  TreePine, 
  Key,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { CATEGORIAS_SERVICIOS } from '../../utils/constants';

const CategoryGrid: React.FC = () => {
  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ReactElement } = {
      'Zap': <Zap className="w-6 h-6" />,
      'Wrench': <Wrench className="w-6 h-6" />,
      'Hammer': <Hammer className="w-6 h-6" />,
      'Paintbrush': <Paintbrush className="w-6 h-6" />,
      'Brick': <Home className="w-6 h-6" />,
      'Home': <Home className="w-6 h-6" />,
      'TreePine': <TreePine className="w-6 h-6" />,
      'Key': <Key className="w-6 h-6" />,
    };
    return icons[iconName] || <Home className="w-6 h-6" />;
  };

  const popularServices = ['electricista', 'gasfiter', 'carpintero', 'pintor'];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23e3f2fd%22 fill-opacity=%220.4%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 font-medium mb-4">
            <TrendingUp className="w-4 h-4 mr-2" />
            Servicios más solicitados
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Encuentra el{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              servicio perfecto
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Más de 500 profesionales verificados esperan ayudarte con tu proyecto.
          </p>
        </div>

        {/* GRID MÁS COMPACTO - 4 COLUMNAS EN DESKTOP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-12">
          {CATEGORIAS_SERVICIOS.slice(0, 8).map((categoria, index) => {
            const isPopular = popularServices.includes(categoria.id);
            return (
              <Link
                key={categoria.id}
                to={`/buscar?categoria=${categoria.id}`}
                className="group relative bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 overflow-hidden"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    Popular
                  </div>
                )}

                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg">
                    <div className="text-blue-600 group-hover:text-purple-600 transition-colors duration-300">
                      {getIcon(categoria.icon)}
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">
                    {categoria.nombre}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                    {categoria.descripcion}
                  </p>

                  <div className="flex items-center text-blue-600 font-semibold text-xs group-hover:text-purple-600 transition-colors duration-300">
                    Ver profesionales
                    <ChevronRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* STATS MÁS COMPACTOS EN UNA SOLA FILA */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="group">
              <div className="text-2xl font-bold text-gray-900 mb-1">{'< 2 hrs'}</div>
              <div className="text-gray-600 text-sm">Tiempo de respuesta</div>
            </div>
            <div className="group">
              <div className="text-2xl font-bold text-gray-900 mb-1">24/7</div>
              <div className="text-gray-600 text-sm">Disponibilidad</div>
            </div>
            <div className="group">
              <div className="text-2xl font-bold text-gray-900 mb-1">98%</div>
              <div className="text-gray-600 text-sm">Satisfacción</div>
            </div>
            <div className="group">
              <div className="text-2xl font-bold text-gray-900 mb-1">32</div>
              <div className="text-gray-600 text-sm">Comunas</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/buscar"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Explorar Todos los Servicios
            <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;