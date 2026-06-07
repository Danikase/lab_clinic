import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import Sidebar from '../../components/layout/Sidebar';

export default function ResultView({ user, setUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const { data } = await api.get(`/lab-orders/${id}`);
      setReport(data.data);
    } catch (error) {
      alert('Error al cargar el reporte');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      normal: 'bg-green-100 text-green-800 border-green-200',
      low: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200',
      na: 'bg-gray-100 text-gray-600 border-gray-200'
    };
    const label = { normal: 'Normal', low: 'Bajo', high: 'Alto', na: 'N/A' };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${map[status] || map.na}`}>
        {label[status] || 'N/A'}
      </span>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-blue-900 font-medium">Cargando reporte...</p>
      </div>
    </div>
  );
  
  if (!report) return <div className="p-10 text-center text-red-600 font-medium">Reporte no encontrado</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} setUser={setUser} />
      <div className="flex-1 ml-64 p-8">
        
        {/* Botón de regreso */}
        <button 
          onClick={() => navigate('/orders')} 
          className="mb-6 text-blue-600 hover:text-blue-700 flex items-center font-medium transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a Órdenes
        </button>

        <div className="bg-white rounded-xl shadow-lg border border-blue-200 overflow-hidden">
          {/* Header del Reporte */}
          <div className="p-6 border-b border-blue-100 bg-blue-50/50">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-blue-900">Reporte de Resultados</h2>
                <p className="text-sm text-gray-600 mt-2 space-y-1">
                  <span><strong className="text-blue-900">Paciente:</strong> {report.patient?.first_name} {report.patient?.last_name}</span><br/>
                  <span><strong className="text-blue-900">Examen:</strong> {report.exam?.name} <span className="font-mono text-gray-500">({report.exam?.code})</span></span><br/>
                  <span><strong className="text-blue-900">Fecha:</strong> {new Date(report.created_at).toLocaleDateString('es-ES', { year:'numeric', month:'long', day:'numeric' })}</span>
                </p>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                report.status === 'completed' 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-blue-100 text-blue-800 border-blue-200'
              }`}>
                {report.status === 'completed' ? '✅ Completado' : '⏳ En Proceso'}
              </span>
            </div>
          </div>

          {/* Tabla de Resultados */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-blue-200 text-sm text-blue-900 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Parámetro</th>
                    <th className="pb-3 font-semibold">Resultado</th>
                    <th className="pb-3 font-semibold">Unidad</th>
                    <th className="pb-3 font-semibold">Rango de Referencia</th>
                    <th className="pb-3 font-semibold text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {report.report?.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-3 font-medium text-blue-900">{row.field_name}</td>
                      <td className="py-3 font-bold text-lg text-gray-900">{row.value || '-'}</td>
                      <td className="py-3 text-gray-500">{row.unit || '-'}</td>
                      <td className="py-3 text-gray-500 font-mono text-sm">
                        {row.ref_min || '—'} – {row.ref_max || '—'}
                      </td>
                      <td className="py-3 text-right">{getStatusBadge(row.reference_status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-blue-50/30 border-t border-blue-100 flex justify-between items-center">
            <p className="text-xs text-blue-800">
              <strong>Nota:</strong> Este reporte es generado automáticamente por el sistema del Laboratorio Alfaro.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Documento válido sin firma
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}