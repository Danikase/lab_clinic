import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import Sidebar from '../../components/layout/Sidebar';
import { successAlert, errorAlert, confirmAlert, showLoading, hideLoading } from '../../utils/alerts';
import LoadingSpinner from '../../components/layout/LoadingSpinner'; 

export default function AppointmentList({ user, setUser }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ date: '', status: '' });

  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      const { data } = await api.get('/appointments', { params });
      setAppointments(data);
    } catch (error) {
      console.error('Error al cargar citas:', error);
      errorAlert('❌ Error', 'No se pudieron cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointment, newStatus) => {
    showLoading('Actualizando estado...');
    try {
      await api.post(`/appointments/${appointment.id}/status`, { status: newStatus });
      hideLoading();
      await successAlert('✅ Actualizado', `Cita marcada como ${newStatus === 'completed' ? 'completada' : 'cancelada'}`);
      fetchAppointments();
    } catch (error) {
      hideLoading();
      errorAlert('❌ Error', 'No se pudo actualizar el estado');
    }
  };

  const deleteAppointment = async (id) => {
    const result = await confirmAlert(
      '¿Eliminar cita?', 
      '¿Estás seguro de eliminar esta cita? Esta acción no se puede deshacer.',
      'Sí, eliminar'
    );
    if (!result.isConfirmed) return;

    showLoading('Eliminando...');
    try {
      await api.delete(`/appointments/${id}`);
      hideLoading();
      await successAlert('✅ Eliminada', 'La cita ha sido eliminada correctamente');
      fetchAppointments();
    } catch (error) {
      hideLoading();
      errorAlert('❌ Error', 'No se pudo eliminar la cita');
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      scheduled: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', label: '📅 Programada' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', label: '✅ Completada' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', label: '❌ Cancelada' },
      no_show: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', label: '⚠️ No asistió' },
    };
    const style = map[status] || map.scheduled;
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${style.bg} ${style.text} ${style.border}`}>
        {style.label}
      </span>
    );
  };

  const getTypeLabel = (type) => {
    const map = {
      toma_muestra: '🧪 Toma de muestra',
      entrega_resultados: '📄 Entrega de resultados',
      consulta: '🩺 Consulta',
    };
    return map[type] || type;
  };

  const clearFilters = () => {
    setFilters({ date: '', status: '' });
    fetchAppointments();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} setUser={setUser} />

      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-blue-900">Agenda de Citas</h2>
            <p className="text-sm text-gray-500 mt-1">Gestiona las citas y turnos del laboratorio</p>
          </div>
          <Link
            to="/appointments/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-md transition-colors w-fit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Cita
          </Link>
        </header>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-200 mb-6 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-50">
            <label className="block text-xs font-medium text-gray-600 mb-1">📅 Filtrar por fecha</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>
          <div className="flex-1 min-w-50">
            <label className="block text-xs font-medium text-gray-600 mb-1">🔍 Filtrar por estado</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
              <option value="">Todos los estados</option>
              <option value="scheduled">📅 Programadas</option>
              <option value="completed">✅ Completadas</option>
              <option value="cancelled">❌ Canceladas</option>
              <option value="no_show">⚠️ No asistió</option>
            </select>
          </div>
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            🗑️ Limpiar
          </button>
        </div>

        {/* Tabla de Citas */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-blue-50 text-blue-900 text-sm uppercase tracking-wider border-b border-blue-100">
                <tr>
                  <th className="px-6 py-3 font-bold">Fecha y Hora</th>
                  <th className="px-6 py-3 font-bold">Paciente</th>
                  <th className="px-6 py-3 font-bold">Tipo de Cita</th>
                  <th className="px-6 py-3 font-bold">Estado</th>
                  <th className="px-6 py-3 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12">
                      <LoadingSpinner message="Cargando citas..." />
                    </td>
                  </tr>
                ) : appointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No hay citas registradas con los filtros seleccionados
                    </td>
                  </tr>
                ) : (
                  appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {new Date(apt.appointment_date).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-blue-900">
                        {apt.patient?.first_name} {apt.patient?.last_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {getTypeLabel(apt.type)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(apt.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {apt.status === 'scheduled' && (
                            <>
                              {/* Completar - VERDE */}
                              <button
                                onClick={() => updateStatus(apt, 'completed')}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                title="Marcar como completada"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                              {/* Cancelar - ROJO */}
                              <button
                                onClick={() => updateStatus(apt, 'cancelled')}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                title="Cancelar cita"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </>
                          )}
                          {/* Eliminar - GRIS */}
                          <button
                            onClick={() => deleteAppointment(apt.id)}
                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                            title="Eliminar cita"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info adicional */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <strong>Consejo:</strong> Las citas programadas aparecen en azul. Marca como ✅ completada cuando el paciente haya sido atendido.
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}