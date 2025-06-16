import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { REGIONES_CHILE, TODAS_LAS_COMUNAS, CATEGORIAS_SERVICIOS } from '../../utils/constants';

interface SearchBarProps {
  onSearch?: (query: string, comuna: string) => void;
  size?: 'default' | 'large';
  className?: string;
}

interface ServiceSuggestion {
  id: string;
  nombre: string;
  descripcion: string;
  type: 'category' | 'service';
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  size = 'default',
  className = '' 
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedComuna, setSelectedComuna] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);
  const [showComunas, setShowComunas] = useState(false);
  const [comunaSearch, setComunaSearch] = useState('');
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);

  const serviceInputRef = useRef<HTMLInputElement>(null);
  const serviceContainerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Servicios adicionales comunes
  const additionalServices = [
    'limpieza', 'mudanza', 'fumigación', 'aire acondicionado', 'calefacción',
    'construcción', 'remodelación', 'mantención', 'reparación', 'instalación',
    'plomero', 'técnico', 'maestro', 'especialista'
  ];

  // Combinar categorías oficiales con servicios adicionales
  const allServices: ServiceSuggestion[] = [
    // Categorías oficiales primero
    ...CATEGORIAS_SERVICIOS.map(cat => ({
      id: cat.id,
      nombre: cat.nombre,
      descripcion: cat.descripcion,
      type: 'category' as const
    })),
    // Servicios adicionales que no están en categorías
    ...additionalServices
      .filter(service => !CATEGORIAS_SERVICIOS.some(cat => 
        cat.nombre.toLowerCase() === service.toLowerCase()
      ))
      .map(service => ({
        id: service,
        nombre: service.charAt(0).toUpperCase() + service.slice(1),
        descripcion: `Buscar ${service} en tu zona`,
        type: 'service' as const
      }))
  ];

  // Filtrar servicios basado en la búsqueda
  const getFilteredServices = (): ServiceSuggestion[] => {
    if (query.length === 0) {
      // Mostrar servicios populares cuando no hay búsqueda
      return allServices.slice(0, 8);
    }
    
    return allServices.filter(service =>
      service.nombre.toLowerCase().includes(query.toLowerCase()) ||
      service.descripcion.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);
  };

  const filteredServices = getFilteredServices();

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query, selectedComuna);
    } else {
      // Fallback: redirigir directamente
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (selectedComuna) params.set('comuna', selectedComuna);
      navigate(`/buscar?${params.toString()}`);
    }
    setShowServiceSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedSuggestionIndex >= 0 && filteredServices[focusedSuggestionIndex]) {
        selectService(filteredServices[focusedSuggestionIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedSuggestionIndex(prev => 
        prev < filteredServices.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setShowServiceSuggestions(false);
      setFocusedSuggestionIndex(-1);
    }
  };

  // ✅ FUNCIÓN CLAVE: NAVEGACIÓN INMEDIATA AL SELECCIONAR SERVICIO
  const selectService = (service: ServiceSuggestion) => {
    console.log('Servicio seleccionado:', service.nombre);
    
    // 1. Cerrar dropdown inmediatamente
    setShowServiceSuggestions(false);
    setFocusedSuggestionIndex(-1);
    
    // 2. Navegar inmediatamente SIN actualizar el input
    const params = new URLSearchParams();
    params.set('q', service.nombre);
    if (selectedComuna) params.set('comuna', selectedComuna);
    
    console.log('Navegando a:', `/buscar?${params.toString()}`);
    navigate(`/buscar?${params.toString()}`);
  };

  const handleInputFocus = () => {
    setShowServiceSuggestions(true);
    setFocusedSuggestionIndex(-1);
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setShowServiceSuggestions(true);
    setFocusedSuggestionIndex(-1);
  };

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (serviceContainerRef.current && !serviceContainerRef.current.contains(event.target as Node)) {
        setShowServiceSuggestions(false);
        setFocusedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrar comunas por búsqueda
  const filteredComunas = comunaSearch.length > 0 
    ? TODAS_LAS_COMUNAS.filter(comuna =>
        comuna.toLowerCase().includes(comunaSearch.toLowerCase())
      ).slice(0, 15)
    : [];

  // Obtener comunas de la región seleccionada
  const comunasDeRegion = selectedRegion 
    ? REGIONES_CHILE.find(r => r.id === selectedRegion)?.comunas || []
    : [];

  const comunasToShow = selectedRegion ? comunasDeRegion : filteredComunas;

  const isLarge = size === 'large';

  return (
    <div className={`relative ${className}`}>
      <div className={`flex flex-col sm:flex-row bg-white rounded-lg shadow-lg border border-gray-200 overflow-visible ${
        isLarge ? 'min-h-16' : 'min-h-12'
      }`}>
        {/* Service Input */}
        <div className="flex-1 relative" ref={serviceContainerRef}>
          <div className="flex items-center h-full">
            <Search className={`absolute left-3 sm:left-4 text-gray-400 z-10 ${isLarge ? 'w-6 h-6' : 'w-5 h-5'}`} />
            <input
              ref={serviceInputRef}
              type="text"
              placeholder="¿Qué servicio necesitas? Ej: electricista, gasfiter..."
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={handleInputFocus}
              className={`w-full h-full bg-transparent border-0 outline-none focus:ring-0 ${
                isLarge ? 'pl-12 sm:pl-14 pr-3 sm:pr-4 py-4 text-base sm:text-lg' : 'pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 text-sm sm:text-base'
              } placeholder-gray-500`}
              style={{ fontSize: '16px' }} // Prevent zoom on iOS
            />
          </div>

          {/* ✅ DROPDOWN CON NAVEGACIÓN INMEDIATA */}
          {showServiceSuggestions && (
            <div 
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-2xl max-h-80 overflow-y-auto"
              style={{ 
                zIndex: 999999
              }}
            >
              {query.length === 0 && (
                <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
                  <p className="text-sm font-semibold text-blue-800 flex items-center">
                    <Search className="w-4 h-4 mr-2" />
                    Servicios populares
                  </p>
                </div>
              )}
              
              {filteredServices.length > 0 ? (
                filteredServices.map((service, index) => (
                  <button
                    key={`${service.id}-${index}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Click en servicio:', service.nombre);
                      selectService(service);
                    }}
                    onMouseDown={(e) => {
                      // Prevenir que el input pierda el foco antes del click
                      e.preventDefault();
                    }}
                    onMouseEnter={() => setFocusedSuggestionIndex(index)}
                    className={`w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center space-x-3 transition-colors border-b border-gray-50 last:border-b-0 cursor-pointer ${
                      index === focusedSuggestionIndex ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      service.type === 'category' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {service.type === 'category' ? (
                        <span className="text-blue-600 text-lg">🔧</span>
                      ) : (
                        <Search className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        {service.nombre}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 truncate">
                        {service.descripcion}
                      </div>
                      {service.type === 'category' && (
                        <div className="text-xs text-blue-600 mt-1 font-medium">✓ Categoría oficial</div>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center">
                  <Search className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm font-medium">No se encontraron servicios</p>
                  <p className="text-gray-400 text-xs mt-1">Intenta con otro término de búsqueda</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comuna Selector */}
        <div className="relative border-t sm:border-t-0 sm:border-l border-gray-200">
          <button
            onClick={() => setShowComunas(!showComunas)}
            className={`flex items-center justify-between w-full h-full px-3 sm:px-4 text-gray-700 hover:bg-gray-50 transition-colors ${
              isLarge ? 'py-4 text-base sm:text-lg' : 'py-3 text-sm sm:text-base'
            }`}
          >
            <div className="flex items-center min-w-0">
              <MapPin className={`mr-2 text-gray-400 flex-shrink-0 ${isLarge ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-4 h-4 sm:w-5 sm:h-5'}`} />
              <span className="truncate">
                {selectedComuna || 'Ubicación'}
              </span>
            </div>
            <ChevronDown className={`ml-2 text-gray-400 flex-shrink-0 transition-transform duration-200 ${showComunas ? 'rotate-180' : ''} ${isLarge ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-4 h-4 sm:w-5 sm:h-5'}`} />
          </button>

          {/* Comunas Dropdown */}
          {showComunas && (
            <div className="absolute top-full right-0 left-0 sm:left-auto bg-white border border-gray-200 rounded-b-lg shadow-xl z-50 w-full sm:w-80 max-h-96 overflow-hidden">
              {/* Search input */}
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Buscar comuna..."
                  value={comunaSearch}
                  onChange={(e) => setComunaSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontSize: '16px' }} // Prevent zoom on iOS
                />
              </div>

              {/* Region selector */}
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ fontSize: '16px' }} // Prevent zoom on iOS
                >
                  <option value="">Todas las regiones</option>
                  {REGIONES_CHILE.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear selection */}
              <button
                onClick={() => {
                  setSelectedComuna('');
                  setSelectedRegion('');
                  setComunaSearch('');
                  setShowComunas(false);
                }}
                className="w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-50 text-gray-500 border-b border-gray-100 text-sm"
              >
                Todas las comunas
              </button>

              {/* Comunas list */}
              <div className="max-h-60 overflow-y-auto">
                {comunasToShow.length > 0 ? (
                  comunasToShow.map((comuna) => (
                    <button
                      key={comuna}
                      onClick={() => {
                        setSelectedComuna(comuna);
                        setShowComunas(false);
                      }}
                      className="w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-50 text-gray-700 transition-colors text-sm"
                    >
                      {comuna}
                      {selectedRegion && (
                        <span className="text-gray-500 ml-2 text-xs">
                          ({REGIONES_CHILE.find(r => r.id === selectedRegion)?.nombre})
                        </span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-3 sm:px-4 py-3 text-gray-500 text-sm">
                    {comunaSearch.length > 0 ? 'No se encontraron comunas' : 'Escribe para buscar comunas'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex-shrink-0 min-h-[44px] ${
            isLarge ? 'px-6 sm:px-8 py-4 text-base sm:text-lg' : 'px-4 sm:px-6 py-3 text-sm sm:text-base'
          }`}
        >
          <span className="hidden sm:inline">Buscar</span>
          <Search className="w-4 h-4 sm:hidden" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;