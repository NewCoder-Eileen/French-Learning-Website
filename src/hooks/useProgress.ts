import { useState, useEffect, useCallback } from 'react';

export interface ModuleProgress {
  mastery: number; // 0–100
  xp: number;
  streak: number;
  lastPracticed: string | null; // ISO date
  missedExerciseIds: string[];
}

export interface ProgressStore {
  [moduleId: string]: ModuleProgress;
}

const STORAGE_KEY = 'maitrise_progress';
const XP_PER_CORRECT = 10;

function defaultModuleProgress(): ModuleProgress {
  return { mastery: 0, xp: 0, streak: 0, lastPracticed: null, missedExerciseIds: [] };
}

function load(): ProgressStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressStore) : {};
  } catch {
    return {};
  }
}

function save(store: ProgressStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function useProgress() {
  const [store, setStore] = useState<ProgressStore>(load);

  useEffect(() => {
    save(store);
  }, [store]);

  const getModule = useCallback(
    (id: string): ModuleProgress => store[id] ?? defaultModuleProgress(),
    [store]
  );

  const recordResult = useCallback(
    (moduleId: string, exerciseId: string, correct: boolean, totalInModule: number) => {
      setStore((prev) => {
        const cur = prev[moduleId] ?? defaultModuleProgress();
        const today = new Date().toISOString().slice(0, 10);
        const isNewDay = cur.lastPracticed !== today;

        const newMissed = correct
          ? cur.missedExerciseIds.filter((id) => id !== exerciseId)
          : cur.missedExerciseIds.includes(exerciseId)
            ? cur.missedExerciseIds
            : [...cur.missedExerciseIds, exerciseId];

        const newXp = correct ? cur.xp + XP_PER_CORRECT : cur.xp;
        const newStreak = correct && isNewDay ? cur.streak + 1 : cur.streak;

        // mastery = fraction of exercises never missed (or cleared) out of total
        const mastery = Math.round(
          ((totalInModule - newMissed.length) / totalInModule) * 100
        );

        return {
          ...prev,
          [moduleId]: {
            mastery: Math.max(cur.mastery, mastery),
            xp: newXp,
            streak: newStreak,
            lastPracticed: today,
            missedExerciseIds: newMissed,
          },
        };
      });
    },
    []
  );

  const clearModule = useCallback((moduleId: string) => {
    setStore((prev) => ({ ...prev, [moduleId]: defaultModuleProgress() }));
  }, []);

  const totalXp = Object.values(store).reduce((sum, m) => sum + m.xp, 0);

  const weakestModuleId = (moduleIds: string[]): string | null => {
    if (!moduleIds.length) return null;
    return moduleIds.reduce((weakest, id) => {
      const wm = store[weakest]?.mastery ?? 0;
      const cm = store[id]?.mastery ?? 0;
      return cm < wm ? id : weakest;
    });
  };

  return { getModule, recordResult, clearModule, totalXp, weakestModuleId, store };
}
