import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import Sidebar from '../../components/layout/Sidebar';
import { confirmAlert, successAlert, errorAlert, showLoading, hideLoading } from '../../utils/alerts';

export default function PatientList({ user, setUser }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const fetchPatients = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await api.get('/patients', { params: { search, page } });
      setPatients(data.data);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
      });
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (patient) => {
    const result = await confirmAlert(
      '¿Eliminar paciente?',
      `¿Estás seguro de eliminar a ${patient.first_name} ${patient.last_name}? Esta acción no se puede deshacer.`,
      'Sí, eliminar'
    );
    
    if (!result.isConfirmed) return;
    
    showLoading('Eliminando...');
    try {
      await api.delete(`/patients/${patient.id}`);
      hideLoading();
      await successAlert('✅ Eliminado', 'El paciente ha sido eliminado correctamente');
      fetchPatients(pagination.current_page);
    } catch (error) {
      hideLoading();
      errorAlert('❌ Error', 'No se pudo eliminar el paciente');
    }
  };

  const handleToggleStatus = async (patient) => {
    const action = patient.is_active ? 'desactivar' : 'activar';
    const result = await confirmAlert(
      `¿${action === 'activar' ? '✅ Activar' : '⚠️ Desactivar'} paciente?`,
      `¿Deseas ${action} a ${patient.first_name} ${patient.last_name}?`,
      `Sí, ${action}`
    );
    
    if (!result.isConfirmed) return;
    
    try {
      await api.post(`/patients/${patient.id}/toggle-status`);
      await successAlert(
        patient.is_active ? '⚠️ Desactivado' : '✅ Activado',
        `El paciente ha sido ${action} correctamente`
      );
      fetchPatients(pagination.current_page);
    } catch (error) {
      errorAlert('❌ Error', `No se pudo ${action} el paciente`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} setUser={setUser} />

      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 sticky top-0 z-40">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Pacientes</h2>
              <p className="text-sm text-gray-500">Administra la información de los pacientes</p>
            </div>
            <div className="flex items-center gap-4">
              {/* ✅ BOTÓN QUE NAVEGA A LA PÁGINA COMPLETA (SIN MODAL) */}
              <Link 
                to="/patients/new"
                className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-black px-4 py-2.5 rounded-lg shadow-md transition-all font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Nuevo Paciente</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="p-8">
          {/* Barra de búsqueda */}
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre, DUI o teléfono..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm shadow-sm"
              />
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Lista de Pacientes</h3>
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
                Total: {pagination.total}
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary-600/10 text-gray-700 text-sm uppercase tracking-wider">
                    <th className="px-6 py-3 font-bold">DUI</th>
                    <th className="px-6 py-3 font-bold">Nombre Completo</th>
                    <th className="px-6 py-3 font-bold">Teléfono</th>
                    <th className="px-6 py-3 font-bold">Estado</th>
                    <th className="px-6 py-3 font-bold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-10 text-gray-500">Cargando pacientes...</td></tr>
                  ) : patients.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-10 text-gray-500">No se encontraron resultados</td></tr>
                  ) : (
                    patients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 text-sm font-mono text-gray-600">{patient.dui}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="shrink-0 h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
                              {patient.first_name?.[0]}{patient.last_name?.[0]}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {patient.first_name} {patient.last_name}
                              </div>
                              <div className="text-xs text-gray-500">ID: {patient.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-700">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {patient.phone || <span className="text-gray-400">-</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            patient.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {patient.is_active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            
                            {/* 📄 Expediente Clínico */}
                            <Link 
                              to={`/patients/${patient.id}/record`}
                              className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                              title="Ver Expediente Clínico"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </Link>

                            {/* Toggle Estado */}
                            <button 
                              onClick={() => handleToggleStatus(patient)}
                              className={`p-1.5 rounded-md transition-colors ${patient.is_active ? 'text-amber-500 hover:bg-amber-50' : 'text-green-500 hover:bg-green-50'}`}
                              title={patient.is_active ? 'Desactivar' : 'Activar'}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={patient.is_active ? "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                              </svg>
                            </button>
                            
                            {/* Editar */}
                            <Link 
                              to={`/patients/${patient.id}/edit`}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                              title="Editar"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Link>
                            
                            {/* Eliminar */}
                            <button 
                              onClick={() => handleDelete(patient)}
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

            {/* Paginación */}
            {pagination.last_page > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="text-sm text-gray-600">
                  Mostrando página <span className="font-medium">{pagination.current_page}</span> de {pagination.last_page}
                </div>
                <div className="flex space-x-2">
                  <button
                    disabled={pagination.current_page === 1}
                    onClick={() => fetchPatients(pagination.current_page - 1)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>
                  <button
                    disabled={pagination.current_page === pagination.last_page}
                    onClick={() => fetchPatients(pagination.current_page + 1)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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