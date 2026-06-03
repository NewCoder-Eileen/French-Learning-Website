import type { Module } from './types';

const module: Module = {
  id: 'module3',
  slug: 'reflechis',
  title: 'Les Verbes Réfléchis',
  subtitle: 'Reflexive verbs and their pronouns',
  color: 'bg-teal-600',
  icon: '🪞',
  reference: [
    {
      title: 'Reflexive Pronouns',
      body: 'Reflexive verbs describe actions done to oneself. They always use a reflexive pronoun that matches the subject.',
      tables: [
        {
          title: 'Reflexive Pronouns',
          headers: ['Subject', 'Reflexive Pronoun'],
          rows: [
            { label: 'je', cells: ['me (m\' before vowel)'] },
            { label: 'tu', cells: ['te (t\' before vowel)'] },
            { label: 'il / elle / on', cells: ['se (s\' before vowel)'] },
            { label: 'nous', cells: ['nous'] },
            { label: 'vous', cells: ['vous'] },
            { label: 'ils / elles', cells: ['se (s\' before vowel)'] },
          ],
        },
        {
          title: 'se brosser (to brush oneself)',
          headers: ['Person', 'Form'],
          rows: [
            { label: 'je', cells: ['me brosse'] },
            { label: 'tu', cells: ['te brosses'] },
            { label: 'il / elle / on', cells: ['se brosse'] },
            { label: 'nous', cells: ['nous brossons'] },
            { label: 'vous', cells: ['vous brossez'] },
            { label: 'ils / elles', cells: ['se brossent'] },
          ],
        },
        {
          title: "s'amuser (to have fun)",
          headers: ['Person', 'Form'],
          rows: [
            { label: 'je', cells: ["m'amuse"] },
            { label: 'tu', cells: ["t'amuses"] },
            { label: 'il / elle / on', cells: ["s'amuse"] },
            { label: 'nous', cells: ['nous amusons'] },
            { label: 'vous', cells: ['vous amusez'] },
            { label: 'ils / elles', cells: ["s'amusent"] },
          ],
        },
        {
          title: 'se lever (to get up)',
          headers: ['Person', 'Form'],
          rows: [
            { label: 'je', cells: ['me lève'] },
            { label: 'tu', cells: ['te lèves'] },
            { label: 'il / elle / on', cells: ['se lève'] },
            { label: 'nous', cells: ['nous levons'] },
            { label: 'vous', cells: ['vous levez'] },
            { label: 'ils / elles', cells: ['se lèvent'] },
          ],
          note: 'se lever has a stem change: e → è when stressed (all forms except nous/vous).',
        },
      ],
    },
  ],
  exercises: [
    {
      type: 'fill-blank',
      id: 'm3-e1',
      sentence: 'Nous ___.',
      blanks: [['nous dépêchons']],
      hint: 'se dépêcher (nous)',
      explanation: 'Reflexive: nous + nous + verb stem → nous nous dépêchons.',
    },
    {
      type: 'fill-blank',
      id: 'm3-e2',
      sentence: 'Je ___ le visage.',
      blanks: [['me rase']],
      hint: 'se raser (je)',
      explanation: 'se raser → je me rase (-ER ending, stem ras-).',
    },
    {
      type: 'fill-blank',
      id: 'm3-e3',
      sentence: 'Vous ___ les mains.',
      blanks: [['vous lavez']],
      hint: 'se laver (vous)',
      explanation: 'se laver → vous vous lavez.',
    },
    {
      type: 'fill-blank',
      id: 'm3-e4',
      sentence: 'Elles ___ les dents.',
      blanks: [['se brossent']],
      hint: 'se brosser (elles)',
      explanation: 'se brosser → elles se brossent (-ER ending, -ent for elles).',
    },
    {
      type: 'fill-blank',
      id: 'm3-e5',
      sentence: 'Luc ___ à 7h00.',
      blanks: [['se lève']],
      hint: 'se lever (il)',
      explanation: 'se lever (stem change) → il se lève (è when stressed).',
    },
    {
      type: 'fill-blank',
      id: 'm3-e6',
      sentence: 'Tu ___ après la douche.',
      blanks: [["t'habilles"]],
      hint: "s'habiller (tu) — elision before h",
      explanation: "s'habiller → tu t'habilles (te → t' before vowel/h).",
    },
  ],
};

export default module;
