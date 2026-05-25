import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import Sidebar from '../../components/layout/Sidebar';
import { successAlert, errorAlert, confirmAlert, showLoading, hideLoading } from '../../utils/alerts';

export default function ExamList({ user, setUser }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({});

  const now = new Date();
  const formattedDate = now.toLocaleDateString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  useEffect(() => {
    fetchExams();
  }, [search]);

  const fetchExams = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await api.get('/exams', { params: { search, page } });
      setExams(data.data);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (exam) => {
    const result = await confirmAlert(
      '¿Eliminar examen?',
      `¿Estás seguro de eliminar "${exam.name}"? Se eliminarán también sus campos asociados.`,
      'Sí, eliminar'
    );
    
    if (!result.isConfirmed) return;
    
    showLoading('Eliminando...');
    try {
      await api.delete(`/exams/${exam.id}`);
      hideLoading();
      await successAlert('✅ Eliminado', 'El examen ha sido eliminado');
      fetchExams(pagination.current_page);
    } catch (error) {
      hideLoading();
      errorAlert('❌ Error', 'No se pudo eliminar el examen');
    }
  };

  const handleToggleStatus = async (exam) => {
    const action = exam.is_active ? 'desactivar' : 'activar';
    const result = await confirmAlert(
      `¿${action === 'activar' ? '✅ Activar' : '⚠️ Desactivar'} examen?`,
      `¿Deseas ${action} el examen "${exam.name}"?`,
      `Sí, ${action}`
    );
    
    if (!result.isConfirmed) return;
    
    try {
      await api.post(`/exams/${exam.id}/toggle-status`);
      await successAlert(
        exam.is_active ? '⚠️ Desactivado' : '✅ Activado',
        `El examen ha sido ${action}`
      );
      fetchExams(pagination.current_page);
    } catch (error) {
      errorAlert('❌ Error', `No se pudo ${action} el examen`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} setUser={setUser} />

      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 sticky top-0 z-40">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Catálogo de Exámenes</h2>
              <p className="text-sm text-gray-500">Administra los exámenes y sus plantillas</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden md:block text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                📅 {formattedDate}
              </span>
              <Link 
                to="/exams/new"
                className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-black px-4 py-2.5 rounded-lg shadow-md transition-all font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Nuevo Examen</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="p-8">
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar por nombre, código o categoría..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Exámenes Registrados</h3>
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
                Total: {pagination.total}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-primary-600/10 text-gray-700 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-3 font-bold">Código</th>
                    <th className="px-6 py-3 font-bold">Nombre</th>
                    <th className="px-6 py-3 font-bold">Categoría</th>
                    <th className="px-6 py-3 font-bold text-center">Campos</th>
                    <th className="px-6 py-3 font-bold">Precio</th>
                    <th className="px-6 py-3 font-bold">Estado</th>
                    <th className="px-6 py-3 font-bold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {loading ? (
                        <tr><td colSpan="6" className="text-center py-10 text-gray-500">Cargando...</td></tr>
                    ) : exams.length === 0 ? (
                        <tr><td colSpan="6" className="text-center py-10 text-gray-500">No hay exámenes registrados</td></tr>
                    ) : (
                        exams.map((exam) => (
                        // ✅ AQUÍ va 'group'. Es el padre que activa el hover
                        <tr key={exam.id} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-6 py-4 text-sm font-mono font-medium text-gray-900">{exam.code}</td>
                            <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{exam.name}</div>
                            {exam.description && <div className="text-xs text-gray-500 truncate max-w-xs">{exam.description}</div>}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{exam.category || '-'}</td>
                            <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {exam.fields_count} campos
                            </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              ${parseFloat(exam.price).toFixed(2)}
                            </td>
                            <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                exam.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {exam.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                            {/* ✅ opacity-0 por defecto. group-hover:opacity-100 lo muestra al pasar el mouse por el <tr> */}
                            <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                onClick={() => handleToggleStatus(exam)}
                                className={`p-1.5 rounded-md transition-colors ${exam.is_active ? 'text-amber-500 hover:bg-amber-50' : 'text-green-500 hover:bg-green-50'}`}
                                title={exam.is_active ? 'Desactivar' : 'Activar'}
                                >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={exam.is_active ? "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                                </svg>
                                </button>
                                <Link
                                to={`/exams/${exam.id}/edit`}
                                className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                                title="Editar"
                                >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                </Link>
                                <button
                                onClick={() => handleDelete(exam)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                title="Eliminar"
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
        </main>
      </div>
    </div>
  );
}