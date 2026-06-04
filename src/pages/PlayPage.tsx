import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { modules } from '../content';
import { buildGameQuestions, generateCode } from '../lib/gameUtils';
import type { RoomDoc } from '../lib/gameUtils';

export function PlayPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'host' | 'join'>('host');

  const [moduleId, setModuleId] = useState(modules[0].id);
  const [creating, setCreating] = useState(false);

  const createRoom = async () => {
    setCreating(true);
    const module = modules.find(m => m.id === moduleId)!;
    const questions = buildGameQuestions(module);
    if (questions.length < 3) {
      alert('Not enough exercises in this module. Try another.');
      setCreating(false);
      return;
    }
    const code = generateCode();
    const name = user!.displayName || user!.email?.split('@')[0] || 'Host';
    const room: RoomDoc = {
      hostId: user!.uid,
      hostName: name,
      moduleTitle: module.title,
      status: 'waiting',
      currentQ: 0,
      questions,
      players: { [user!.uid]: { name, score: 0, answer: null } },
    };
    await setDoc(doc(db, 'rooms', code), room);
    navigate(`/game/${code}`);
  };

  const [code, setCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');

  const joinRoom = async () => {
    setJoinError('');
    const upper = code.toUpperCase().replace(/\s/g, '');
    if (upper.length !== 4) { setJoinError('Enter a 4-letter room code.'); return; }
    setJoining(true);
    const snap = await getDoc(doc(db, 'rooms', upper));
    if (!snap.exists()) {
      setJoinError('Room not found. Check the code.');
      setJoining(false);
      return;
    }
    const room = snap.data() as RoomDoc;
    if (room.status !== 'waiting') {
      setJoinError('This game has already started.');
      setJoining(false);
      return;
    }
    const name = user!.displayName || user!.email?.split('@')[0] || 'Player';
    await updateDoc(doc(db, 'rooms', upper), {
      [`players.${user!.uid}`]: { name, score: 0, answer: null },
    });
    navigate(`/game/${upper}`);
  };

  return (
    <div className="max-w-sm mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">⚔️ Multiplayer</h1>

      <div className="flex rounded-xl bg-gray-100 p-1">
        {(['host', 'join'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              tab === t ? 'bg-white text-french-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'host' ? '🎮 Host a Game' : '🔗 Join a Game'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        {tab === 'host' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pick a module</label>
              <select
                value={moduleId}
                onChange={e => setModuleId(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none
                  focus:border-french-blue transition-colors"
              >
                {modules.map(m => (
                  <option key={m.id} value={m.id}>{m.icon} {m.title}</option>
                ))}
              </select>
            </div>
            <button
              onClick={createRoom}
              disabled={creating}
              className="w-full py-2.5 bg-french-blue text-white text-sm font-semibold rounded-xl
                hover:bg-blue-800 disabled:opacity-50 transition-colors"
            >
              {creating ? 'Creating…' : 'Create Room'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room code</label>
              <input
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4))}
                placeholder="ABCD"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-center
                  text-2xl font-mono tracking-widest outline-none focus:border-french-blue transition-colors"
              />
            </div>
            {joinError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {joinError}
              </p>
            )}
            <button
              onClick={joinRoom}
              disabled={joining || code.length !== 4}
              className="w-full py-2.5 bg-french-blue text-white text-sm font-semibold rounded-xl
                hover:bg-blue-800 disabled:opacity-50 transition-colors"
            >
              {joining ? 'Joining…' : 'Join Room'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
