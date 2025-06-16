import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">MaestroDirecto</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Conectamos a clientes chilenos con maestros y técnicos locales de confianza. 
              Sin comisiones, sin intermediarios, solo profesionales verificados.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/buscar" className="text-gray-300 hover:text-white transition-colors">
                  Buscar Profesionales
                </Link>
              </li>
              <li>
                <Link to="/como-funciona" className="text-gray-300 hover:text-white transition-colors">
                  Cómo Funciona
                </Link>
              </li>
              <li>
                <Link to="/para-profesionales" className="text-gray-300 hover:text-white transition-colors">
                  Para Profesionales
                </Link>
              </li>
              <li>
                <Link to="/testimonios" className="text-gray-300 hover:text-white transition-colors">
                  Testimonios
                </Link>
              </li>
              <li>
                <Link to="/ayuda" className="text-gray-300 hover:text-white transition-colors">
                  Centro de Ayuda
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">info@maestrodirecto.cl</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">+56 2 2345 6789</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">Santiago, Chile</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 MaestroDirecto. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacidad" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacidad
            </Link>
            <Link to="/terminos" className="text-gray-400 hover:text-white text-sm transition-colors">
              Términos
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;