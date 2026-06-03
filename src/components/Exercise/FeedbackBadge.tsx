import type { CheckResult } from '../../utils/answerCheck';

interface Props {
  result: CheckResult;
  accepted: string[];
}

export function FeedbackBadge({ result, accepted }: Props) {
  if (result.status === 'correct') {
    return (
      <div className="flex items-center gap-2 text-green-700 font-medium text-sm" role="status" aria-label="Correct">
        <span aria-hidden="true">✓</span>
        <span>Correct!</span>
      </div>
    );
  }

  if (result.status === 'accent-error') {
    return (
      <div className="flex items-start gap-2 text-yellow-700 text-sm" role="alert">
        <span aria-hidden="true" className="mt-0.5">⚠</span>
        <span>
          Watch your accents. Correct: <strong>{result.correct}</strong>
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 text-red-700 text-sm" role="alert">
      <span aria-hidden="true" className="mt-0.5">✗</span>
      <span>
        Incorrect. Correct answer:{' '}
        <strong>{accepted.join(' / ')}</strong>
      </span>
    </div>
  );
}
