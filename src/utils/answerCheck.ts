export function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export type CheckResult =
  | { status: 'correct' }
  | { status: 'accent-error'; correct: string }
  | { status: 'wrong'; correct: string[] };

export function checkAnswer(userInput: string, accepted: string[]): CheckResult {
  const userNorm = normalize(userInput);

  // Exact match (case/space insensitive, accents preserved)
  if (accepted.some((a) => normalize(a) === userNorm)) {
    return { status: 'correct' };
  }

  // Accent-stripped match: user typed the right letters but wrong accents
  const userStripped = stripAccents(userNorm);
  if (accepted.some((a) => stripAccents(normalize(a)) === userStripped)) {
    return { status: 'accent-error', correct: accepted[0] };
  }

  return { status: 'wrong', correct: accepted };
}

export function checkMultipleBlanks(
  userInputs: string[],
  acceptedArrays: string[][]
): CheckResult[] {
  return userInputs.map((input, i) => checkAnswer(input, acceptedArrays[i] ?? []));
}
