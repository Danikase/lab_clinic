import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import Sidebar from '../../components/layout/Sidebar';

export default function PatientRecord({ user, setUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (user) {
      fetchRecords();
    } else {
      navigate('/login');
    }
  }, [id, user]);

  const fetchRecords = async () => {
    try {
      const { data } = await api.get(`/lab-orders/patient/${id}/history`);
      
      if(data.length > 0) setPatient(data[0].patient);
      setRecords(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async (orderId) => {
    try {
      const response = await api.get(`/lab-orders/${orderId}/download-pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert('Error al descargar PDF');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} setUser={setUser} />
      <div className="flex-1 ml-64 p-8">
        
        {/* Header con botón de regreso */}
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
          <h2 className="text-2xl font-bold text-blue-900">Expediente Clínico</h2>
          {patient && (
            <p className="text-gray-600 mt-1">
              Paciente: <strong className="text-blue-900">{patient.first_name} {patient.last_name}</strong> | DUI: <span className="font-mono">{patient.dui}</span>
            </p>
          )}
        </div>

        {/* Tarjeta de información del paciente */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6 mb-6 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg shrink-0">
              {patient?.first_name?.[0]}{patient?.last_name?.[0]}
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-900">{patient?.first_name} {patient?.last_name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">DUI:</span> {patient?.dui} • 
                <span className="font-medium ml-2">Edad:</span> {patient?.age || '—'} • 
                <span className="font-medium ml-2">Sexo:</span> {patient?.gender || '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabla de registros */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-blue-100 bg-blue-50/50">
            <h3 className="text-lg font-bold text-blue-900">Historial de Exámenes</h3>
          </div>
          
          <table className="w-full text-left">
            <thead className="bg-blue-50 text-blue-900 text-sm uppercase tracking-wider border-b border-blue-100">
              <tr>
                <th className="px-6 py-3 font-bold">Fecha</th>
                <th className="px-6 py-3 font-bold">Examen</th>
                <th className="px-6 py-3 font-bold">Estado</th>
                <th className="px-6 py-3 text-right font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-8 text-gray-500">⏳ Cargando historial...</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-12 text-gray-500">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="font-medium">No hay registros médicos</p>
                  <p className="text-sm mt-1 text-gray-400">Los exámenes completados aparecerán aquí</p>
                </td></tr>
              ) : (
                records.map(order => (
                  <tr key={order.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(order.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-blue-900">{order.exam.name}</span>
                      {order.exam.code && (
                        <span className="block text-xs text-gray-500 font-mono">{order.exam.code}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}>
                        {order.status === 'completed' ? '✅ Completado' : '⏳ En proceso'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => downloadPdf(order.id)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                        title="Descargar PDF"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        PDF
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Info adicional */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <strong>Nota:</strong> Los resultados se generan automáticamente al completar el examen. 
              Puedes descargar el PDF en cualquier momento desde esta sección.
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}