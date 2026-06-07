import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import Sidebar from '../../components/layout/Sidebar';
import LoadingSpinner from '../../components/layout/LoadingSpinner';

export default function OrderList({ user, setUser }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  
  // ✅ Estados para búsqueda y filtros
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    exam_id: '',
    date_from: '',
    date_to: '',
  });
  const [exams, setExams] = useState([]);

  useEffect(() => {
    fetchExams();
    fetchOrders();
  }, []);

  // Cargar exámenes para el filtro
  const fetchExams = async () => {
    try {
      const { data } = await api.get('/exams');
      setExams(data.data || data);
    } catch (error) {
      console.error('Error al cargar exámenes:', error);
    }
  };

  // Cargar órdenes con filtros
  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const params = { 
        page, 
        ...filters 
      };
      
      // Eliminar parámetros vacíos
      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });

      const { data } = await api.get('/lab-orders', { params });
      setOrders(data.data || data);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
        per_page: data.per_page,
      });
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Manejar cambios en filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Aplicar filtros (con debounce implícito)
  const applyFilters = () => {
    fetchOrders(1);
  };

  // ✅ Limpiar filtros
  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      exam_id: '',
      date_from: '',
      date_to: '',
    });
    fetchOrders(1);
  };

  // ✅ Exportar a CSV (bonus)
  const exportToCSV = () => {
    const headers = ['ID', 'Paciente', 'DUI', 'Examen', 'Estado', 'Fecha'];
    const rows = orders.map(order => [
      order.id,
      `${order.patient?.first_name} ${order.patient?.last_name}`,
      order.patient?.dui || '',
      order.exam?.name || '',
      order.status,
      new Date(order.created_at).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ordenes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} setUser={setUser} />

      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b border-blue-100 px-8 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-blue-900">Resultados de Laboratorio</h2>
              <p className="text-sm text-gray-500">Historial de exámenes y resultados</p>
            </div>
            <Link
              to="/results/new"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-md font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Nueva Orden</span>
            </Link>
          </div>

          {/* ✅ Panel de Búsqueda y Filtros */}
          <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Búsqueda por texto */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">🔍 Buscar</label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                  placeholder="Paciente o DUI..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                />
              </div>

              {/* Filtro por estado */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Estado</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                >
                  <option value="">Todos</option>
                  <option value="in_progress">📝 Borrador</option>
                  <option value="completed">✅ Completado</option>
                </select>
              </div>

              {/* Filtro por examen */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Examen</label>
                <select
                  name="exam_id"
                  value={filters.exam_id}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                >
                  <option value="">Todos</option>
                  {exams.map(exam => (
                    <option key={exam.id} value={exam.id}>{exam.name}</option>
                  ))}
                </select>
              </div>

              {/* Fecha desde */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Desde</label>
                <input
                  type="date"
                  name="date_from"
                  value={filters.date_from}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                />
              </div>

              {/* Fecha hasta */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Hasta</label>
                <input
                  type="date"
                  name="date_to"
                  value={filters.date_to}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                🗑️ Limpiar
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                🔍 Filtrar
              </button>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 font-medium transition-colors"
              >
                📄 Exportar CSV
              </button>
            </div>
          </div>
        </header>

        <main className="p-8">
          {/* Resumen de resultados */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Mostrando <span className="font-bold text-blue-900">{pagination.total}</span> órdenes
            </p>
            {Object.values(filters).some(v => v !== '') && (
              <span className="text-xs text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                🏷️ Filtros activos
              </span>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-blue-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50 text-blue-900 text-sm uppercase tracking-wider border-b border-blue-100">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">ID</th>
                    <th className="px-6 py-4 text-left font-bold">Paciente</th>
                    <th className="px-6 py-4 text-left font-bold">Examen</th>
                    <th className="px-6 py-4 text-left font-bold">Estado</th>
                    <th className="px-6 py-4 text-left font-bold">Fecha</th>
                    <th className="px-6 py-4 text-right font-bold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12">
                        <LoadingSpinner message="Cargando órdenes..." />
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                        No se encontraron órdenes con los filtros seleccionados
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-mono font-medium text-blue-900">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-blue-900">
                            {order.patient?.first_name} {order.patient?.last_name}
                          </div>
                          <div className="text-xs text-gray-500">{order.patient?.dui}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {order.exam?.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                            order.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-gray-100 text-gray-800 border-gray-200'
                          }`}>
                            {order.status === 'completed' ? '✅ Completado' : 
                             order.status === 'in_progress' ? '📝 Borrador' : 
                             '⏸️ Pendiente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {order.status === 'completed' ? (
                            <Link
                              to={`/orders/${order.id}/results`}
                              className="inline-flex items-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium text-sm hover:underline px-2 py-1 rounded transition-colors"
                            >
                              👁️ Ver Resultados
                            </Link>
                          ) : (
                            <Link
                              to={`/results/continue/${order.id}`}
                              className="inline-flex items-center text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 font-medium text-sm hover:underline px-2 py-1 rounded transition-colors"
                            >
                              ✏️ Continuar
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {pagination.last_page > 1 && (
              <div className="px-6 py-4 border-t border-blue-200 flex items-center justify-between bg-blue-50/30">
                <div className="text-sm text-gray-600">
                  Página <span className="font-bold text-blue-900">{pagination.current_page}</span> de {pagination.last_page}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => fetchOrders(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="px-3 py-1 border border-blue-200 rounded-lg text-sm font-medium bg-white text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => fetchOrders(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                    className="px-3 py-1 border border-blue-200 rounded-lg text-sm font-medium bg-white text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}