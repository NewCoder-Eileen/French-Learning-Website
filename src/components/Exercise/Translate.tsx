import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TranslateExercise } from '../../content/types';
import { checkAnswer } from '../../utils/answerCheck';
import { FeedbackBadge } from './FeedbackBadge';
import { AccentBar } from '../AccentBar';

interface Props {
  exercise: TranslateExercise;
  onResult: (correct: boolean) => void;
}

export function Translate({ exercise, onResult }: Props) {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue('');
    setSubmitted(false);
    inputRef.current?.focus();
  }, [exercise.id]);

  const result = submitted ? checkAnswer(value, exercise.accepted) : null;

  const handleSubmit = () => {
    if (!value.trim()) return;
    setSubmitted(true);
    onResult(checkAnswer(value, exercise.accepted).status === 'correct');
  };

  const handleRetry = () => {
    setValue('');
    setSubmitted(false);
    inputRef.current?.focus();
  };

  const borderColor = !submitted
    ? 'border-gray-300 focus:border-french-blue'
    : result?.status === 'correct'
      ? 'border-green-500 bg-green-50'
      : result?.status === 'accent-error'
        ? 'border-yellow-500 bg-yellow-50'
        : 'border-red-500 bg-red-50';

  return (
    <div className="space-y-4">
      <div className="bg-french-blue/5 border border-french-blue/20 rounded-xl p-4">
        <p className="text-sm text-gray-500 mb-1">Translate into French:</p>
        <p className="text-lg font-medium text-gray-800">{exercise.prompt}</p>
        {exercise.hint && <p className="text-sm text-gray-400 mt-1 italic">Hint: {exercise.hint}</p>}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => { if (!submitted) setValue(e.target.value); }}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
        disabled={submitted}
        aria-label="Your French translation"
        placeholder="Écris ta réponse ici…"
        className={`w-full border-2 rounded-xl px-4 py-3 text-gray-800 outline-none
          transition-colors font-medium ${borderColor}`}
      />

      {!submitted && (
        <AccentBar inputRef={inputRef} value={value} onChange={setValue} />
      )}

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <FeedbackBadge result={result!} accepted={exercise.accepted} />
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-200">
              {exercise.explanation}
            </p>
            {result?.status !== 'correct' && (
              <button
                onClick={handleRetry}
                className="text-sm font-medium text-french-blue underline underline-offset-2 hover:text-blue-800"
              >
                Try again
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
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
