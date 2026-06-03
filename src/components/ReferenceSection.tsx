import type { ReferenceSection as ReferenceSectionType } from '../content/types';

interface Props {
  sections: ReferenceSectionType[];
}

export function ReferenceSection({ sections }: Props) {
  return (
    <div className="space-y-8">
      {sections.map((section, si) => (
        <div key={si} className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
            {section.title}
          </h3>

          {section.body && (
            <p className="text-gray-600 leading-relaxed">{section.body}</p>
          )}

          {section.rules && (
            <ul className="space-y-1.5">
              {section.rules.map((rule, ri) => (
                <li key={ri} className="flex gap-2 text-gray-600">
                  <span className="text-french-blue mt-0.5 shrink-0">›</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          )}

          {section.tables?.map((table, ti) => (
            <div key={ti} className="space-y-2">
              {table.title && (
                <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                  {table.title}
                </h4>
              )}
              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-french-blue text-white">
                      {table.headers.map((h, hi) => (
                        <th
                          key={hi}
                          className="px-4 py-2.5 text-left font-semibold tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, ri) => (
                      <tr
                        key={ri}
                        className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="px-4 py-2.5 font-semibold text-french-blue">
                          {row.label}
                        </td>
                        {row.cells.map((cell, ci) => (
                          <td key={ci} className="px-4 py-2.5 text-gray-700">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {table.note && (
                <p className="text-xs text-gray-400 italic mt-1">{table.note}</p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
