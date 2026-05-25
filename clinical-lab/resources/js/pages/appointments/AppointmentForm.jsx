import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import Sidebar from '../../components/layout/Sidebar';
import { successAlert, errorAlert, showLoading, hideLoading } from '../../utils/alerts';

export default function AppointmentForm({ user, setUser }) {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    patient_id: '',
    type: 'toma_muestra',
    appointment_date: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data } = await api.get('/patients', { params: { per_page: 100 } });
      setPatients(data.data || data);
    } catch (error) {
      console.error(error);
      errorAlert('❌ Error', 'No se pudieron cargar los pacientes');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    showLoading('Agendando cita...');

    try {
      await api.post('/appointments', formData);
      hideLoading();
      await successAlert('✅ Cita agendada', 'La cita se ha programado correctamente');
      navigate('/appointments');
    } catch (error) {
      hideLoading();
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        setErrors(validationErrors);
        const firstError = Object.values(validationErrors)[0]?.[0];
        await errorAlert('⚠️ Datos inválidos', firstError || 'Verifica los campos ingresados');
      } else {
        await errorAlert('❌ Error', 'No se pudo agendar la cita. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} setUser={setUser} />
      
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/appointments')} 
            className="text-gray-600 hover:text-gray-900 flex items-center font-medium mb-2"
          >
            ← Volver a Citas
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Nueva Cita</h2>
          <p className="text-sm text-gray-500 mt-1">Agenda una nueva cita en el laboratorio</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-3xl">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Información de la Cita</h3>
            
            <div className="space-y-5">
              {/* ✅ PACIENTE - Con name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paciente *</label>
                <select
                  name="patient_id"  // ✅ IMPORTANTE
                  required
                  value={formData.patient_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none ${errors.patient_id ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                >
                  <option value="">Seleccionar paciente...</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.first_name} {p.last_name} - {p.dui}
                    </option>
                  ))}
                </select>
                {errors.patient_id && <p className="mt-1 text-xs text-red-500">{errors.patient_id[0]}</p>}
              </div>

              {/* ✅ TIPO - Con name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Cita *</label>
                <select
                  name="type"  // ✅ IMPORTANTE
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="toma_muestra">🧪 Toma de muestra</option>
                  <option value="entrega_resultados">📄 Entrega de resultados</option>
                  <option value="consulta">🩺 Consulta</option>
                </select>
              </div>

              {/* ✅ FECHA - Con name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora *</label>
                <input
                  type="datetime-local"
                  name="appointment_date"  // ✅ IMPORTANTE
                  required
                  value={formData.appointment_date}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none ${errors.appointment_date ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                />
                {errors.appointment_date && <p className="mt-1 text-xs text-red-500">{errors.appointment_date[0]}</p>}
              </div>

              {/* ✅ NOTAS - Con name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea
                  name="notes"  // ✅ IMPORTANTE
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Observaciones adicionales..."
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/appointments')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-black rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading && (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? 'Agendando...' : 'Agendar Cita'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}