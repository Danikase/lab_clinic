import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import Sidebar from '../../components/layout/Sidebar';
import { successAlert, errorAlert, showLoading, hideLoading } from '../../utils/alerts';

export default function ResultContinue({ user, setUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/lab-orders/${id}/resume`);
      setOrder(data.order);
      setResults(data.fields);
    } catch (error) {
      alert('⚠️ ' + (error.response?.data?.message || 'Error al cargar la orden'));
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const updateResult = (index, value) => {
    const newResults = [...results];
    newResults[index].value = value;
    
    const field = newResults[index];
    if (field.field_type === 'number' && value) {
      const val = parseFloat(value);
      const min = field.ref_min ? parseFloat(field.ref_min) : null;
      const max = field.ref_max ? parseFloat(field.ref_max) : null;
      if (min && val < min) field.status = 'low';
      else if (max && val > max) field.status = 'high';
      else field.status = 'normal';
    } else {
      field.status = 'na';
    }
    setResults(newResults);
  };

  const handleSaveDraft = async () => {
    if (!order?.id) {
      return errorAlert('❌ Error', 'Orden no encontrada');
    }

    showLoading('Guardando borrador...');
    try {
      await api.post(`/lab-orders/${order.id}/results`, { results, action: 'draft' });
      hideLoading();
      await successAlert('💾 Borrador guardado', 'Puedes continuar editando después');
      navigate('/orders');
    } catch (error) {
      hideLoading();
      errorAlert('❌ Error', error.response?.data?.message || 'No se pudo guardar');
    }
  };

  const handleSaveComplete = async () => {
    if (!order?.id) {
      return errorAlert('❌ Error', 'Orden no encontrada');
    }

    const missingRequired = results.filter(r => r.is_required && !r.value.trim());
    if (missingRequired.length > 0) {
      errorAlert('⚠️ Campos faltantes', `Faltan: ${missingRequired.map(r => r.field_name).join(', ')}`);
      return;
    }

    showLoading('Guardando resultados...');
    try {
      await api.post(`/lab-orders/${order.id}/results`, { results, action: 'complete' });
      hideLoading();
      await successAlert('✅ Completado', 'Resultados guardados y orden finalizada');
      navigate('/orders');
    } catch (error) {
      hideLoading();
      errorAlert('❌ Error', error.response?.data?.message || 'No se pudo guardar');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'border-green-500 bg-green-50 text-green-800';
      case 'low': return 'border-amber-500 bg-amber-50 text-amber-800';
      case 'high': return 'border-red-500 bg-red-50 text-red-800';
      default: return 'border-gray-300 bg-white text-gray-900';
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen text-gray-500">⏳ Cargando orden...</div>;
  if (!order) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} setUser={setUser} />
      <div className="flex-1 ml-64 p-8">
        <button onClick={() => navigate('/orders')} className="mb-6 text-gray-600 hover:text-gray-900 flex items-center font-medium">
          ← Volver a Órdenes
        </button>

        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <h2 className="text-xl font-bold text-gray-900">Continuar Orden #{order.id}</h2>
          <p className="text-sm text-gray-600 mt-1">
            Paciente: <strong>{order.patient?.first_name} {order.patient?.last_name}</strong> | 
            Examen: <strong>{order.exam?.name}</strong>
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="mb-6 pb-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Ingreso de Resultados</h3>
            <div className="flex space-x-3 text-xs font-medium">
              <span className="flex items-center"><span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-1.5"></span> Normal</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full mr-1.5"></span> Bajo</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 bg-red-500 rounded-full mr-1.5"></span> Alto</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((field, index) => (
              <div key={index} className="space-y-1.5">
                <label className="flex text-sm font-medium text-gray-700 items-center justify-between">
                  <span>
                    {field.field_name} {field.unit && <span className="text-gray-500 font-normal">({field.unit})</span>}
                    {field.is_required && <span className="text-red-500 ml-1">*</span>}
                  </span>
                  {field.status !== 'na' && <span className="text-lg">{field.status === 'normal' ? '✅' : field.status === 'low' ? '⬇️' : '⬆️'}</span>}
                </label>
                <input
                  type={field.field_type === 'number' ? 'number' : 'text'}
                  value={field.value}
                  onChange={(e) => updateResult(index, e.target.value)}
                  className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors ${getStatusColor(field.status)}`}
                  placeholder={field.field_type === 'number' ? '0.00' : 'Respuesta...'}
                  step={field.field_type === 'number' ? '0.01' : undefined}
                />
                {(field.ref_min || field.ref_max) && (
                  <p className="text-xs text-gray-500">Ref: {field.ref_min || '—'} - {field.ref_max || '—'}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
            <button 
              onClick={() => navigate('/orders')} 
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancelar
            </button>
            
            <button 
              onClick={handleSaveDraft} 
              disabled={loading} 
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              {loading ? 'Guardando...' : 'Guardar Borrador'}
            </button>
            
            <button 
              onClick={handleSaveComplete} 
              disabled={loading} 
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {loading ? 'Guardando...' : 'Guardar y Completar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}