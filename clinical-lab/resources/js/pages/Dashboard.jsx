import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import Sidebar from '../components/layout/Sidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard({ user, setUser }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/dashboard/stats');
      setStats(data);
    } catch (error) {
      console.error('Error cargando estadísticas', error);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const formattedDate = now.toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value || 0);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-blue-900 font-medium">Cargando dashboard...</p>
      </div>
    </div>
  );
  
  if (!stats) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} setUser={setUser} />

      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Panel de Control</h1>
          <p className="text-gray-600 text-sm mt-1 capitalize">{formattedDate}</p>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {/* Pacientes - AZUL */}
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pacientes</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{stats.kpis.patients}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Órdenes - AZUL OSCURO */}
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-800 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Órdenes</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{stats.kpis.orders}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Completadas - VERDE */}
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Completadas</p>
                <p className="text-3xl font-bold text-green-700 mt-2">{stats.kpis.completed}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* En Proceso - DORADO/AMARILLO */}
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">En Proceso</p>
                <p className="text-3xl font-bold text-yellow-700 mt-2">{stats.kpis.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Ingresos - DORADO */}
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-600 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ingresos del Mes</p>
                <p className="text-2xl font-bold text-yellow-700 mt-2">
                  {formatCurrency(stats.kpis.monthly_income)}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Citas de Hoy */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-blue-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Citas Programadas para Hoy
            </h3>
            <Link to="/appointments" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Ver agenda completa →
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {stats.today_appointments?.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {stats.today_appointments.map((apt) => (
                  <div key={apt.id} className="px-6 py-4 flex items-center justify-between hover:bg-blue-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="text-center min-w-[60px]">
                        <span className="block text-lg font-bold text-blue-900">{apt.time}</span>
                        <span className="text-xs text-gray-500">hs</span>
                      </div>
                      <div className="w-px h-10 bg-gray-200"></div>
                      <div>
                        <p className="font-semibold text-gray-900">{apt.patient}</p>
                        <p className="text-sm text-gray-600">
                          {apt.type === 'toma_muestra' && '🧪 Toma de muestra'}
                          {apt.type === 'entrega_resultados' && '📄 Entrega de resultados'}
                          {apt.type === 'consulta' && '🩺 Consulta'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      apt.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {apt.status === 'completed' ? '✅ Completada' : '📅 Pendiente'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="font-medium">No hay citas programadas para hoy</p>
                <p className="text-sm mt-1 text-gray-400">¡Aprovecha para organizar la agenda!</p>
              </div>
            )}
          </div>
        </div>

        {/* Gráficas */}
        <h3 className="text-lg font-bold text-blue-900 mb-4">📈 Tendencias de los Últimos 6 Meses</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Tendencia de Órdenes - AZUL */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-blue-200">
            <h4 className="text-base font-bold text-blue-900 mb-4 flex items-center">
              <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
              Volumen de Órdenes
            </h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.charts.orders_by_month}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      backgroundColor: '#fff'
                    }}
                    cursor={{fill: '#f3f4f6'}}
                  />
                  <Bar dataKey="ordenes" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tendencia de Ingresos - DORADO */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-yellow-200">
            <h4 className="text-base font-bold text-yellow-700 mb-4 flex items-center">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              Ingresos Generados
            </h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.charts.income_by_month}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), 'Ingresos']}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      backgroundColor: '#fff'
                    }}
                    cursor={{fill: '#f3f4f6'}}
                  />
                  <Bar dataKey="ingresos" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Insight */}
        {stats.charts.orders_by_month?.length > 0 && stats.charts.income_by_month?.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <span className="font-bold">💡 Insight:</span> El ticket promedio por orden este mes es de <strong className="text-blue-700">{formatCurrency(stats.kpis.monthly_income / (stats.kpis.completed || 1))}</strong>.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}