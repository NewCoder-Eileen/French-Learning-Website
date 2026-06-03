export type ExerciseType =
  | 'fill-blank'
  | 'multiple-choice'
  | 'conjugation-table'
  | 'auxiliary-choice'
  | 'translate';

export interface FillBlankExercise {
  type: 'fill-blank';
  id: string;
  sentence: string; // Use ___ for blanks; supports multiple blanks with separate accepted arrays
  blanks: string[][]; // accepted answers per blank (order matches ___ occurrences)
  hint: string;
  explanation: string;
}

export interface MultipleChoiceExercise {
  type: 'multiple-choice';
  id: string;
  question: string;
  options: string[];
  correct: number; // index into options
  explanation: string;
}

export interface ConjugationTableExercise {
  type: 'conjugation-table';
  id: string;
  verb: string;
  tense: string;
  rows: { pronoun: string; accepted: string[] }[];
  hint?: string;
}

export interface AuxiliaryChoiceExercise {
  type: 'auxiliary-choice';
  id: string;
  sentence: string; // ___ = aux blank, ___ = pp blank (two blanks)
  auxAccepted: string[]; // accepted aux forms
  ppAccepted: string[]; // accepted past participle forms
  explanation: string;
}

export interface TranslateExercise {
  type: 'translate';
  id: string;
  prompt: string;
  accepted: string[];
  hint?: string;
  explanation: string;
}

export type Exercise =
  | FillBlankExercise
  | MultipleChoiceExercise
  | ConjugationTableExercise
  | AuxiliaryChoiceExercise
  | TranslateExercise;

export interface ReferenceTable {
  title: string;
  headers: string[];
  rows: { label: string; cells: string[] }[];
  note?: string;
}

export interface ReferenceSection {
  title: string;
  body?: string; // explanatory paragraph
  tables?: ReferenceTable[];
  rules?: string[];
}

export interface Module {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  color: string; // tailwind bg class for accent
  icon: string; // emoji
  reference: ReferenceSection[];
  exercises: Exercise[];
}
