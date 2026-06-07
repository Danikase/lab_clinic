import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import Sidebar from '../../components/layout/Sidebar';
import { successAlert, errorAlert, showLoading, hideLoading } from '../../utils/alerts';

export default function ExamForm({ user, setUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    description: '',
    price: '',
    template_type: 'simple',
    is_active: true,
    fields: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) fetchExam();
  }, [id]);

  const fetchExam = async () => {
    try {
      const { data } = await api.get(`/exams/${id}`);
      const exam = data.data || data;
      setFormData({
        name: exam.name || '',
        code: exam.code || '',
        category: exam.category || '',
        description: exam.description || '',
        price: exam.price || '',
        is_active: exam.is_active ?? true,
        fields: exam.fields || [],
      });
    } catch (error) {
      errorAlert('❌ Error', 'No se pudo cargar el examen');
      navigate('/exams');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleFieldChange = (index, field, value) => {
    const newFields = [...formData.fields];
    newFields[index][field] = value;
    setFormData(prev => ({ ...prev, fields: newFields }));
  };

  const addField = () => {
    setFormData(prev => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          field_name: '',
          field_type: 'text',
          unit: '',
          ref_min: '',
          ref_max: '',
          is_required: false,
          is_reference: false,
        }
      ]
    }));
  };

  const removeField = (index) => {
    const newFields = formData.fields.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, fields: newFields }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    showLoading(isEdit ? 'Actualizando examen...' : 'Guardando examen...');

    try {
      if (isEdit) {
        await api.put(`/exams/${id}`, formData);
      } else {
        await api.post('/exams', formData);
      }
      hideLoading();
      await successAlert('✅ Guardado', isEdit ? 'Examen actualizado correctamente' : 'Examen creado correctamente');
      navigate('/exams');
    } catch (error) {
      hideLoading();
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
        const firstError = Object.values(error.response.data.errors)[0]?.[0];
        await errorAlert('⚠️ Validación', firstError || 'Revisa los campos marcados en rojo');
      } else {
        await errorAlert('❌ Error', 'No se pudo guardar el examen');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} setUser={setUser} />
      
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/exams')} 
            className="text-blue-600 hover:text-blue-700 flex items-center font-medium mb-2 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a Exámenes
          </button>
          <h2 className="text-2xl font-bold text-blue-900">
            {isEdit ? 'Editar Examen' : 'Nuevo Examen'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isEdit ? 'Modifica la configuración del examen' : 'Crea un nuevo examen con sus parámetros y precios'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-5xl space-y-6">
          
          {/* 1. Información Básica */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Examen *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`} 
                  placeholder="Ej: Hemograma Completo" 
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
                <input 
                  type="text" 
                  name="code" 
                  value={formData.code} 
                  onChange={handleChange} 
                  required 
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.code ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`} 
                  placeholder="Ej: HEMO001" 
                />
                {errors.code && <p className="mt-1 text-xs text-red-500">{errors.code[0]}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows="3" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
                  placeholder="Breve descripción del examen..." 
                />
              </div>
            </div>
          </div>

          {/* 2. Información Comercial */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              Información Comercial
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleChange} 
                    required 
                    min="0" 
                    step="0.01" 
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                      errors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`} 
                    placeholder="0.00" 
                  />
                </div>
                {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Plantilla PDF *
                </label>
                <select
                  name="template_type"
                  value={formData.template_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                >
                  <option value="simple">📄 Simple (1 resultado)</option>
                  <option value="table">📊 Tabla</option>
                  <option value="hemoglobin">📋 Con Referencias</option>
                  <option value="card">🎫 Tarjeta (Tipeo Sanguíneo)</option>
                  <option value="espermograma">🧫 Espermograma</option>
                  <option value="heces">🪴 Heces</option>
                  <option value="frotis">🔬 Frotis Sanguíneo</option>
                  <option value="cultivo"> Cultivo</option>
                  <option value="orina">🧪 Orina General</option>

                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <input 
                  type="text" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
                  placeholder="Ej: Hematología, Bioquímica" 
                />
              </div>
              <div className="flex items-center h-10.5">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    checked={formData.is_active} 
                    onChange={handleChange} 
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Examen Activo</span>
                </label>
              </div>
            </div>
          </div>

          {/* 3. Campos Dinámicos del Examen */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-blue-900 flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                Parámetros del Examen
              </h3>
              <button 
                type="button" 
                onClick={addField} 
                className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar Parámetro
              </button>
            </div>

            {formData.fields.length === 0 ? (
              <div className="text-center py-8 bg-blue-50/50 rounded-lg border border-dashed border-blue-200">
                <p className="text-gray-500 text-sm">No hay parámetros agregados. Haz clic en "Agregar Parámetro" para comenzar.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.fields.map((field, index) => (
                  <div key={index} className="p-4 bg-blue-50/30 rounded-lg border border-blue-200 relative group hover:bg-blue-50/50 transition-colors">
                    <button 
                      type="button" 
                      onClick={() => removeField(index)} 
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-md transition-colors"
                      title="Eliminar parámetro"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-3">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Nombre *</label>
                        <input 
                          type="text" 
                          value={field.field_name} 
                          onChange={(e) => handleFieldChange(index, 'field_name', e.target.value)} 
                          required 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
                          placeholder="Ej: Hemoglobina" 
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Tipo</label>
                        <select 
                          value={field.field_type} 
                          onChange={(e) => handleFieldChange(index, 'field_type', e.target.value)} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        >
                          <option value="text">Texto</option>
                          <option value="number">Numérico</option>
                          <option value="boolean">Sí/No</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Unidad</label>
                        <input 
                          type="text" 
                          value={field.unit} 
                          onChange={(e) => handleFieldChange(index, 'unit', e.target.value)} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
                          placeholder="Ej: g/dL" 
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Ref. Mín</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          value={field.ref_min} 
                          onChange={(e) => handleFieldChange(index, 'ref_min', e.target.value)} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
                          placeholder="—" 
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Ref. Máx</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          value={field.ref_max} 
                          onChange={(e) => handleFieldChange(index, 'ref_max', e.target.value)} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
                          placeholder="—" 
                        />
                      </div>
                      <div className="md:col-span-1 flex items-center pt-5">
                        <label className="flex items-center cursor-pointer" title="Campo obligatorio">
                          <input 
                            type="checkbox" 
                            checked={field.is_required} 
                            onChange={(e) => handleFieldChange(index, 'is_required', e.target.checked)} 
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                          />
                          <span className="ml-1 text-xs font-medium text-gray-600">Req.</span>
                        </label>
                      </div>
                      <div className="md:col-span-1 flex items-center pt-5">
                        <label className="flex items-center cursor-pointer" title="Campo solo referencia (no editable)">
                          <input 
                            type="checkbox" 
                            checked={field.is_reference} 
                            onChange={(e) => handleFieldChange(index, 'is_reference', e.target.checked)} 
                            className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500" 
                          />
                          <span className="ml-1 text-xs font-medium text-gray-600">Ref.</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              onClick={() => navigate('/exams')} 
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-sm hover:shadow-blue-500/20"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Guardando...' : (isEdit ? 'Actualizar Examen' : 'Crear Examen')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}