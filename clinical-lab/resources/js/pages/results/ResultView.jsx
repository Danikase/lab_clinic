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
      low: 'bg-amber-100 text-amber-800 border-amber-200',
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

  if (loading) return <div className="flex items-center justify-center h-screen text-gray-500">⏳ Cargando reporte...</div>;
  if (!report) return <div className="p-10 text-center text-red-500">Reporte no encontrado</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} setUser={setUser} />
      <div className="flex-1 ml-64 p-8">
        <button onClick={() => navigate('/orders')} className="mb-6 text-gray-600 hover:text-gray-900 flex items-center font-medium transition-colors">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Volver a Órdenes
        </button>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header del Reporte */}
          <div className="p-6 border-b bg-linear-to-r from-primary-50 to-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Reporte de Resultados</h2>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Paciente:</strong> {report.patient?.first_name} {report.patient?.last_name} <br/>
                  <strong>Examen:</strong> {report.exam?.name} ({report.exam?.code}) <br/>
                  <strong>Fecha:</strong> {new Date(report.created_at).toLocaleDateString('es-ES', { year:'numeric', month:'long', day:'numeric' })}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${report.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                {report.status === 'completed' ? '✅ Completado' : '⏳ En Proceso'}
              </span>
            </div>
          </div>

          {/* Tabla de Resultados */}
          <div className="p-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 text-sm text-gray-600 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Parámetro</th>
                  <th className="pb-3 font-semibold">Resultado</th>
                  <th className="pb-3 font-semibold">Unidad</th>
                  <th className="pb-3 font-semibold">Rango de Referencia</th>
                  <th className="pb-3 font-semibold text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {report.report.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-medium text-gray-900">{row.field_name}</td>
                    <td className="py-3 font-bold text-lg">{row.value || '-'}</td>
                    <td className="py-3 text-gray-500">{row.unit || '-'}</td>
                    <td className="py-3 text-gray-500 font-mono text-sm">{row.ref_min || '—'} – {row.ref_max || '—'}</td>
                    <td className="py-3 text-right">{getStatusBadge(row.reference_status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
            <p className="text-xs text-gray-500">Este reporte es generado automáticamente por el sistema.</p>
          </div>
        </div>
      </div>
    </div>
  );
}