import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, MapPin, Star, Grid, List, SlidersHorizontal } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import ProfessionalCard from '../components/professional/ProfessionalCard';
import FilterSidebar from '../components/search/FilterSidebar';
import { PROFESIONALES_DESTACADOS, CATEGORIAS_SERVICIOS } from '../utils/constants';

interface FilterState {
  rating: number;
  comunas: string[];
  region: string;
  categories: string[];
  priceRange: [number, number];
  availability: string;
}

const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [filteredProfessionals, setFilteredProfessionals] = useState(PROFESIONALES_DESTACADOS);
  const [filters, setFilters] = useState<FilterState>({
    rating: 0,
    comunas: [],
    region: '',
    categories: [],
    priceRange: [0, 100000],
    availability: ''
  });

  const query = searchParams.get('q') || '';
  const categoria = searchParams.get('categoria') || '';
  const comuna = searchParams.get('comuna') || '';

  // Función para aplicar filtros
  const applyFilters = (professionals: typeof PROFESIONALES_DESTACADOS) => {
    let filtered = [...professionals];

    // Filtro por categoría desde URL
    if (categoria) {
      const categoriaObj = CATEGORIAS_SERVICIOS.find(c => c.id === categoria);
      if (categoriaObj) {
        filtered = filtered.filter(p => 
          p.especialidad.toLowerCase().includes(categoriaObj.nombre.toLowerCase())
        );
      }
    }

    // Filtro por query de búsqueda
    if (query) {
      filtered = filtered.filter(p => 
        p.especialidad.toLowerCase().includes(query.toLowerCase()) ||
        p.nombre.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filtro por comuna desde URL
    if (comuna) {
      filtered = filtered.filter(p => 
        p.comuna.toLowerCase().includes(comuna.toLowerCase())
      );
    }

    // Filtros del sidebar
    if (filters.rating > 0) {
      filtered = filtered.filter(p => p.rating >= filters.rating);
    }

    if (filters.comunas.length > 0) {
      filtered = filtered.filter(p => 
        filters.comunas.some(c => p.comuna.toLowerCase().includes(c.toLowerCase()))
      );
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => 
        filters.categories.some(cat => 
          p.especialidad.toLowerCase().includes(cat.toLowerCase())
        )
      );
    }

    return filtered;
  };

  // Función para ordenar resultados
  const sortProfessionals = (professionals: typeof PROFESIONALES_DESTACADOS) => {
    const sorted = [...professionals];
    
    switch (sortBy) {
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'reviews':
        return sorted.sort((a, b) => b.totalReviews - a.totalReviews);
      case 'recent':
        return sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
      case 'relevance':
      default:
        // Ordenar por relevancia (rating + reviews)
        return sorted.sort((a, b) => {
          const scoreA = a.rating * 0.7 + (a.totalReviews / 100) * 0.3;
          const scoreB = b.rating * 0.7 + (b.totalReviews / 100) * 0.3;
          return scoreB - scoreA;
        });
    }
  };

  // Efecto para aplicar filtros cuando cambien los parámetros
  useEffect(() => {
    const filtered = applyFilters(PROFESIONALES_DESTACADOS);
    const sorted = sortProfessionals(filtered);
    setFilteredProfessionals(sorted);
  }, [query, categoria, comuna, filters, sortBy]);

  const handleSearch = (newQuery: string, newComuna: string) => {
    const params = new URLSearchParams();
    if (newQuery) params.set('q', newQuery);
    if (newComuna) params.set('comuna', newComuna);
    setSearchParams(params);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  const handleFiltersChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearAllFilters = () => {
    setFilters({
      rating: 0,
      comunas: [],
      region: '',
      categories: [],
      priceRange: [0, 100000],
      availability: ''
    });
    setSortBy('relevance');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchBar onSearch={handleSearch} className="mb-4" />
          
          {/* Results Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {categoria ? 
                  `${CATEGORIAS_SERVICIOS.find(c => c.id === categoria)?.nombre || 'Profesionales'}` :
                  query ? `Resultados para "${query}"` : 'Todos los Profesionales'
                }
              </h1>
              <p className="text-gray-600">
                {filteredProfessionals.length} profesionales encontrados
                {comuna && ` en ${comuna}`}
              </p>
            </div>

            {/* View Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Ordenar por:</label>
                <select 
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="relevance">Relevancia</option>
                  <option value="rating">Mejor valorados</option>
                  <option value="reviews">Más reseñas</option>
                  <option value="recent">Más recientes</option>
                </select>
              </div>

              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'text-gray-700'}`}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filtros
                {(filters.rating > 0 || filters.comunas.length > 0 || filters.categories.length > 0) && (
                  <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {[
                      filters.rating > 0 ? 1 : 0,
                      filters.comunas.length > 0 ? 1 : 0,
                      filters.categories.length > 0 ? 1 : 0
                    ].reduce((a, b) => a + b, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.rating > 0 || filters.comunas.length > 0 || filters.categories.length > 0 || sortBy !== 'relevance') && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">Filtros activos:</span>
              
              {filters.rating > 0 && (
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Rating ≥ {filters.rating}
                  <button 
                    onClick={() => handleFiltersChange({ rating: 0 })}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}

              {filters.comunas.map(comuna => (
                <span key={comuna} className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {comuna}
                  <button 
                    onClick={() => handleFiltersChange({ 
                      comunas: filters.comunas.filter(c => c !== comuna) 
                    })}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}

              {filters.categories.map(category => (
                <span key={category} className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {CATEGORIAS_SERVICIOS.find(c => c.id === category)?.nombre || category}
                  <button 
                    onClick={() => handleFiltersChange({ 
                      categories: filters.categories.filter(c => c !== category) 
                    })}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              ))}

              {sortBy !== 'relevance' && (
                <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                  Ordenado por: {
                    sortBy === 'rating' ? 'Rating' :
                    sortBy === 'reviews' ? 'Reseñas' :
                    sortBy === 'recent' ? 'Recientes' : 'Relevancia'
                  }
                  <button 
                    onClick={() => setSortBy('relevance')}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </span>
              )}

              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Limpiar todos
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <FilterSidebar 
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={clearAllFilters}
              />
            </div>
          )}

          {/* Results Grid */}
          <div className="flex-1">
            {filteredProfessionals.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No encontramos profesionales
                </h3>
                <p className="text-gray-600 mb-6">
                  Intenta ajustar tus filtros o buscar en una comuna diferente
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                  <Link
                    to="/"
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Volver al inicio
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredProfessionals.map((professional) => (
                    <ProfessionalCard 
                      key={professional.id} 
                      professional={professional}
                      className={viewMode === 'list' ? 'md:flex md:items-center' : ''}
                    />
                  ))}
                </div>

                {/* Load More */}
                {filteredProfessionals.length >= 9 && (
                  <div className="text-center mt-12">
                    <button className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                      Cargar más profesionales
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;