import { useState } from 'react';
import { motion } from 'framer-motion';
import type { MultipleChoiceExercise } from '../../content/types';

interface Props {
  exercise: MultipleChoiceExercise;
  onResult: (correct: boolean) => void;
}

export function MultipleChoice({ exercise, onResult }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const submitted = selected !== null;
  const correct = selected === exercise.correct;

  const handleSelect = (i: number) => {
    if (submitted) return;
    setSelected(i);
    onResult(i === exercise.correct);
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-gray-800">{exercise.question}</p>

      <div className="grid gap-2" role="radiogroup" aria-label="Choose an answer">
        {exercise.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === exercise.correct;
          let optClass =
            'w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-french-blue focus:ring-offset-1';
          if (!submitted) {
            optClass += ' border-gray-200 hover:border-french-blue hover:bg-french-blue/5 cursor-pointer';
          } else if (isCorrect) {
            optClass += ' border-green-500 bg-green-50 text-green-800';
          } else if (isSelected && !isCorrect) {
            optClass += ' border-red-500 bg-red-50 text-red-800';
          } else {
            optClass += ' border-gray-200 opacity-60';
          }

          return (
            <button
              key={i}
              role="radio"
              aria-checked={isSelected}
              className={optClass}
              onClick={() => handleSelect(i)}
              disabled={submitted}
            >
              <span className="mr-2" aria-hidden="true">
                {submitted && isCorrect ? '✓ ' : submitted && isSelected ? '✗ ' : ''}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {submitted && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-200"
        >
          {exercise.explanation}
        </motion.p>
      )}
    </div>
  );
}
