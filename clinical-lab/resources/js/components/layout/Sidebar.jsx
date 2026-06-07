import { Link, useLocation } from 'react-router-dom';
import api from '../../lib/axios';

export default function Sidebar({ user, setUser }) {
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      setUser(null);
    } catch (err) {
      console.error('Error al cerrar sesión', err);
    }
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => 
    `flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
      isActive(path) 
        ? 'bg-white/20 text-white shadow-md' 
        : 'text-blue-100 hover:bg-blue-800/50 hover:text-white'
    }`;

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-900 via-blue-900 to-blue-950 text-white min-h-screen fixed left-0 top-0 shadow-2xl z-50 flex flex-col border-r border-blue-800">
      {/* Logo Area */}
      <div className="p-6 border-b border-blue-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
            <img 
              src="/img/logoColor.jpg" 
              alt="Logo Laboratorio Alfaro" 
              className="w-8 h-8 object-contain" 
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Laboratorio Alfaro</h1>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-yellow-300">Sistema de Gestión</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* Dashboard */}
        <Link to="/" className={linkClass('/')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Dashboard</span>
        </Link>

        {/* Pacientes */}
        <Link to="/patients" className={linkClass('/patients')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Pacientes</span>
        </Link>

        {/* Exámenes */}
        <Link to="/exams" className={linkClass('/exams')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span>Exámenes</span>
        </Link>

        {/* Resultados */}
        <Link to="/orders" className={linkClass('/orders')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Resultados</span>
        </Link>

        {/* Consultas */}
        <Link to="/appointments" className={linkClass('/appointments')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Consultas</span>
        </Link>
      </nav>

      {/* User Profile Bottom */}
      <div className="p-4 border-t border-blue-700/50 bg-blue-800/30">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center border-2 border-yellow-400/50 shadow-lg">
            <span className="text-yellow-300 font-bold text-lg">{user?.name?.charAt(0) || 'U'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
            <p className="text-xs text-blue-200 truncate capitalize">{user?.role}</p>
          </div>
        </div>
        
        <Link 
          to="/profile" 
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-700/50 transition-colors text-blue-100 mb-2"
        >
          <div className="w-8 h-8 bg-blue-700/50 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="text-sm font-medium">Mi Perfil</span>
        </Link>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all shadow-md hover:shadow-red-600/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}