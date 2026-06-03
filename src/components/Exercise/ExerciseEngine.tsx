import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Exercise, Module } from '../../content/types';
import { FillBlank } from './FillBlank';
import { MultipleChoice } from './MultipleChoice';
import { AuxiliaryChoice } from './AuxiliaryChoice';
import { Translate } from './Translate';

interface Props {
  module: Module;
  reviewMode?: boolean; // only serve missedExerciseIds
  missedIds?: string[];
  onResult: (exerciseId: string, correct: boolean) => void;
}

function ExerciseCard({ exercise, onResult }: { exercise: Exercise; onResult: (correct: boolean) => void }) {
  switch (exercise.type) {
    case 'fill-blank':
      return <FillBlank exercise={exercise} onResult={onResult} />;
    case 'multiple-choice':
      return <MultipleChoice exercise={exercise} onResult={onResult} />;
    case 'auxiliary-choice':
      return <AuxiliaryChoice exercise={exercise} onResult={onResult} />;
    case 'translate':
      return <Translate exercise={exercise} onResult={onResult} />;
    default:
      return <p className="text-gray-400 italic">Exercise type not yet implemented.</p>;
  }
}

export function ExerciseEngine({ module, reviewMode, missedIds, onResult }: Props) {
  // Snapshot the list once at mount so answers during the session don't mutate it.
  const [exercises] = useState<Exercise[]>(() =>
    reviewMode && missedIds?.length
      ? module.exercises.filter((e) => missedIds.includes(e.id))
      : module.exercises
  );

  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<{ id: string; correct: boolean }[]>([]);
  const [answered, setAnswered] = useState(false);
  const [done, setDone] = useState(false);

  const current = exercises[index];
  const score = results.filter((r) => r.correct).length;

  // Use a ref to guard against double-firing without stale closure issues.
  const answeredRef = useRef(false);
  const handleResult = useCallback(
    (correct: boolean) => {
      if (answeredRef.current) return;
      answeredRef.current = true;
      setAnswered(true);
      setResults((prev) => [...prev, { id: current.id, correct }]);
      onResult(current.id, correct);
    },
    [current?.id, onResult]
  );

  const handleNext = () => {
    if (index + 1 >= exercises.length) {
      setDone(true);
    } else {
      answeredRef.current = false;
      setIndex((i) => i + 1);
      setAnswered(false);
    }
  };

  if (exercises.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        {reviewMode ? 'No mistakes to review — great work!' : 'No exercises available.'}
      </div>
    );
  }

  if (done) {
    const pct = Math.round((score / exercises.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 space-y-4"
      >
        <div className="text-5xl">{pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚'}</div>
        <h3 className="text-2xl font-bold text-gray-800">
          {score}/{exercises.length} correct
        </h3>
        <p className="text-gray-500">
          {pct >= 80
            ? 'Excellent work! You\'ve mastered this section.'
            : pct >= 50
              ? 'Good effort — review your mistakes to improve.'
              : 'Keep practising — you\'ll get there!'}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-3 max-w-sm mx-auto">
          <div
            className="h-3 rounded-full bg-french-blue transition-all"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <p className="text-sm text-gray-400">{pct}% accuracy</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-gray-400">
          <span>{index + 1} / {exercises.length}</span>
          <span>{score} correct</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-french-blue transition-all"
            style={{ width: `${((index + 1) / exercises.length) * 100}%` }}
            role="progressbar"
            aria-valuenow={index + 1}
            aria-valuemin={0}
            aria-valuemax={exercises.length}
          />
        </div>
      </div>

      {/* Exercise card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
        >
          <ExerciseCard exercise={current} onResult={handleResult} />
        </motion.div>
      </AnimatePresence>

      {/* Next button */}
      {answered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-end"
        >
          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-french-blue text-white rounded-xl font-semibold
              hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2
              focus:ring-french-blue focus:ring-offset-2"
          >
            {index + 1 >= exercises.length ? 'Finish' : 'Next →'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
