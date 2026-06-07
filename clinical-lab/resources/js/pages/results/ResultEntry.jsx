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

  // Tipo de muestra
  const [sampleType, setSampleType] = useState('SANGRE');

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

  // Cuando se selecciona un examen, cargar sus campos completos
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
        exam_id: selectedExam.value,
        sample_type: sampleType,
      });
      
      const newOrderId = data.order_id || data.id;
      
      if (!newOrderId) {
        throw new Error('La API no retornó un order_id');
      }
      
      setOrderId(newOrderId);
      setExamData(data.exam);
      
      // Filtrar solo campos editables (is_reference = false)
      const editableFields = data.exam.fields.filter(field => !field.is_reference);
      
      const initialResults = editableFields.map(field => ({
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
      case 'low': return 'border-yellow-500 bg-yellow-50 text-yellow-800';
      case 'high': return 'border-red-500 bg-red-50 text-red-800';
      default: return 'border-gray-300 bg-white text-gray-900';
    }
  };

  const selectClassNames = {
    control: (state) => `min-h-[42px] border rounded-lg px-2 cursor-pointer ${state.isFocused ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-300 hover:border-gray-400'}`,
    menu: () => 'bg-white shadow-xl rounded-lg mt-1 border border-gray-200 z-50',
    option: (state) => `px-3 py-2 cursor-pointer text-sm ${state.isFocused ? 'bg-blue-50 text-blue-700' : 'text-gray-700'} ${state.isSelected ? 'bg-blue-100 font-medium' : ''}`,
    placeholder: () => 'text-gray-400 text-sm',
    singleValue: () => 'text-gray-900 text-sm',
    input: () => 'text-sm',
    noOptionsMessage: () => 'py-3 text-gray-500 text-sm',
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} setUser={setUser} />
      <div className="flex-1 ml-64 p-8">
        <header className="bg-white shadow-sm border-b border-blue-100 px-6 py-4 -mx-8 -mt-8 mb-6">
          <h2 className="text-2xl font-bold text-blue-900">Nueva Orden de Laboratorio</h2>
          <p className="text-sm text-gray-500">Selecciona paciente y examen para comenzar</p>
        </header>

        {step === 1 ? (
          /* PASO 1: Selección de Paciente, Examen y Tipo de Muestra */
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 max-w-2xl mx-auto hover:shadow-md transition-shadow">
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

              {/* ✅ SELECT DE TIPO DE MUESTRA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Muestra *
                </label>
                <select
                  value={sampleType}
                  onChange={(e) => setSampleType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                >
                  <option value="SANGRE">SANGRE</option>
                  <option value="ORINA">ORINA</option>
                  <option value="HECES">HECES</option>
                  <option value="SEMEN">SEMEN</option>
                  <option value="LCR">LÍQUIDO CEFALORRAQUÍDEO (LCR)</option>
                  <option value="ESPERMA">ESPERMA</option>
                  <option value="LIQUIDO_SINOVIAL">LÍQUIDO SINOVIAL</option>
                  <option value="LIQUIDO_PLEURAL">LÍQUIDO PLEURAL</option>
                  <option value="OTRO">OTRO</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  onClick={() => navigate('/orders')} 
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleCreateOrder} 
                  disabled={loading || !selectedPatient || !selectedExam} 
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-sm hover:shadow-blue-500/20"
                >
                  {loading ? 'Creando...' : 'Continuar'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* PASO 2: Ingreso de Resultados */
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
            <div className="mb-6 pb-4 border-b border-blue-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-blue-900">Ingreso de Resultados</h3>
              <div className="flex space-x-3 text-xs font-medium">
                <span className="flex items-center"><span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-1.5"></span> Normal</span>
                <span className="flex items-center"><span className="w-2.5 h-2.5 bg-yellow-500 rounded-full mr-1.5"></span> Bajo</span>
                <span className="flex items-center"><span className="w-2.5 h-2.5 bg-red-500 rounded-full mr-1.5"></span> Alto</span>
              </div>
            </div>

            {/* ✅ MOSTRAR TIPO DE MUESTRA SELECCIONADO */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Muestra:</span> {sampleType}
              </p>
            </div>

            {/* ✅ MOSTRAR CAMPOS DE REFERENCIA (si existen) */}
            {examData?.fields?.filter(f => f.is_reference).length > 0 && (
              <div className="mb-6 p-4 bg-blue-50/50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  📋 Valores de Referencia
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {examData.fields.filter(f => f.is_reference).map((field, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="font-medium text-blue-900">{field.field_name}:</span>
                      <span className="ml-2 text-gray-700">
                        {field.ref_min || '-'} - {field.ref_max || '-'} {field.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {examData?.fields?.filter(f => !f.is_reference).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay campos configurados para este examen</p>
                <button onClick={() => setStep(1)} className="mt-4 text-blue-600 hover:text-blue-700 font-medium transition-colors">
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

                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-blue-100">
                  <button 
                    onClick={handleBack} 
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Atrás
                  </button>
                  <button 
                    onClick={handleSaveDraft} 
                    disabled={loading || buttonsDisabled || !orderId} 
                    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-sm hover:shadow-yellow-500/20"
                  >
                    💾 Guardar Borrador
                  </button>
                  <button 
                    onClick={handleSaveComplete} 
                    disabled={loading || buttonsDisabled || !orderId} 
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-sm hover:shadow-green-500/20"
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