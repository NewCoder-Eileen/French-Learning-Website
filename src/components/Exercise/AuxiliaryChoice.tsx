import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AuxiliaryChoiceExercise } from '../../content/types';
import { checkAnswer } from '../../utils/answerCheck';
import { FeedbackBadge } from './FeedbackBadge';

interface Props {
  exercise: AuxiliaryChoiceExercise;
  onResult: (correct: boolean) => void;
}

const AUX_OPTIONS = ['ai', 'as', 'a', 'avons', 'avez', 'ont', 'suis', 'es', 'est', 'sommes', 'êtes', 'sont'];

export function AuxiliaryChoice({ exercise, onResult }: Props) {
  const [aux, setAux] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setAux('');
    setSubmitted(false);
  }, [exercise.id]);

  const auxResult = submitted ? checkAnswer(aux, exercise.auxAccepted) : null;
  const allCorrect = auxResult?.status === 'correct';

  const handleSubmit = () => {
    if (!aux) return;
    setSubmitted(true);
    onResult(checkAnswer(aux, exercise.auxAccepted).status === 'correct');
  };

  // Build sentence nodes: ___ = aux blank
  const parts = exercise.sentence.split('___');

  const borderClass = (res: ReturnType<typeof checkAnswer> | null) => {
    if (!res) return 'border-gray-300';
    if (res.status === 'correct') return 'border-green-500 bg-green-50';
    if (res.status === 'accent-error') return 'border-yellow-500 bg-yellow-50';
    return 'border-red-500 bg-red-50';
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
        Choose the correct auxiliary verb
      </p>
      <p className="text-lg leading-relaxed text-gray-800 flex flex-wrap items-baseline gap-y-1">
        <span>{parts[0]}</span>
        <span className="inline-block mx-1">
          <select
            value={aux}
            onChange={(e) => { if (!submitted) setAux(e.target.value); }}
            disabled={submitted}
            aria-label="Auxiliary verb"
            className={`border-b-2 bg-transparent outline-none font-semibold px-1 transition-colors
              cursor-pointer appearance-none text-center ${borderClass(auxResult)}`}
          >
            <option value="">—</option>
            {AUX_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </span>
        {parts[1] && <span>{parts[1]}</span>}
      </p>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <FeedbackBadge result={auxResult!} accepted={exercise.auxAccepted} />
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-200">
              {exercise.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!aux}
          className="px-5 py-2 bg-french-blue text-white rounded-lg font-medium
            hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors
            focus:outline-none focus:ring-2 focus:ring-french-blue focus:ring-offset-2"
        >
          Check
        </button>
      )}
    </div>
  );
}
