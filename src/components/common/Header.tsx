import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, User, Settings, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900">MaestroDirecto</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/buscar" className="text-gray-700 hover:text-blue-800 transition-colors">
              Buscar Profesionales
            </Link>
            <Link to="/como-funciona" className="text-gray-700 hover:text-blue-800 transition-colors">
              Cómo Funciona
            </Link>
            <Link to="/para-profesionales" className="text-gray-700 hover:text-blue-800 transition-colors">
              Para Profesionales
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Icon - Mobile */}
            <Link to="/buscar" className="md:hidden p-2 text-gray-400 hover:text-gray-500">
              <Search className="w-5 h-5" />
            </Link>

            {/* CTA Buttons */}
            <Link 
              to="/registro-profesional" 
              className="hidden sm:inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <span className="hidden lg:inline">Únete como Profesional</span>
              <span className="lg:hidden">Únete</span>
            </Link>

            <Link 
              to="/login" 
              className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <User className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Iniciar Sesión</span>
              <span className="sm:hidden">Login</span>
            </Link>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-500"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/buscar" 
                className="text-gray-700 hover:text-blue-800 transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Buscar Profesionales
              </Link>
              <Link 
                to="/como-funciona" 
                className="text-gray-700 hover:text-blue-800 transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cómo Funciona
              </Link>
              <Link 
                to="/para-profesionales" 
                className="text-gray-700 hover:text-blue-800 transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Para Profesionales
              </Link>
              <Link 
                to="/registro-profesional" 
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Únete como Profesional
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;