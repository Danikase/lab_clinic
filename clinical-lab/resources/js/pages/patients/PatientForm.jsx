import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import Sidebar from '../../components/layout/Sidebar';
import { successAlert, errorAlert, showLoading, hideLoading } from '../../utils/alerts';

export default function PatientForm({ user, setUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    dui: '',
    birth_date: '',
    gender: 'O',
    phone: '',
    email: '',
    address: '',
    is_active: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchPatient();
    }
  }, [id]);

  const fetchPatient = async () => {
    try {
      const { data } = await api.get(`/patients/${id}`);
      const p = data.data || data;
      setFormData({
        first_name: p.first_name || '',
        last_name: p.last_name || '',
        dui: p.dui || '',
        birth_date: p.birth_date ? p.birth_date.split('T')[0] : '',
        gender: p.gender || 'O',
        phone: p.phone || '',
        email: p.email || '',
        address: p.address || '',
        is_active: p.is_active ?? true,
      });
    } catch (error) {
      await errorAlert('❌ Error', 'No se pudo cargar la información del paciente');
      navigate('/patients');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    showLoading(isEdit ? 'Actualizando paciente...' : 'Guardando paciente...');

    try {
      if (isEdit) {
        await api.put(`/patients/${id}`, formData);
        hideLoading();
        await successAlert('✅ Actualizado', 'El paciente ha sido actualizado correctamente');
        navigate('/patients');
      } else {
        await api.post('/patients', formData);
        hideLoading();
        await successAlert('✅ Registrado', 'El paciente ha sido registrado correctamente');
        navigate('/patients');
      }
    } catch (error) {
      hideLoading();
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        console.error('❌ Errores de validación:', validationErrors);
        setErrors(validationErrors);
        
        // Mostrar el primer error en SweetAlert
        const firstError = Object.values(validationErrors)[0]?.[0];
        await errorAlert('⚠️ Datos inválidos', firstError || 'Verifica los campos ingresados');
      } else {
        await errorAlert('❌ Error', 'No se pudo guardar el paciente. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} setUser={setUser} />
      
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/patients')} 
            className="text-blue-600 hover:text-blue-700 flex items-center font-medium mb-2 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a Pacientes
          </button>
          <h2 className="text-2xl font-bold text-blue-900">
            {isEdit ? 'Editar Paciente' : 'Nuevo Paciente'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isEdit ? 'Actualiza la información del paciente' : 'Crea un nuevo paciente en el sistema'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          {/* Información Personal */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input 
                  type="text" 
                  name="first_name" 
                  value={formData.first_name} 
                  onChange={handleChange} 
                  required 
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.first_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`} 
                />
                {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                <input 
                  type="text" 
                  name="last_name" 
                  value={formData.last_name} 
                  onChange={handleChange} 
                  required 
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.last_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`} 
                />
                {errors.last_name && <p className="mt-1 text-xs text-red-500">{errors.last_name[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DUI *</label>
                <input 
                  type="text" 
                  name="dui" 
                  value={formData.dui} 
                  onChange={handleChange} 
                  required 
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.dui ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`} 
                  placeholder="00000000-0" 
                />
                {errors.dui && <p className="mt-1 text-xs text-red-500">{errors.dui[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                <input 
                  type="date" 
                  name="birth_date" 
                  value={formData.birth_date} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange} 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                >
                  <option value="">Seleccione...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              Información de Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
                  placeholder="1234-5678" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`} 
                  placeholder="correo@ejemplo.com" 
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email[0]}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <textarea 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  rows="3" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
                  placeholder="Dirección completa..." 
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              onClick={() => navigate('/patients')} 
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-sm hover:shadow-blue-500/20"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Guardar')} Paciente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}