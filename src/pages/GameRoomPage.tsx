import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { RoomDoc } from '../lib/gameUtils';

const CHOICE_STYLE = [
  { base: 'bg-blue-500',   hover: 'hover:bg-blue-600'   },
  { base: 'bg-yellow-500', hover: 'hover:bg-yellow-600' },
  { base: 'bg-red-500',    hover: 'hover:bg-red-600'    },
  { base: 'bg-green-500',  hover: 'hover:bg-green-600'  },
];

export function GameRoomPage() {
  const { code } = useParams<{ code: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomDoc | null>(null);

  useEffect(() => {
    if (!code) return;
    return onSnapshot(doc(db, 'rooms', code), snap => {
      if (!snap.exists()) { navigate('/play'); return; }
      setRoom(snap.data() as RoomDoc);
    });
  }, [code, navigate]);

  if (!room || !user) {
    return <div className="flex justify-center py-20 text-gray-400 text-sm">Loading…</div>;
  }

  const isHost = user.uid === room.hostId;
  const sortedPlayers = Object.entries(room.players).sort((a, b) => b[1].score - a[1].score);

  const advanceQuestion = async () => {
    const q = room.questions[room.currentQ];
    const updates: Record<string, unknown> = {};
    Object.entries(room.players).forEach(([uid, p]) => {
      if (p.answer === q.answerIndex) updates[`players.${uid}.score`] = p.score + 1000;
      updates[`players.${uid}.answer`] = null;
    });
    const next = room.currentQ + 1;
    if (next >= room.questions.length) {
      updates.status = 'done';
    } else {
      updates.currentQ = next;
    }
    await updateDoc(doc(db, 'rooms', code!), updates);
  };

  // ── Waiting ──
  if (room.status === 'waiting') {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <p className="text-sm text-gray-500 mb-1">Share this code with your friends</p>
          <p className="text-6xl font-black tracking-widest text-french-blue font-mono my-3">
            {code}
          </p>
          <p className="text-xs text-gray-400">{room.moduleTitle} · {room.questions.length} questions</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Players ({Object.keys(room.players).length})
          </p>
          {sortedPlayers.map(([uid, p]) => (
            <div key={uid} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-french-blue/10 flex items-center justify-center
                text-sm font-bold text-french-blue">
                {p.name[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-800">{p.name}</span>
              {uid === room.hostId && <span className="text-xs text-gray-400">host</span>}
            </div>
          ))}
        </div>

        {isHost ? (
          <button
            onClick={() => updateDoc(doc(db, 'rooms', code!), { status: 'question', currentQ: 0 })}
            className="w-full py-3 bg-green-500 text-white font-bold rounded-xl
              hover:bg-green-600 transition-colors text-lg"
          >
            Start Game →
          </button>
        ) : (
          <p className="text-center text-gray-400 text-sm">Waiting for the host to start…</p>
        )}
      </div>
    );
  }

  // ── Question ──
  if (room.status === 'question') {
    const q = room.questions[room.currentQ];
    const myAnswer = room.players[user.uid]?.answer ?? null;
    const answeredCount = Object.values(room.players).filter(p => p.answer !== null).length;
    const totalPlayers = Object.keys(room.players).length;
    const allAnswered = answeredCount === totalPlayers;

    return (
      <div className="max-w-lg mx-auto space-y-5">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Question {room.currentQ + 1} / {room.questions.length}</span>
          <span>{answeredCount}/{totalPlayers} answered</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-french-blue transition-all"
            style={{ width: `${((room.currentQ + 1) / room.questions.length) * 100}%` }}
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
          <p className="text-lg font-semibold text-gray-800">{q.prompt}</p>
          {q.hint && <p className="text-sm text-gray-400 mt-1 italic">{q.hint}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {q.choices.map((choice, i) => {
            const selected = myAnswer === i;
            const revealed = myAnswer !== null;
            const correct = i === q.answerIndex;

            let cls = `${CHOICE_STYLE[i].base} text-white`;
            if (!revealed) cls += ` ${CHOICE_STYLE[i].hover} cursor-pointer`;
            if (revealed) {
              if (correct) cls = 'bg-green-500 text-white ring-4 ring-green-300';
              else if (selected) cls = 'bg-red-500 text-white';
              else cls = `${CHOICE_STYLE[i].base} text-white opacity-40`;
            }

            return (
              <button
                key={i}
                onClick={async () => {
                  if (myAnswer !== null) return;
                  await updateDoc(doc(db, 'rooms', code!), {
                    [`players.${user.uid}.answer`]: i,
                  });
                }}
                disabled={myAnswer !== null}
                className={`${cls} font-semibold py-5 px-4 rounded-xl transition-all
                  text-sm text-center min-h-[72px] flex items-center justify-center gap-1
                  disabled:cursor-default`}
              >
                {choice}
                {revealed && correct && ' ✓'}
                {revealed && selected && !correct && ' ✗'}
              </button>
            );
          })}
        </div>

        {isHost && (
          <div className="flex items-center justify-between pt-1">
            <p className="text-sm text-gray-400">
              {allAnswered ? '✓ Everyone answered' : `${answeredCount}/${totalPlayers} answered`}
            </p>
            <button
              onClick={advanceQuestion}
              className="px-5 py-2 bg-french-blue text-white text-sm font-semibold rounded-xl
                hover:bg-blue-800 transition-colors"
            >
              {room.currentQ + 1 >= room.questions.length ? 'Finish →' : 'Next →'}
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Standings</p>
          {sortedPlayers.map(([uid, p], i) => (
            <div key={uid} className={`flex items-center gap-3 ${uid === user.uid ? 'font-semibold' : ''}`}>
              <span className="text-xs text-gray-400 w-4 shrink-0">{i + 1}</span>
              <span className="flex-1 text-sm text-gray-800 truncate">{p.name}</span>
              <span className="text-sm font-medium text-yellow-600 shrink-0">{p.score}</span>
              {p.answer !== null && <span className="text-green-500 text-xs shrink-0">✓</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Done ──
  return (
    <div className="max-w-md mx-auto space-y-6 text-center">
      <div>
        <p className="text-5xl">🏆</p>
        <h2 className="text-2xl font-bold text-gray-800 mt-3">Game Over!</h2>
        <p className="text-gray-500 text-sm mt-1">{room.moduleTitle}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {sortedPlayers.map(([uid, p], i) => (
          <div
            key={uid}
            className={`flex items-center gap-4 px-5 py-3 ${
              i < sortedPlayers.length - 1 ? 'border-b border-gray-100' : ''
            } ${uid === user.uid ? 'bg-french-blue/5' : ''}`}
          >
            <span className="text-xl w-8 text-center">
              {['🥇', '🥈', '🥉'][i] ?? <span className="text-sm text-gray-400">{i + 1}</span>}
            </span>
            <span className="flex-1 text-left font-medium text-gray-800">
              {p.name}
              {uid === user.uid && <span className="text-french-blue text-xs ml-2">(you)</span>}
            </span>
            <span className="font-bold text-yellow-600">{p.score}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-center">
        <Link
          to="/"
          className="px-5 py-2.5 bg-french-blue text-white text-sm font-semibold rounded-xl
            hover:bg-blue-800 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          to="/leaderboard"
          className="px-5 py-2.5 bg-yellow-500 text-white text-sm font-semibold rounded-xl
            hover:bg-yellow-600 transition-colors"
        >
          🏆 Leaderboard
        </Link>
      </div>
    </div>
  );
}
