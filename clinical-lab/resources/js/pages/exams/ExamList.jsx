import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import Sidebar from '../../components/layout/Sidebar';
import { successAlert, errorAlert, confirmAlert } from '../../utils/alerts';

export default function ExamList({ user, setUser }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({ search: '', is_active: '' });

  useEffect(() => {
    fetchExams();
  }, [pagination.current_page, filters]);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current_page,
        per_page: pagination.per_page,
        ...filters,
      };
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      
      const { data } = await api.get('/exams', { params });
      setExams(data.data);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        per_page: data.per_page,
        total: data.total,
      });
    } catch (error) {
      console.error('Error al cargar exámenes:', error);
      errorAlert('❌ Error', 'No se pudieron cargar los exámenes');
    } finally {
      setLoading(false);
    }
  };

  // Generar números de página
  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.last_page;
    const currentPage = pagination.current_page;
    
    if (totalPages <= 7) {
      // Si hay 7 o menos páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas con ellipsis
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      setPagination(prev => ({ ...prev, current_page: page }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleStatus = async (exam) => {
    try {
      await api.put(`/exams/${exam.id}/toggle-status`);
      await successAlert(
        '✅ Actualizado', 
        `Examen ${exam.is_active ? 'desactivado' : 'activado'} correctamente`
      );
      fetchExams();
    } catch (error) {
      errorAlert('❌ Error', 'No se pudo actualizar el estado del examen');
    }
  };

  const deleteExam = async (id) => {
    const result = await confirmAlert(
      '¿Eliminar examen?',
      '¿Estás seguro de eliminar este examen? Esta acción no se puede deshacer.',
      'Sí, eliminar'
    );
    
    if (!result.isConfirmed) return;

    try {
      await api.delete(`/exams/${id}`);
      await successAlert('✅ Eliminado', 'El examen ha sido eliminado correctamente');
      fetchExams();
    } catch (error) {
      errorAlert('❌ Error', 'No se pudo eliminar el examen');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} setUser={setUser} />
      
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Catálogo de Exámenes</h2>
            <p className="text-sm text-gray-500 mt-1">Administra los exámenes y sus plantillas</p>
          </div>
          <Link
            to="/exams/new"
            className="bg-primary-600 hover:bg-primary-700 text-black px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-md transition-colors w-fit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Examen
          </Link>
        </header>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[250px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">🔍 Buscar</label>
            <input
              type="text"
              placeholder="Nombre o código..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">📊 Estado</label>
            <select
              value={filters.is_active}
              onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              <option value="">Todos</option>
              <option value="1">Activos</option>
              <option value="0">Inactivos</option>
            </select>
          </div>
        </div>

        {/* Tabla de Exámenes */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-700 text-sm uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-bold">Código</th>
                  <th className="px-6 py-3 font-bold">Nombre</th>
                  <th className="px-6 py-3 font-bold">Categoría</th>
                  <th className="px-6 py-3 font-bold">Campos</th>
                  <th className="px-6 py-3 font-bold">Precio</th>
                  <th className="px-6 py-3 font-bold">Estado</th>
                  <th className="px-6 py-3 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      ⏳ Cargando exámenes...
                    </td>
                  </tr>
                ) : exams.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No hay exámenes registrados
                    </td>
                  </tr>
                ) : (
                  exams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">{exam.code}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{exam.name}</div>
                        {exam.description && (
                          <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{exam.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{exam.category || '-'}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {exam.fields_count || 0} campos
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ${parseFloat(exam.price || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          exam.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {exam.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Editar */}
                          <Link
                            to={`/exams/${exam.id}/edit`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Editar examen"
                          >
                            ✏️
                          </Link>
                          
                          {/* Activar/Desactivar */}
                          <button
                            onClick={() => toggleStatus(exam)}
                            className={`p-1.5 rounded-md transition-colors ${
                              exam.is_active 
                                ? 'text-amber-600 hover:bg-amber-50' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={exam.is_active ? 'Desactivar examen' : 'Activar examen'}
                          >
                            {exam.is_active ? '🔓' : '🔒'}
                          </button>
                          
                          {/* Eliminar */}
                          <button
                            onClick={() => deleteExam(exam.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Eliminar examen"
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

          {/* PAGINACIÓN CON NÚMEROS */}
          {!loading && exams.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              {/* Información */}
              <div className="text-sm text-gray-600">
                Mostrando <span className="font-semibold">{pagination.total > 0 ? (pagination.current_page - 1) * pagination.per_page + 1 : 0}</span> - <span className="font-semibold">{Math.min(pagination.current_page * pagination.per_page, pagination.total)}</span> de <span className="font-semibold">{pagination.total}</span> exámenes
              </div>

              {/* Botones de paginación */}
              <div className="flex items-center gap-1">
                {/* Primera página */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.current_page === 1}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ««
                </button>

                {/* Página anterior */}
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  «
                </button>

                {/* Números de página */}
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && handlePageChange(page)}
                    disabled={page === '...'}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                      page === pagination.current_page
                        ? 'bg-primary-600 border-primary-600 text-white'
                        : page === '...'
                        ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-default'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Página siguiente */}
                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  »
                </button>

                {/* Última página */}
                <button
                  onClick={() => handlePageChange(pagination.last_page)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  »»
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}