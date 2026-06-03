import type { Module } from './types';

const module: Module = {
  id: 'module2',
  slug: 'adjectifs',
  title: 'Les Adjectifs',
  subtitle: 'Adjective agreement in gender and number',
  color: 'bg-purple-600',
  icon: '✏️',
  reference: [
    {
      title: 'Agreement Rules',
      body: 'Adjectives in French agree with the noun they modify in both gender (masculine/feminine) and number (singular/plural). Most follow predictable patterns based on their ending.',
      rules: [
        'Add -e to make masculine adjectives feminine (if they don\'t already end in -e).',
        'Add -s to make singular adjectives plural.',
        'Some endings follow special patterns — learn these by group.',
      ],
      tables: [
        {
          title: 'Adjective Agreement Patterns',
          headers: ['Pattern', 'Masc. Sing.', 'Fém. Sing.', 'Masc. Pl.', 'Fém. Pl.'],
          rows: [
            { label: 'regular', cells: ['grand', 'grande', 'grands', 'grandes'] },
            { label: '-e (same)', cells: ['rouge', 'rouge', 'rouges', 'rouges'] },
            { label: '-if → -ive', cells: ['créatif', 'créative', 'créatifs', 'créatives'] },
            { label: '-eux → -euse', cells: ['curieux', 'curieuse', 'curieux', 'curieuses'] },
            { label: '-eur → -euse', cells: ['travailleur', 'travailleuse', 'travailleurs', 'travailleuses'] },
            { label: '-er → -ère', cells: ['cher', 'chère', 'chers', 'chères'] },
            { label: '-é → -ée', cells: ['discipliné', 'disciplinée', 'disciplinés', 'disciplinées'] },
            { label: '-il → -ille', cells: ['gentil', 'gentille', 'gentils', 'gentilles'] },
            { label: '-el → -elle', cells: ['cruel', 'cruelle', 'cruels', 'cruelles'] },
            { label: '-os → -osse', cells: ['gros', 'grosse', 'gros', 'grosses'] },
            { label: '-en → -enne', cells: ['ancien', 'ancienne', 'anciens', 'anciennes'] },
          ],
        },
      ],
    },
  ],
  exercises: [
    {
      type: 'fill-blank',
      id: 'm2-e1',
      sentence: 'La ___ fille est très ___.',
      blanks: [['gentille'], ['jeune']],
      hint: 'gentil (fém.) + jeune (invariable)',
      explanation: 'gentil → gentille (fem.); jeune ends in -e so it stays the same for both genders.',
    },
    {
      type: 'fill-blank',
      id: 'm2-e2',
      sentence: 'Nous sommes très ___.',
      blanks: [['sportifs']],
      hint: 'sportif (masc. pl.)',
      explanation: '-if → -ifs for masculine plural.',
    },
    {
      type: 'fill-blank',
      id: 'm2-e3',
      sentence: 'Ève est très ___ et elle peint de très ___ peintures.',
      blanks: [['créative'], ['belles']],
      hint: 'créatif (fém. sing.) + beau (fém. pl.)',
      explanation: 'créatif → créative (fem.); beau → belles (fem. pl.; beau is irregular).',
    },
    {
      type: 'fill-blank',
      id: 'm2-e4a',
      sentence: 'Il est très ___ et ___.',
      blanks: [['travailleur'], ['discipliné']],
      hint: 'travailleur (masc. sing.) + discipliné (masc. sing.)',
      explanation: 'Both adjectives agree with the masculine singular subject il.',
    },
    {
      type: 'fill-blank',
      id: 'm2-e4b',
      sentence: 'Lucy n\'est pas ___ ni ___.',
      blanks: [['travailleuse'], ['disciplinée']],
      hint: 'travailleur (fém. sing.) + discipliné (fém. sing.)',
      explanation: 'travailleur → travailleuse (fem.); discipliné → disciplinée (fem.).',
    },
    {
      type: 'fill-blank',
      id: 'm2-e5',
      sentence: 'Les filles sont ___.',
      blanks: [['bavardes']],
      hint: 'bavard (fém. pl.)',
      explanation: 'bavard → bavardes (fem. pl.): add -e then -s.',
    },
  ],
};

export default module;
