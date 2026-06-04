import { Link, NavLink } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  totalXp: number;
  onSignOut: () => Promise<void>;
}

export function Layout({ children, totalXp, onSignOut }: Props) {
  const navCls = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-french-blue' : 'text-gray-500 hover:text-gray-800'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-lg text-french-blue
              hover:text-blue-800 transition-colors focus:outline-none focus:underline"
          >
            <span className="text-xl" aria-hidden="true">🇫🇷</span>
            Maîtrise
          </Link>

          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-1.5 text-sm font-semibold text-yellow-600 bg-yellow-50
                border border-yellow-200 rounded-full px-3 py-1"
              aria-label={`${totalXp} XP`}
            >
              <span aria-hidden="true">⚡</span>
              {totalXp} XP
            </div>

            <NavLink to="/play" className={navCls}>⚔️ Play</NavLink>
            <NavLink to="/leaderboard" className={navCls}>🏆</NavLink>

            <button
              onClick={onSignOut}
              className="text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-gray-200 text-center py-4 text-xs text-gray-400">
        Maîtrise — FSF1D French Grammar Practice
      </footer>
    </div>
  );
}
