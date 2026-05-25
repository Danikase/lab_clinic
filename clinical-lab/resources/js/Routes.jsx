import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/patients/PatientList';
import PatientForm from './pages/patients/PatientForm';
import PatientRecord from './pages/patients/PatientRecord';
import ExamList from './pages/exams/ExamList';
import ExamForm from './pages/exams/ExamForm';
import OrderList from './pages/orders/OrderList';
import ResultEntry from './pages/results/ResultEntry';
import ResultView from './pages/results/ResultView';
import ResultContinue from './pages/results/ResultContinue';
import AppointmentList from './pages/appointments/AppointmentList';
import AppointmentForm from './pages/appointments/AppointmentForm';
import Profile from './pages/Profile';


export default function AppRoutes({ user, setUser }) {
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
      
      <Route path="/" element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" />} />
      
      {/* Pacientes */}
      <Route path="/patients" element={user ? <PatientList user={user} setUser={setUser} /> : <Navigate to="/login" />} />
      <Route path="/patients/new" element={user ? <PatientForm user={user} setUser={setUser} /> : <Navigate to="/login" />} />
      <Route path="/patients/:id/edit" element={user ? <PatientForm user={user} setUser={setUser} /> : <Navigate to="/login" />} />
      <Route path="/patients/:id/record" element={user ? <PatientRecord user={user} setUser={setUser} /> : <Navigate to="/login" />} />

      {/* Exámenes */}
      <Route path="/exams" element={user ? <ExamList user={user} setUser={setUser} /> : <Navigate to="/login" />} />
      <Route path="/exams/new" element={user ? <ExamForm user={user} setUser={setUser} /> : <Navigate to="/login" />} />
      <Route path="/exams/:id/edit" element={user ? <ExamForm user={user} setUser={setUser} /> : <Navigate to="/login" />} />
      
      {/* Órdenes y Resultados - RUTAS ESPECÍFICAS PRIMERO */}
      <Route path="/orders" element={user ? <OrderList user={user} setUser={setUser} /> : <Navigate to="/login" />} />
      <Route path="/orders/:id/results" element={user ? <ResultView user={user} setUser={setUser} /> : <Navigate to="/login" />} /> {/* ✅ AGREGAR ESTA */}
      <Route path="/results/new" element={user ? <ResultEntry user={user} setUser={setUser} /> : <Navigate to="/login" />} />
      <Route path="/results/continue/:id" element={user ? <ResultContinue user={user} setUser={setUser} /> : <Navigate to="/login" />} />
      
      {/* Citas */}
      <Route path="/appointments" element={user ? <AppointmentList user={user} setUser={setUser} /> : <Navigate to="/login" />} />
      <Route path="/appointments/new" element={user ? <AppointmentForm user={user} setUser={setUser} /> : <Navigate to="/login" />} />

      {/* Perfil */}
      <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} />

      {/* Catch-all al FINAL */}
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
    </Routes>
  );
}