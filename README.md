# Maîtrise — French Grammar Practice

An interactive French grammar revision site for FSF1D (Grade 9/10). 7 modules covering présent, adjectifs, verbes réfléchis, passé composé (avoir + être), futur simple, and futur proche.

## Quick start

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

## Deploy

**Vercel** — connect the repo; build command `npm run build`, output directory `dist`.  
**Netlify** — same: build command `npm run build`, publish directory `dist`.

No backend required — all progress is stored in `localStorage`.

## Project structure

```
src/
  content/          # All grammar content + exercises (data files)
    types.ts        # Shared TypeScript types
    module1-present.ts … module7-futur-proche.ts
  components/
    Exercise/       # Exercise engine + FillBlank, MultipleChoice, AuxiliaryChoice, Translate
    Layout.tsx
    ProgressRing.tsx
    ReferenceSection.tsx
  pages/
    Dashboard.tsx
    ModulePage.tsx
  hooks/
    useProgress.ts  # localStorage-backed XP / mastery / streak
  utils/
    answerCheck.ts  # Accent-aware answer normalization
```

## Adding content

1. Add exercises to the relevant `src/content/moduleN-*.ts` file following the typed `Exercise` union.
2. Accepted answers are arrays — list all valid forms (agreement variants, elision variants, etc.).
3. The exercise engine picks up new items automatically.
