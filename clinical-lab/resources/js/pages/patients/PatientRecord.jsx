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
      // Obtener info básica del paciente (puedes reusar la ruta de show de PatientController o hardcodear si prefieres)
      // Aquí asumimos que traemos el historial directo que incluye datos de la orden
      const { data } = await api.get(`/lab-orders/patient/${id}/history`);
      
      // Buscar nombre del paciente en la primera orden (o hacer fetch aparte)
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
        <button onClick={() => navigate('/patients')} className="mb-4 text-gray-600 hover:text-gray-900 font-medium">
          ← Volver a Pacientes
        </button>

        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Expediente Clínico</h2>
          {patient && (
            <p className="text-gray-600 mt-1">
              Paciente: <strong>{patient.first_name} {patient.last_name}</strong> | DUI: {patient.dui}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Examen</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-8">Cargando...</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-8 text-gray-500">No hay registros médicos.</td></tr>
              ) : (
                records.map(order => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium">{order.exam.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Completado</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => downloadPdf(order.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center justify-end ml-auto"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </div>
    </div>
  );
}