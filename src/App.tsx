import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ModulePage } from './pages/ModulePage';
import { LoginPage } from './pages/LoginPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { PlayPage } from './pages/PlayPage';
import { GameRoomPage } from './pages/GameRoomPage';
import { useProgress } from './hooks/useProgress';
import { useAuth } from './contexts/AuthContext';
import { db } from './lib/firebase';

export function App() {
  const { user, loading, signOut } = useAuth();
  const { getModule, recordResult, totalXp, weakestModuleId } = useProgress();

  // Sync XP to Firestore for the leaderboard
  useEffect(() => {
    if (!user) return;
    setDoc(doc(db, 'users', user.uid), {
      displayName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
      totalXp,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }, [user, totalXp]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading…</div>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return (
    <Layout totalXp={totalXp} onSignOut={signOut}>
      <Routes>
        <Route path="/" element={
          <Dashboard getModule={getModule} totalXp={totalXp} weakestModuleId={weakestModuleId} />
        } />
        <Route path="/module/:slug" element={
          <ModulePage getModule={getModule} recordResult={recordResult} />
        } />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/play" element={<PlayPage />} />
        <Route path="/game/:code" element={<GameRoomPage />} />
        <Route path="*" element={
          <Dashboard getModule={getModule} totalXp={totalXp} weakestModuleId={weakestModuleId} />
        } />
      </Routes>
    </Layout>
  );
}
