import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import api from '../../lib/axios';
import Sidebar from '../../components/layout/Sidebar';
import { successAlert, errorAlert, showLoading, hideLoading } from '../../utils/alerts';

export default function ResultEntry({ user, setUser }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  
  const [patientOptions, setPatientOptions] = useState([]);
  const [examOptions, setExamOptions] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examData, setExamData] = useState(null);

  const [results, setResults] = useState([]);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      const { data } = await api.get('/lab-orders/create-form');
      
      setPatientOptions(data.patients.map(p => ({
        value: p.id,
        label: `${p.first_name} ${p.last_name} - ${p.dui}`
      })));
      
      setExamOptions(data.exams.map(e => ({
        value: e.id,
        label: `${e.name} (${e.code})`
      })));
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const handleExamChange = async (selected) => {
    setSelectedExam(selected);
    if (selected) {
      try {
        const { data } = await api.get(`/exams/${selected.value}`);
        setExamData(data.data);
      } catch (error) {
        console.error('Error cargando examen:', error);
        setExamData(null);
      }
    } else {
      setExamData(null);
    }
  };

  const handleCreateOrder = async () => {
    if (!selectedPatient) {
      errorAlert('⚠️ Campo requerido', 'Selecciona un paciente');
      return;
    }
    if (!selectedExam) {
      errorAlert('⚠️ Campo requerido', 'Selecciona un examen');
      return;
    }
    if (!examData || !examData.fields || examData.fields.length === 0) {
      errorAlert('⚠️ Examen sin parámetros', 'Este examen no tiene parámetros configurados.');
      return;
    }

    setLoading(true);
    showLoading('Creando orden...');
    
    try {
      const { data } = await api.post('/lab-orders', {
        patient_id: selectedPatient.value,
        exam_id: selectedExam.value
      });
      
      // ✅ Verificar que tengamos el order_id
      const newOrderId = data.order_id || data.id;
      
      if (!newOrderId) {
        throw new Error('La API no retornó un order_id');
      }
      
      setOrderId(newOrderId);
      setExamData(data.exam);
      
      const initialResults = data.exam.fields.map(field => ({
        field_name: field.field_name,
        value: '',
        ref_min: field.ref_min,
        ref_max: field.ref_max,
        field_type: field.field_type,
        unit: field.unit,
        is_required: field.is_required ?? false,
        status: 'na'
      }));
      
      setResults(initialResults);
      setButtonsDisabled(false);
      hideLoading();
      setStep(2);
      
    } catch (error) {
      hideLoading();
      console.error('Error creando orden:', error);
      const msg = error.response?.data?.message || error.message || 'No se pudo crear la orden';
      errorAlert('❌ Error', msg);
      setButtonsDisabled(true);
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
      
      if (min !== null && val < min) field.status = 'low';
      else if (max !== null && val > max) field.status = 'high';
      else field.status = 'normal';
    } else {
      field.status = 'na';
    }
    
    setResults(newResults);
  };

  const handleSaveDraft = async () => {
    if (!orderId) {
      errorAlert('❌ Error', 'No hay orden creada. Intenta de nuevo.');
      return;
    }
    
    setLoading(true);
    showLoading('Guardando borrador...');
    try {
      await api.post(`/lab-orders/${orderId}/results`, { results, action: 'draft' });
      hideLoading();
      await successAlert('💾 Borrador guardado', 'Puedes continuar editando después');
      navigate('/orders');
    } catch (error) {
      hideLoading();
      errorAlert('❌ Error', error.response?.data?.message || 'No se pudo guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveComplete = async () => {
    if (!orderId) {
      errorAlert('❌ Error', 'No hay orden creada. Intenta de nuevo.');
      return;
    }
    
    const missingRequired = results.filter(r => r.is_required && !r.value.trim());
    if (missingRequired.length > 0) {
      errorAlert('⚠️ Campos faltantes', `Faltan: ${missingRequired.map(r => r.field_name).join(', ')}`);
      return;
    }
    
    setLoading(true);
    showLoading('Guardando resultados...');
    try {
      await api.post(`/lab-orders/${orderId}/results`, { results, action: 'complete' });
      hideLoading();
      await successAlert('✅ Completado', 'Resultados guardados y orden finalizada');
      navigate('/orders');
    } catch (error) {
      hideLoading();
      errorAlert('❌ Error', error.response?.data?.message || 'No se pudo guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    const hasData = results.some(r => r.value.trim() !== '');
    if (hasData) {
      const confirmLeave = window.confirm('Tienes datos sin guardar. ¿Deseas salir de todas formas?');
      if (!confirmLeave) return;
    }
    setStep(1);
    setOrderId(null);
    setResults([]);
    setButtonsDisabled(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'border-green-500 bg-green-50 text-green-800';
      case 'low': return 'border-amber-500 bg-amber-50 text-amber-800';
      case 'high': return 'border-red-500 bg-red-50 text-red-800';
      default: return 'border-gray-300 bg-white text-gray-900';
    }
  };

  const selectClassNames = {
    control: (state) => `min-h-[42px] border rounded-lg px-2 cursor-pointer ${state.isFocused ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-gray-300 hover:border-gray-400'}`,
    menu: () => 'bg-white shadow-xl rounded-lg mt-1 border border-gray-200 z-50',
    option: (state) => `px-3 py-2 cursor-pointer text-sm ${state.isFocused ? 'bg-primary-50 text-primary-700' : 'text-gray-700'} ${state.isSelected ? 'bg-primary-100 font-medium' : ''}`,
    placeholder: () => 'text-gray-400 text-sm',
    singleValue: () => 'text-gray-900 text-sm',
    input: () => 'text-sm',
    noOptionsMessage: () => 'py-3 text-gray-500 text-sm',
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} setUser={setUser} />
      <div className="flex-1 ml-64 p-8">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 -mx-8 -mt-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Nueva Orden de Laboratorio</h2>
          <p className="text-sm text-gray-500">Selecciona paciente y examen para comenzar</p>
        </header>

        {step === 1 ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border max-w-2xl mx-auto">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paciente *</label>
                <Select
                  options={patientOptions}
                  value={selectedPatient}
                  onChange={setSelectedPatient}
                  placeholder="🔍 Buscar paciente por nombre o DUI..."
                  isSearchable
                  classNames={selectClassNames}
                  menuPortalTarget={document.body}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Examen *</label>
                <Select
                  options={examOptions}
                  value={selectedExam}
                  onChange={handleExamChange}
                  placeholder="🔍 Buscar examen por nombre o código..."
                  isSearchable
                  classNames={selectClassNames}
                  menuPortalTarget={document.body}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button onClick={() => navigate('/orders')} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Cancelar</button>
                <button 
                  onClick={handleCreateOrder} 
                  disabled={loading || !selectedPatient || !selectedExam} 
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? 'Creando...' : 'Continuar'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="mb-6 pb-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Ingreso de Resultados</h3>
              <div className="flex space-x-3 text-xs font-medium">
                <span className="flex items-center"><span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-1.5"></span> Normal</span>
                <span className="flex items-center"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full mr-1.5"></span> Bajo</span>
                <span className="flex items-center"><span className="w-2.5 h-2.5 bg-red-500 rounded-full mr-1.5"></span> Alto</span>
              </div>
            </div>

            {examData?.fields?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay campos configurados para este examen</p>
                <button onClick={() => setStep(1)} className="mt-4 text-primary-600 hover:text-primary-700 font-medium">
                  ← Volver y seleccionar otro examen
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.map((field, index) => (
                    <div key={index} className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700 flex items-center justify-between">
                        <span>
                          {field.field_name} {field.unit && <span className="text-gray-500 font-normal">({field.unit})</span>}
                          {field.is_required && <span className="text-red-500 ml-1">*</span>}
                        </span>
                        {field.status !== 'na' && (
                          <span className="text-lg">
                            {field.status === 'normal' ? '✅' : field.status === 'low' ? '⬇️' : '⬆️'}
                          </span>
                        )}
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
                    onClick={handleBack} 
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Atrás
                  </button>
                  <button 
                    onClick={handleSaveDraft} 
                    disabled={loading || buttonsDisabled || !orderId} 
                    className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    💾 Guardar Borrador
                  </button>
                  <button 
                    onClick={handleSaveComplete} 
                    disabled={loading || buttonsDisabled || !orderId} 
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    ✅ Guardar y Completar
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}