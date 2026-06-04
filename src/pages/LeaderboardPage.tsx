import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface Entry {
  uid: string;
  displayName: string;
  totalXp: number;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export function LeaderboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, 'users'), orderBy('totalXp', 'desc'), limit(20)))
      .then(snap => {
        setEntries(snap.docs.map(d => ({ uid: d.id, ...(d.data() as Omit<Entry, 'uid'>) })));
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">🏆 Leaderboard</h1>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : entries.length === 0 ? (
        <p className="text-gray-400 text-sm">No scores yet — start practising!</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {entries.map((entry, i) => (
            <div
              key={entry.uid}
              className={`flex items-center gap-4 px-5 py-3 ${
                i < entries.length - 1 ? 'border-b border-gray-100' : ''
              } ${entry.uid === user?.uid ? 'bg-french-blue/5' : ''}`}
            >
              <span className="w-8 text-center text-lg">
                {MEDALS[i] ?? <span className="text-sm text-gray-400">{i + 1}</span>}
              </span>
              <span className="flex-1 font-medium text-gray-800">
                {entry.displayName || 'Anonymous'}
                {entry.uid === user?.uid && (
                  <span className="text-french-blue text-xs ml-2">(you)</span>
                )}
              </span>
              <span className="font-semibold text-yellow-600 text-sm">⚡ {entry.totalXp} XP</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
