import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ModulePage } from './pages/ModulePage';
import { LoginPage } from './pages/LoginPage';
import { useProgress } from './hooks/useProgress';
import { useAuth } from './contexts/AuthContext';

export function App() {
  const { user, loading, signOut } = useAuth();
  const { getModule, recordResult, totalXp, weakestModuleId } = useProgress();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading…</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Layout totalXp={totalXp} onSignOut={signOut}>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              getModule={getModule}
              totalXp={totalXp}
              weakestModuleId={weakestModuleId}
            />
          }
        />
        <Route
          path="/module/:slug"
          element={
            <ModulePage
              getModule={getModule}
              recordResult={recordResult}
            />
          }
        />
        <Route path="*" element={<Dashboard getModule={getModule} totalXp={totalXp} weakestModuleId={weakestModuleId} />} />
      </Routes>
    </Layout>
  );
}
