import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  CreditCard,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Shield,
  Star,
  Users,
  Lock,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { CATEGORIAS_SERVICIOS, REGIONES_CHILE } from '../utils/constants';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    // Paso 1: Datos personales
    nombre: '',
    rut: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    foto: null as File | null,
    
    // Paso 2: Servicios y ubicación
    servicios: [] as string[],
    descripcion: '',
    regionPrincipal: '',
    comunaPrincipal: '',
    regionesServicio: [] as string[],
    comunasServicio: [] as string[],
    experiencia: '',
    
    // Paso 3: Portfolio
    fotos: [] as File[],
    precios: {} as Record<string, string>,
    
    // Paso 4: Términos
    acceptTerms: false
  });

  const [comunaSearch, setComunaSearch] = useState('');
  const [selectedRegionForService, setSelectedRegionForService] = useState('');

  const totalSteps = 4;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user types
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      servicios: prev.servicios.includes(serviceId)
        ? prev.servicios.filter(s => s !== serviceId)
        : [...prev.servicios, serviceId]
    }));
  };

  const handleRegionServiceToggle = (regionId: string) => {
    setFormData(prev => {
      const newRegiones = prev.regionesServicio.includes(regionId)
        ? prev.regionesServicio.filter(r => r !== regionId)
        : [...prev.regionesServicio, regionId];
      
      // Si se deselecciona una región, quitar sus comunas
      if (!newRegiones.includes(regionId)) {
        const regionComunas = REGIONES_CHILE.find(r => r.id === regionId)?.comunas || [];
        const newComunas = prev.comunasServicio.filter(c => !regionComunas.includes(c));
        return { ...prev, regionesServicio: newRegiones, comunasServicio: newComunas };
      }
      
      return { ...prev, regionesServicio: newRegiones };
    });
  };

  const handleComunaServiceToggle = (comuna: string) => {
    setFormData(prev => ({
      ...prev,
      comunasServicio: prev.comunasServicio.includes(comuna)
        ? prev.comunasServicio.filter(c => c !== comuna)
        : [...prev.comunasServicio, comuna]
    }));
  };

  const handleFileChange = (field: string, files: FileList | null) => {
    if (!files) return;
    
    if (field === 'foto') {
      handleInputChange(field, files[0]);
    } else if (field === 'fotos') {
      const newFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        fotos: [...prev.fotos, ...newFiles].slice(0, 6) // Máximo 6 fotos
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    // This function validates the current step's form data.
    // It ensures that all fields that are NOT NULL in the 'professionals' database table
    // (and don't have a default value) are filled before proceeding.
    // Key NOT NULL fields from schema: nombre, rut, telefono, descripcion,
    // region_principal, comuna_principal, experiencia.
    // Other fields like especialidades, fotos_trabajos, regiones_servicio have NOT NULL
    // constraints but also database defaults if empty arrays are passed, however,
    // client-side logic enforces minimums for these (e.g., at least one service, 3 photos).
    switch (step) {
      case 1:
        if (!formData.nombre || !formData.rut || !formData.email || !formData.password || !formData.telefono) {
          setError('Por favor completa todos los campos obligatorios');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Las contraseñas no coinciden');
          return false;
        }
        if (formData.password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          return false;
        }
        if (!formData.regionPrincipal || !formData.comunaPrincipal) {
          setError('Por favor selecciona tu región y comuna principal');
          return false;
        }
        break;
      case 2:
        if (formData.servicios.length === 0) {
          setError('Selecciona al menos un servicio');
          return false;
        }
        if (!formData.descripcion) {
          setError('Agrega una descripción de tus servicios');
          return false;
        }
        if (!formData.experiencia) {
          setError('Selecciona tus años de experiencia');
          return false;
        }
        if (formData.regionesServicio.length === 0) {
          setError('Selecciona al menos una región donde trabajas');
          return false;
        }
        break;
      case 3:
        if (formData.fotos.length < 3) {
          setError('Sube al menos 3 fotos de trabajos realizados');
          return false;
        }
        break;
      case 4:
        if (!formData.acceptTerms) {
          setError('Debes aceptar los términos y condiciones');
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      setError('');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);
    setError('');

    try {
      console.log('Iniciando registro con datos:', {
        email: formData.email,
        nombre: formData.nombre,
        telefono: formData.telefono
      });

      // Guardar datos del profesional en localStorage antes del registro
      const professionalData = {
        nombre: formData.nombre,
        rut: formData.rut,
        telefono: formData.telefono,
        servicios: formData.servicios,
        descripcion: formData.descripcion,
        regionPrincipal: formData.regionPrincipal,
        comunaPrincipal: formData.comunaPrincipal,
        regionesServicio: formData.regionesServicio,
        comunasServicio: formData.comunasServicio,
        experiencia: formData.experiencia,
        precios: formData.precios,
        fotos: formData.fotos,
        foto: formData.foto
      };

      localStorage.setItem('pendingProfessionalData', JSON.stringify(professionalData));

      // Registrar usuario en Supabase Auth
      const { error: authError } = await signUp(formData.email, formData.password, {
        nombre: formData.nombre,
        telefono: formData.telefono,
        tipo_usuario: 'profesional'
      });

      if (authError) {
        console.error('Error en signUp:', authError);
        
        // Manejar errores específicos
        if (authError.message.includes('User already registered')) {
          setError('Este email ya está registrado. Intenta iniciar sesión.');
        } else if (authError.message.includes('Invalid email')) {
          setError('El formato del email no es válido');
        } else if (authError.message.includes('Password should be at least')) {
          setError('La contraseña debe tener al menos 6 caracteres');
        } else {
          setError(authError.message || 'Error al registrar usuario');
        }
        return;
      }

      console.log('✅ Usuario registrado exitosamente, redirigiendo al dashboard');
      
      // ✅ REDIRIGIR DIRECTAMENTE AL DASHBOARD - SIN VERIFICACIÓN
      navigate('/dashboard');

    } catch (error: any) {
      console.error('Error inesperado en registro:', error);
      setError('Error inesperado. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Obtener comunas de la región principal
  const comunasPrincipales = formData.regionPrincipal 
    ? REGIONES_CHILE.find(r => r.id === formData.regionPrincipal)?.comunas || []
    : [];

  // Filtrar comunas para servicios
  const comunasParaServicios = selectedRegionForService 
    ? REGIONES_CHILE.find(r => r.id === selectedRegionForService)?.comunas.filter(comuna =>
        comuna.toLowerCase().includes(comunaSearch.toLowerCase())
      ) || []
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MaestroDirecto</span>
            </Link>
            
            <div className="text-sm text-gray-600">
              ¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">Iniciar sesión</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Únete como Profesional
            </h1>
            <div className="text-sm text-gray-600">
              Paso {currentStep} de {totalSteps}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Datos Básicos</span>
            <span>Servicios</span>
            <span>Portfolio</span>
            <span>Finalizar</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">{error}</span>
            </div>
            {error.includes('Este email ya está registrado') && (
              <div className="mt-3 pt-3 border-t border-red-200">
                <Link 
                  to="/login" 
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Ir a Iniciar Sesión
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Form Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Step 1: Datos Básicos */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Datos Básicos</h2>
                <p className="text-gray-600">Cuéntanos sobre ti para verificar tu identidad</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Juan Pérez"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RUT *
                  </label>
                  <input
                    type="text"
                    value={formData.rut}
                    onChange={(e) => handleInputChange('rut', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="12.345.678-9"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="juan@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+56 9 1234 5678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Repite tu contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Ubicación Principal */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Tu Ubicación Principal
                </h3>
                <p className="text-gray-600 mb-4">Selecciona la región y comuna donde vives o tienes tu base de operaciones</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Región *
                    </label>
                    <select
                      value={formData.regionPrincipal}
                      onChange={(e) => {
                        handleInputChange('regionPrincipal', e.target.value);
                        handleInputChange('comunaPrincipal', ''); // Reset comuna
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecciona tu región</option>
                      {REGIONES_CHILE.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comuna *
                    </label>
                    <select
                      value={formData.comunaPrincipal}
                      onChange={(e) => handleInputChange('comunaPrincipal', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={!formData.regionPrincipal}
                    >
                      <option value="">
                        {formData.regionPrincipal ? 'Selecciona tu comuna' : 'Primero selecciona una región'}
                      </option>
                      {comunasPrincipales.map((comuna) => (
                        <option key={comuna} value={comuna}>
                          {comuna}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto de Perfil (opcional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Sube una foto profesional</p>
                  <p className="text-sm text-gray-500 mb-4">JPG, PNG hasta 5MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('foto', e.target.files)}
                    className="hidden"
                    id="foto-upload"
                  />
                  <label
                    htmlFor="foto-upload"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Seleccionar Archivo
                  </label>
                  {formData.foto && (
                    <p className="text-green-600 text-sm mt-2">✓ {formData.foto.name}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Servicios y Cobertura */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Servicios y Cobertura</h2>
                <p className="text-gray-600">Selecciona los servicios que ofreces y dónde trabajas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Servicios que ofreces *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {CATEGORIAS_SERVICIOS.map((servicio) => (
                    <label
                      key={servicio.id}
                      className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.servicios.includes(servicio.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.servicios.includes(servicio.id)}
                        onChange={() => handleServiceToggle(servicio.id)}
                        className="sr-only"
                      />
                      <div className="text-2xl mb-2">🔧</div>
                      <span className="text-sm font-medium text-center">{servicio.nombre}</span>
                      {formData.servicios.includes(servicio.id) && (
                        <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-blue-500" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción de tus servicios *
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe tu experiencia, especialidades y qué te diferencia..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Años de experiencia *
                </label>
                <select
                  value={formData.experiencia}
                  onChange={(e) => handleInputChange('experiencia', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona...</option>
                  <option value="1-2">1-2 años</option>
                  <option value="3-5">3-5 años</option>
                  <option value="6-10">6-10 años</option>
                  <option value="11-15">11-15 años</option>
                  <option value="15+">Más de 15 años</option>
                </select>
              </div>

              {/* Cobertura de Servicios */}
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-green-600" />
                  Cobertura de Servicios
                </h3>
                <p className="text-gray-600 mb-6">Selecciona las regiones donde ofreces tus servicios</p>

                {/* Regiones donde trabajas */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Regiones donde trabajas *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto border border-gray-300 rounded-xl p-4">
                    {REGIONES_CHILE.map((region) => (
                      <label key={region.id} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.regionesServicio.includes(region.id)}
                          onChange={() => handleRegionServiceToggle(region.id)}
                          className="mr-3 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <span className="text-sm">{region.nombre}</span>
                      </label>
                    ))}
                  </div>
                  {formData.regionesServicio.length > 0 && (
                    <div className="mt-3 text-sm text-green-600">
                      ✓ {formData.regionesServicio.length} regiones seleccionadas
                    </div>
                  )}
                </div>

                {/* Comunas específicas */}
                {formData.regionesServicio.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Comunas específicas (opcional)
                    </label>
                    <p className="text-sm text-gray-600 mb-4">
                      Si no seleccionas comunas específicas, aparecerás en todas las búsquedas de las regiones seleccionadas
                    </p>
                    
                    {/* Filtros */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Buscar comuna..."
                        value={comunaSearch}
                        onChange={(e) => setComunaSearch(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <select
                        value={selectedRegionForService}
                        onChange={(e) => setSelectedRegionForService(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Filtrar por región</option>
                        {formData.regionesServicio.map((regionId) => {
                          const region = REGIONES_CHILE.find(r => r.id === regionId);
                          return region ? (
                            <option key={region.id} value={region.id}>
                              {region.nombre}
                            </option>
                          ) : null;
                        })}
                      </select>
                    </div>

                    <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-xl p-3">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {comunasParaServicios.map((comuna) => (
                          <label key={comuna} className="flex items-center cursor-pointer text-sm">
                            <input
                              type="checkbox"
                              checked={formData.comunasServicio.includes(comuna)}
                              onChange={() => handleComunaServiceToggle(comuna)}
                              className="mr-2 text-blue-600 focus:ring-blue-500 rounded"
                            />
                            <span>{comuna}</span>
                          </label>
                        ))}
                      </div>
                      
                      {selectedRegionForService && comunasParaServicios.length === 0 && (
                        <div className="text-sm text-gray-500 text-center py-4">
                          No se encontraron comunas
                        </div>
                      )}
                    </div>
                    
                    {formData.comunasServicio.length > 0 && (
                      <div className="mt-3 text-sm text-green-600">
                        ✓ {formData.comunasServicio.length} comunas específicas seleccionadas
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Portfolio */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Portfolio de Trabajos</h2>
                <p className="text-gray-600">Muestra tus mejores trabajos para generar confianza</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Fotos de trabajos realizados * (mínimo 3)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((index) => (
                    <div key={index} className="relative">
                      {formData.fotos[index - 1] ? (
                        <div className="aspect-square border-2 border-green-300 rounded-xl overflow-hidden relative">
                          <img
                            src={URL.createObjectURL(formData.fotos[index - 1])}
                            alt={`Trabajo ${index}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => {
                              const newFotos = [...formData.fotos];
                              newFotos.splice(index - 1, 1);
                              setFormData(prev => ({ ...prev, fotos: newFotos }));
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-blue-400 transition-colors cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange('fotos', e.target.files)}
                            className="hidden"
                            id={`foto-trabajo-${index}`}
                          />
                          <label
                            htmlFor={`foto-trabajo-${index}`}
                            className="cursor-pointer flex flex-col items-center"
                          >
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Foto {index}</span>
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Sube fotos de alta calidad que muestren tu trabajo. Máximo 5MB por foto.
                </p>
                {formData.fotos.length > 0 && (
                  <p className="text-green-600 text-sm mt-2">
                    ✓ {formData.fotos.length} fotos subidas
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Precios referenciales (opcional)
                </label>
                <div className="space-y-4">
                  {formData.servicios.map((servicioId) => {
                    const servicio = CATEGORIAS_SERVICIOS.find(s => s.id === servicioId);
                    return (
                      <div key={servicioId} className="flex items-center space-x-4">
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700">
                            {servicio?.nombre}
                          </span>
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Ej: $20.000 - $50.000"
                            value={formData.precios[servicioId] || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              precios: { ...prev.precios, [servicioId]: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Finalizar */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Finalizar Registro</h2>
                <p className="text-gray-600">Revisa tu información y acepta los términos</p>
              </div>

              {/* Resumen */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de tu perfil</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Nombre:</span>
                    <span className="ml-2 text-gray-900">{formData.nombre}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-900">{formData.email}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Servicios:</span>
                    <span className="ml-2 text-gray-900">{formData.servicios.length} seleccionados</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Regiones:</span>
                    <span className="ml-2 text-gray-900">{formData.regionesServicio.length} seleccionadas</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Fotos:</span>
                    <span className="ml-2 text-gray-900">{formData.fotos.length} subidas</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Experiencia:</span>
                    <span className="ml-2 text-gray-900">{formData.experiencia} años</span>
                  </div>
                </div>
              </div>

              {/* Plan */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium mb-4">
                    <Star className="w-4 h-4 mr-2" />
                    Plan Profesional
                  </div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    $5.990
                    <span className="text-lg text-gray-600 font-normal">/mes</span>
                  </div>
                  <p className="text-gray-600">Sin comisiones por trabajo</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center">
                    <div className="text-yellow-600 mr-3">🎉</div>
                    <div>
                      <p className="font-semibold text-yellow-800">¡Primer mes GRATIS!</p>
                      <p className="text-sm text-yellow-700">Para nuevos registros</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="bg-gray-50 rounded-xl p-6">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                    className="mt-1 mr-3 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <div className="text-sm text-gray-700">
                    Acepto los{' '}
                    <Link to="/terminos" className="text-blue-600 hover:text-blue-700 font-medium">
                      términos y condiciones
                    </Link>{' '}
                    y la{' '}
                    <Link to="/privacidad" className="text-blue-600 hover:text-blue-700 font-medium">
                      política de privacidad
                    </Link>
                    . Entiendo que podré acceder inmediatamente al dashboard después del registro.
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-colors ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registrando...
                  </>
                ) : (
                  <>
                    Completar Registro
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 bg-white rounded-3xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            ¿Por qué elegir MaestroDirecto?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cobertura Nacional</h4>
              <p className="text-gray-600 text-sm">
                Accede a clientes en todas las regiones de Chile, desde Arica a Punta Arenas
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Sin Comisiones</h4>
              <p className="text-gray-600 text-sm">
                Solo pagas una suscripción mensual fija. Todo lo que ganes es tuyo
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Reputación</h4>
              <p className="text-gray-600 text-sm">
                Construye tu reputación con reseñas reales de clientes satisfechos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;