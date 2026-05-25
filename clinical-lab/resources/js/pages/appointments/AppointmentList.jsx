import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import Sidebar from '../../components/layout/Sidebar';
import { successAlert, errorAlert, confirmAlert, showLoading, hideLoading } from '../../utils/alerts';

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
      scheduled: { bg: 'bg-blue-100', text: 'text-blue-800', label: '📅 Programada' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: '✅ Completada' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: '❌ Cancelada' },
      no_show: { bg: 'bg-gray-100', text: 'text-gray-800', label: '⚠️ No asistió' },
    };
    const style = map[status] || map.scheduled;
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}>
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
            <h2 className="text-2xl font-bold text-gray-900">Agenda de Citas</h2>
            <p className="text-sm text-gray-500 mt-1">Gestiona las citas y turnos del laboratorio</p>
          </div>
          <Link
            to="/appointments/new"
            className="bg-primary-600 hover:bg-primary-700 text-black px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-md transition-colors w-fit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Cita
          </Link>
        </header>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-50">
            <label className="block text-xs font-medium text-gray-600 mb-1">📅 Filtrar por fecha</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div className="flex-1 min-w-50">
            <label className="block text-xs font-medium text-gray-600 mb-1">🔍 Filtrar por estado</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
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
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-700 text-sm uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-bold">Fecha y Hora</th>
                  <th className="px-6 py-3 font-bold">Paciente</th>
                  <th className="px-6 py-3 font-bold">Tipo de Cita</th>
                  <th className="px-6 py-3 font-bold">Estado</th>
                  <th className="px-6 py-3 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      ⏳ Cargando citas...
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
                    <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {new Date(apt.appointment_date).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
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
                              <button
                                onClick={() => updateStatus(apt, 'completed')}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                title="Marcar como completada"
                              >
                                ✅
                              </button>
                              <button
                                onClick={() => updateStatus(apt, 'cancelled')}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                title="Cancelar cita"
                              >
                                ❌
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteAppointment(apt.id)}
                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                            title="Eliminar cita"
                          >
                            🗑️
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
      </div>
    </div>
  );
}