import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, Shield, Star, Clock, CheckCircle, Award } from 'lucide-react';
import StarRating from '../common/StarRating';

interface ProfessionalCardProps {
  professional: {
    id: string;
    nombre: string;
    especialidad: string;
    rating: number;
    totalReviews: number;
    comuna: string;
    foto: string;
    descripcion: string;
    badge?: string;
  };
  className?: string;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ 
  professional, 
  className = '' 
}) => {
  const handleWhatsAppContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = `Hola ${professional.nombre}, vi tu perfil en MaestroDirecto y me interesa contactarte para un trabajo de ${professional.especialidad}.`;
    const whatsappUrl = `https://wa.me/56912345678?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group ${className}`}>
      {/* Header with gradient */}
      <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6 text-white">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="relative flex-shrink-0">
            <img
              src={professional.foto}
              alt={professional.nombre}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-lg"
            />
            {professional.badge && (
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full flex items-center font-bold shadow-lg">
                <Award className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                <span className="hidden sm:inline">{professional.badge}</span>
              </div>
            )}
            {/* Online indicator */}
            <div className="absolute bottom-0 right-0 sm:bottom-1 sm:right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-white truncate mb-1">
              {professional.nombre}
            </h3>
            <p className="text-blue-100 font-semibold mb-2 text-sm sm:text-base">
              {professional.especialidad}
            </p>
            <div className="flex items-center text-blue-100 text-sm">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="truncate">{professional.comuna}</span>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-3 sm:mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="flex items-center">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="text-xs sm:text-sm">{'Responde en menos de 1h'}</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="text-xs sm:text-sm">Verificado</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Rating */}
        <div className="mb-4">
          <StarRating 
            rating={professional.rating} 
            totalReviews={professional.totalReviews}
            size="sm"
          />
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm line-clamp-3 mb-6 leading-relaxed">
          {professional.descripcion}
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6">
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" />
            <span>Garantía incluida</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-yellow-500" />
            <span>Top rated</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-500" />
            <span>Disponible hoy</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-purple-500" />
            <span>Presupuesto gratis</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Link
            to={`/profesional/${professional.id}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-center py-2 sm:py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-sm sm:text-base"
          >
            Ver Perfil
          </Link>
          <button
            onClick={handleWhatsAppContact}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 sm:py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center hover:scale-105 shadow-lg text-sm sm:text-base"
          >
            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            WhatsApp
          </button>
        </div>

        {/* Trust indicator */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            ⚡ Respuesta garantizada en menos de 1 hora
          </p>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default ProfessionalCard;