import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import Sidebar from '../../components/layout/Sidebar';
import { successAlert, errorAlert, confirmAlert } from '../../utils/alerts';
import LoadingSpinner from '../../components/layout/LoadingSpinner'; 

export default function PatientList({ user, setUser }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  useEffect(() => {
    fetchPatients();
  }, [pagination.current_page, search]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current_page,
        search: search,
      };
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      
      const { data } = await api.get('/patients', { params });
      setPatients(data.data);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        per_page: data.per_page,
        total: data.total,
      });
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
      errorAlert('❌ Error', 'No se pudieron cargar los pacientes');
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
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
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

  const handleDelete = async (patient) => {
    const result = await confirmAlert(
      '¿Eliminar paciente?',
      `¿Estás seguro de eliminar a ${patient.first_name} ${patient.last_name}? Esta acción no se puede deshacer.`,
      'Sí, eliminar'
    );
    
    if (!result.isConfirmed) return;
    
    try {
      await api.delete(`/patients/${patient.id}`);
      await successAlert('✅ Eliminado', 'El paciente ha sido eliminado correctamente');
      fetchPatients();
    } catch (error) {
      errorAlert('❌ Error', 'No se pudo eliminar el paciente');
    }
  };

  const handleToggleStatus = async (patient) => {
    const action = patient.is_active ? 'desactivar' : 'activar';
    try {
      await api.post(`/patients/${patient.id}/toggle-status`);
      await successAlert(
        patient.is_active ? '⚠️ Desactivado' : '✅ Activado',
        `El paciente ha sido ${action} correctamente`
      );
      fetchPatients();
    } catch (error) {
      errorAlert('❌ Error', `No se pudo ${action} el paciente`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} setUser={setUser} />

      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-blue-900">Gestión de Pacientes</h2>
            <p className="text-sm text-gray-500 mt-1">Administra la información de los pacientes</p>
          </div>
          <Link
            to="/patients/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-md transition-colors w-fit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Paciente
          </Link>
        </header>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-200 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 max-w-md">
              <label className="block text-xs font-medium text-gray-600 mb-1">🔍 Buscar</label>
              <input
                type="text"
                placeholder="Nombre, DUI o teléfono..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Tabla de Pacientes */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-blue-50 text-blue-900 text-sm uppercase tracking-wider border-b border-blue-100">
                <tr>
                  <th className="px-6 py-3 font-bold">DUI</th>
                  <th className="px-6 py-3 font-bold">Nombre Completo</th>
                  <th className="px-6 py-3 font-bold">Teléfono</th>
                  <th className="px-6 py-3 font-bold">Estado</th>
                  <th className="px-6 py-3 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12">
                      <LoadingSpinner message="Cargando pacientes..." />
                    </td>
                  </tr>
                ) : patients.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No hay pacientes registrados
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-blue-50/50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">{patient.dui}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="shrink-0 h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                            {patient.first_name?.[0]}{patient.last_name?.[0]}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-blue-900">
                              {patient.first_name} {patient.last_name}
                            </div>
                            <div className="text-xs text-gray-500">ID: {patient.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {patient.phone || <span className="text-gray-400">-</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                          patient.is_active 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {patient.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Expediente - AZUL */}
                          <Link
                            to={`/patients/${patient.id}/record`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Ver Expediente"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </Link>

                          {/* Activar/Desactivar - AMARILLO/VERDE */}
                          <button
                            onClick={() => handleToggleStatus(patient)}
                            className={`p-1.5 rounded-md transition-colors ${
                              patient.is_active 
                                ? 'text-yellow-600 hover:bg-yellow-50' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={patient.is_active ? 'Desactivar' : 'Activar'}
                          >
                            {patient.is_active ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </button>
                          
                          {/* Editar - AZUL */}
                          <Link
                            to={`/patients/${patient.id}/edit`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Editar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          
                          {/* Eliminar - ROJO */}
                          <button
                            onClick={() => handleDelete(patient)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
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

          {/* PAGINACIÓN CON NÚMEROS */}
          {!loading && patients.length > 0 && (
            <div className="px-6 py-4 border-t border-blue-200 flex items-center justify-between bg-blue-50/30">
              {/* Información */}
              <div className="text-sm text-gray-600">
                Mostrando <span className="font-medium text-blue-900">{pagination.total > 0 ? (pagination.current_page - 1) * pagination.per_page + 1 : 0}</span> - <span className="font-medium text-blue-900">{Math.min(pagination.current_page * pagination.per_page, pagination.total)}</span> de <span className="font-medium text-blue-900">{pagination.total}</span> pacientes
              </div>

              {/* Botones de paginación */}
              <div className="flex items-center gap-1">
                {/* Primera página */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.current_page === 1}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border border-blue-200 bg-white text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ««
                </button>

                {/* Página anterior */}
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border border-blue-200 bg-white text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : page === '...'
                        ? 'border-blue-200 bg-blue-50 text-gray-500 cursor-default'
                        : 'border-blue-200 bg-white text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Página siguiente */}
                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border border-blue-200 bg-white text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  »
                </button>

                {/* Última página */}
                <button
                  onClick={() => handlePageChange(pagination.last_page)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border border-blue-200 bg-white text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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