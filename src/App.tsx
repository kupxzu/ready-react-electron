import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import UsersPage from './pages/UsersPage';
import NotFound from './pages/NotFound';
import { ToastProvider } from './context/ToastContext';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
