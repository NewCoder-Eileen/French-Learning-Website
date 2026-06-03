import { useState, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { modules } from '../content';
import type { ModuleProgress } from '../hooks/useProgress';
import { ReferenceSection } from '../components/ReferenceSection';
import { ExerciseEngine } from '../components/Exercise/ExerciseEngine';
import { ProgressRing } from '../components/ProgressRing';

interface Props {
  getModule: (id: string) => ModuleProgress;
  recordResult: (moduleId: string, exerciseId: string, correct: boolean, total: number) => void;
}

type Tab = 'reference' | 'practice' | 'review';

export function ModulePage({ getModule, recordResult }: Props) {
  const { slug } = useParams<{ slug: string }>();
  const mod = modules.find((m) => m.slug === slug);

  if (!mod) return <Navigate to="/" replace />;

  const prog = getModule(mod.id);
  const [tab, setTab] = useState<Tab>('reference');

  const handleResult = useCallback(
    (exerciseId: string, correct: boolean) => {
      recordResult(mod.id, exerciseId, correct, mod.exercises.length);
    },
    [mod.id, mod.exercises.length, recordResult]
  );

  const tabs: { key: Tab; label: string }[] = [
    { key: 'reference', label: '📖 Reference' },
    { key: 'practice', label: '✏️ Practice' },
    ...(prog.missedExerciseIds.length > 0
      ? [{ key: 'review' as Tab, label: `🔁 Review Mistakes (${prog.missedExerciseIds.length})` }]
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Module header */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
              <span>{mod.icon}</span>
              <span>Module</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">{mod.title}</h1>
            <p className="text-gray-500">{mod.subtitle}</p>
          </div>
          <div className="text-center shrink-0">
            <ProgressRing pct={prog.mastery} size={72} />
            <p className="text-xs text-gray-400 mt-1">Mastery</p>
          </div>
        </div>

        {/* XP & streak */}
        <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-sm text-yellow-600 font-semibold">
            <span aria-hidden="true">⚡</span>
            {prog.xp} XP
          </div>
          {prog.streak > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-orange-500 font-semibold">
              <span aria-hidden="true">🔥</span>
              {prog.streak} day streak
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors
              focus:outline-none focus:ring-2 focus:ring-french-blue focus:ring-inset
              ${tab === t.key
                ? 'text-french-blue border-b-2 border-french-blue -mb-px bg-white'
                : 'text-gray-500 hover:text-gray-800'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
      >
        {tab === 'reference' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <ReferenceSection sections={mod.reference} />
          </div>
        )}

        {tab === 'practice' && (
          <ExerciseEngine
            module={mod}
            onResult={handleResult}
          />
        )}

        {tab === 'review' && (
          <ExerciseEngine
            module={mod}
            reviewMode
            missedIds={prog.missedExerciseIds}
            onResult={handleResult}
          />
        )}
      </motion.div>
    </div>
  );
}
