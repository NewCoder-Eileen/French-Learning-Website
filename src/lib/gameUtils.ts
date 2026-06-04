import type { Module } from '../content/types';

export interface GameQuestion {
  id: string;
  prompt: string;
  hint?: string;
  choices: string[];
  answerIndex: number;
}

export interface PlayerState {
  name: string;
  score: number;
  answer: number | null;
}

export interface RoomDoc {
  hostId: string;
  hostName: string;
  moduleTitle: string;
  status: 'waiting' | 'question' | 'done';
  currentQ: number;
  questions: GameQuestion[];
  players: Record<string, PlayerState>;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function buildGameQuestions(module: Module, count = 10): GameQuestion[] {
  const answerPool: string[] = module.exercises.flatMap(e => {
    if (e.type === 'fill-blank' && e.blanks.length === 1) return [e.blanks[0][0]];
    if (e.type === 'translate') return [e.accepted[0]];
    return [];
  }).filter(Boolean);

  const questions: GameQuestion[] = [];

  for (const ex of shuffle(module.exercises)) {
    if (questions.length >= count) break;

    let correct = '';
    let prompt = '';
    let hint: string | undefined;

    if (ex.type === 'fill-blank' && ex.blanks.length === 1) {
      correct = ex.blanks[0][0];
      prompt = ex.sentence;
      hint = ex.hint;
    } else if (ex.type === 'translate') {
      correct = ex.accepted[0];
      prompt = `Translate: "${ex.prompt}"`;
      hint = ex.hint;
    } else {
      continue;
    }

    if (!correct) continue;
    const distractors = shuffle(answerPool.filter(a => a !== correct)).slice(0, 3);
    if (distractors.length < 3) continue;

    const choices = shuffle([correct, ...distractors]);
    questions.push({ id: ex.id, prompt, hint, choices, answerIndex: choices.indexOf(correct) });
  }

  return questions;
}
