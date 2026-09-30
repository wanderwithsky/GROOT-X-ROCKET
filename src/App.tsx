import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { Streak } from './pages/Streak';
import { Profile } from './pages/Profile';
import { EditProfile } from './pages/EditProfile';
import { Settings } from './pages/Settings';
import { ThemeSelector } from './pages/ThemeSelector';
import { InstallPrompt } from './components/InstallPrompt';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[var(--theme-bg)] text-[var(--theme-text-muted)]">Loading...</div>;
  return session ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  const { session, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[var(--theme-bg)] text-[var(--theme-text-muted)]">Loading...</div>;
  return (
    <Router>
      <Routes>
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/streak" element={<PrivateRoute><Streak /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/settings/theme" element={<PrivateRoute><ThemeSelector /></PrivateRoute>} />
        
        {/* Fallbacks */}
        <Route path="/memories" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="*" element={<Navigate to={session ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppRoutes />
        <InstallPrompt />
      </ThemeProvider>
    </AuthProvider>
  );
}
