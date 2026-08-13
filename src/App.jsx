import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';

// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// App pages
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import Agenda from '@/pages/Agenda';
import Patients from '@/pages/Patients';
import PatientDetail from '@/pages/PatientDetail';
import ClinicalNotes from '@/pages/ClinicalNotes';
import Financial from '@/pages/Financial';
import Payments from '@/pages/Payments';
import ReceitaSaude from '@/pages/ReceitaSaude';
import Accounting from '@/pages/Accounting';
import Reports from '@/pages/Reports';
import VideoConsulta from '@/pages/VideoConsulta';
import AgenciaOnline from '@/pages/AgenciaOnline';
import Integracoes from '@/pages/Integracoes';
import Equipe from '@/pages/Equipe';
import Documentos from '@/pages/Documentos';
import Configuracoes from '@/pages/Configuracoes';
import Notificacoes from '@/pages/Notificacoes';
import ImplementationSummary from '@/pages/ImplementationSummary';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/pacientes" element={<Patients />} />
          <Route path="/pacientes/:id" element={<PatientDetail />} />
          <Route path="/prontuario" element={<ClinicalNotes />} />
          <Route path="/financeiro" element={<Financial />} />
          <Route path="/pagamentos" element={<Payments />} />
          <Route path="/receita-saude" element={<ReceitaSaude />} />
          <Route path="/contabilidade" element={<Accounting />} />
          <Route path="/documentos" element={<Documentos />} />
          <Route path="/relatorios" element={<Reports />} />
          <Route path="/videoconsulta" element={<VideoConsulta />} />
          <Route path="/agencia-online" element={<AgenciaOnline />} />
          <Route path="/integracoes" element={<Integracoes />} />
          <Route path="/equipe" element={<Equipe />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/notificacoes" element={<Notificacoes />} />
          <Route path="/resumo-implementacao" element={<ImplementationSummary />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App