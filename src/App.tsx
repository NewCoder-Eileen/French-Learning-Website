import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ModulePage } from './pages/ModulePage';
import { useProgress } from './hooks/useProgress';

export function App() {
  const { getModule, recordResult, totalXp, weakestModuleId } = useProgress();

  return (
    <Layout totalXp={totalXp}>
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
