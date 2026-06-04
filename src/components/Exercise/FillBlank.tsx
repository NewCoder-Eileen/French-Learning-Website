import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FillBlankExercise } from '../../content/types';
import { checkAnswer } from '../../utils/answerCheck';
import { FeedbackBadge } from './FeedbackBadge';
import { AccentBar } from '../AccentBar';

interface Props {
  exercise: FillBlankExercise;
  onResult: (correct: boolean) => void;
}

export function FillBlank({ exercise, onResult }: Props) {
  const blankCount = (exercise.sentence.match(/___/g) ?? []).length;
  const [inputs, setInputs] = useState<string[]>(Array(blankCount).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [tried, setTried] = useState(false);
  const [focusedBlank, setFocusedBlank] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setInputs(Array(blankCount).fill(''));
    setSubmitted(false);
    setTried(false);
    setFocusedBlank(0);
    inputRefs.current[0]?.focus();
  }, [exercise.id, blankCount]);

  const results = submitted
    ? inputs.map((inp, i) => checkAnswer(inp, exercise.blanks[i] ?? []))
    : null;

  const allCorrect = results?.every((r) => r.status === 'correct') ?? false;

  const handleSubmit = () => {
    if (inputs.some((v) => v.trim() === '')) return;
    setSubmitted(true);
    setTried(true);
    const correct = inputs.every((inp, i) =>
      checkAnswer(inp, exercise.blanks[i] ?? []).status === 'correct'
    );
    onResult(correct);
  };

  const handleRetry = () => {
    setInputs(Array(blankCount).fill(''));
    setSubmitted(false);
    inputRefs.current[0]?.focus();
  };

  // Render sentence with inputs in place of ___
  const parts = exercise.sentence.split('___');
  const sentenceNodes: React.ReactNode[] = [];
  parts.forEach((part, i) => {
    sentenceNodes.push(<span key={`part-${i}`}>{part}</span>);
    if (i < blankCount) {
      const res = results?.[i];
      const borderColor = !submitted
        ? 'border-gray-300 focus:border-french-blue'
        : res?.status === 'correct'
          ? 'border-green-500 bg-green-50'
          : res?.status === 'accent-error'
            ? 'border-yellow-500 bg-yellow-50'
            : 'border-red-500 bg-red-50';

      sentenceNodes.push(
        <span key={`inp-${i}`} className="inline-block mx-1">
          <input
            ref={(el) => { inputRefs.current[i] = el; }}
            value={inputs[i]}
            onChange={(e) => {
              if (submitted) return;
              const next = [...inputs];
              next[i] = e.target.value;
              setInputs(next);
            }}
            onFocus={() => setFocusedBlank(i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            disabled={submitted}
            aria-label={`Blank ${i + 1}`}
            className={`border-b-2 bg-transparent outline-none text-center font-semibold
              transition-colors px-1 min-w-[7rem] ${borderColor}`}
            style={{ width: `${Math.max(7, (exercise.blanks[i]?.[0]?.length ?? 5) + 2)}ch` }}
          />
        </span>
      );
    }
  });

  // Create a synthetic ref pointing to the currently focused blank for AccentBar
  const focusedRef = { current: inputRefs.current[focusedBlank] } as React.RefObject<HTMLInputElement>;

  return (
    <div className="space-y-4">
      <p className="text-lg leading-relaxed text-gray-800 flex flex-wrap items-baseline gap-y-1">
        {sentenceNodes}
      </p>

      {!submitted && (
        <AccentBar
          inputRef={focusedRef}
          value={inputs[focusedBlank] ?? ''}
          onChange={(val) => {
            const next = [...inputs];
            next[focusedBlank] = val;
            setInputs(next);
          }}
        />
      )}

      <p className="text-sm text-gray-500 italic">Hint: {exercise.hint}</p>

      <AnimatePresence mode="wait">
        {submitted && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {results?.map((res, i) => (
              <FeedbackBadge
                key={i}
                result={res}
                accepted={exercise.blanks[i] ?? []}
              />
            ))}
            {allCorrect ? (
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-200">
                {exercise.explanation}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-200">
                  {exercise.explanation}
                </p>
                <button
                  onClick={handleRetry}
                  className="self-start text-sm font-medium text-french-blue underline underline-offset-2 hover:text-blue-800"
                >
                  Try again
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={inputs.some((v) => v.trim() === '')}
          className="mt-2 px-5 py-2 bg-french-blue text-white rounded-lg font-medium
            hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors
            focus:outline-none focus:ring-2 focus:ring-french-blue focus:ring-offset-2"
        >
          Check
        </button>
      )}

      {submitted && !allCorrect && tried && (
        <p className="text-xs text-gray-400">
          You can keep retrying — only the first attempt counts for scoring.
        </p>
      )}
    </div>
  );
}
