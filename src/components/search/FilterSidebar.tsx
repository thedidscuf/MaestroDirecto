import React, { useState } from 'react';
import { Star, MapPin, Clock, Shield, DollarSign, X } from 'lucide-react';
import { REGIONES_CHILE, TODAS_LAS_COMUNAS, CATEGORIAS_SERVICIOS } from '../../utils/constants';

interface FilterState {
  rating: number;
  comunas: string[];
  region: string;
  categories: string[];
  priceRange: [number, number];
  availability: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const [comunaSearch, setComunaSearch] = useState('');

  const handleRatingChange = (rating: number) => {
    onFiltersChange({ rating: filters.rating === rating ? 0 : rating });
  };

  const handleComunaToggle = (comuna: string) => {
    const newComunas = filters.comunas.includes(comuna)
      ? filters.comunas.filter(c => c !== comuna)
      : [...filters.comunas, comuna];
    onFiltersChange({ comunas: newComunas });
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(c => c !== categoryId)
      : [...filters.categories, categoryId];
    onFiltersChange({ categories: newCategories });
  };

  const handleAvailabilityChange = (availability: string) => {
    onFiltersChange({ 
      availability: filters.availability === availability ? '' : availability 
    });
  };

  const handlePriceRangeChange = (index: number, value: number) => {
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = value;
    onFiltersChange({ priceRange: newRange });
  };

  // Filtrar comunas por búsqueda y región
  const filteredComunas = filters.region 
    ? REGIONES_CHILE.find(r => r.id === filters.region)?.comunas.filter(comuna =>
        comuna.toLowerCase().includes(comunaSearch.toLowerCase())
      ) || []
    : TODAS_LAS_COMUNAS.filter(comuna =>
        comuna.toLowerCase().includes(comunaSearch.toLowerCase())
      ).slice(0, 20);

  const hasActiveFilters = filters.rating > 0 || 
                          filters.comunas.length > 0 || 
                          filters.categories.length > 0 ||
                          filters.availability !== '' ||
                          filters.priceRange[0] > 0 ||
                          filters.priceRange[1] < 100000;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Filtros</h3>
        {hasActiveFilters && (
          <button 
            onClick={onClearFilters}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
          >
            <X className="w-4 h-4 mr-1" />
            Limpiar todo
          </button>
        )}
      </div>

      {/* Rating Filter */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Star className="w-4 h-4 mr-2 text-yellow-500" />
          Calificación mínima
        </h4>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === rating}
                onChange={() => handleRatingChange(rating)}
                className="mr-3 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">y más</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="w-4 h-4 mr-2 text-green-500" />
          Disponibilidad
        </h4>
        <div className="space-y-3">
          {[
            { value: 'today', label: 'Disponible hoy' },
            { value: 'week', label: 'Esta semana' },
            { value: 'month', label: 'Este mes' },
            { value: 'flexible', label: 'Flexible' }
          ].map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="availability"
                checked={filters.availability === option.value}
                onChange={() => handleAvailabilityChange(option.value)}
                className="mr-3 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories Filter */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="w-4 h-4 mr-2 text-blue-500" />
          Especialidades
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {CATEGORIAS_SERVICIOS.map((category) => (
            <label key={category.id} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(category.id)}
                onChange={() => handleCategoryToggle(category.id)}
                className="mr-3 text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="text-sm text-gray-700">{category.nombre}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-red-500" />
          Ubicación
        </h4>
        
        {/* Region selector */}
        <div className="mb-4">
          <select
            value={filters.region}
            onChange={(e) => onFiltersChange({ region: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las regiones</option>
            {REGIONES_CHILE.map((region) => (
              <option key={region.id} value={region.id}>
                {region.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Comuna search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar comuna..."
            value={comunaSearch}
            onChange={(e) => setComunaSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Comunas list */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filteredComunas.map((comuna) => (
            <label key={comuna} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.comunas.includes(comuna)}
                onChange={() => handleComunaToggle(comuna)}
                className="mr-3 text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="text-sm text-gray-700">{comuna}</span>
            </label>
          ))}
          
          {filteredComunas.length === 0 && (
            <div className="text-sm text-gray-500 py-2">
              No se encontraron comunas
            </div>
          )}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <DollarSign className="w-4 h-4 mr-2 text-green-500" />
          Rango de precios
        </h4>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="number"
              placeholder="Mín"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceRangeChange(0, parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="Máx"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceRangeChange(1, parseInt(e.target.value) || 100000)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-xs text-gray-500">
            Precios en CLP (pesos chilenos)
          </div>
        </div>
      </div>

      {/* Apply Filters Button */}
      <button 
        onClick={() => {
          // Los filtros se aplican automáticamente, este botón es solo visual
          console.log('Filtros aplicados:', filters);
        }}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        Aplicar Filtros
      </button>
    </div>
  );
};

export default FilterSidebar;