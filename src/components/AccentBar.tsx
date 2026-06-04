const ACCENTS = ['é', 'è', 'ê', 'ë', 'à', 'â', 'ù', 'û', 'ô', 'î', 'ï', 'ç', 'œ'];

interface Props {
  inputRef: React.RefObject<HTMLInputElement>;
  value: string;
  onChange: (value: string) => void;
}

export function AccentBar({ inputRef, value, onChange }: Props) {
  const insert = (char: string) => {
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const next = value.slice(0, start) + char + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + 1, start + 1);
    });
  };

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {ACCENTS.map((c) => (
        <button
          key={c}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => insert(c)}
          className="w-8 h-8 text-sm font-semibold bg-white border border-gray-300 rounded-lg
            hover:bg-french-blue hover:text-white hover:border-french-blue
            transition-colors focus:outline-none focus:ring-1 focus:ring-french-blue"
        >
          {c}
        </button>
      ))}
    </div>
  );
}
