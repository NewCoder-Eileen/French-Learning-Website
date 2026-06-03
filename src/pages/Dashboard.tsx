import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { modules } from '../content';
import type { ModuleProgress } from '../hooks/useProgress';
import { ProgressRing } from '../components/ProgressRing';

interface Props {
  getModule: (id: string) => ModuleProgress;
  totalXp: number;
  weakestModuleId: (ids: string[]) => string | null;
}

export function Dashboard({ getModule, totalXp, weakestModuleId }: Props) {
  const moduleIds = modules.map((m) => m.id);
  const weakest = weakestModuleId(moduleIds);
  const weakestModule = modules.find((m) => m.id === weakest);

  const totalMastery = Math.round(
    modules.reduce((sum, m) => sum + (getModule(m.id).mastery ?? 0), 0) / modules.length
  );

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center space-y-2 py-6">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Bonjour! 👋
        </h1>
        <p className="text-gray-500 text-lg">
          Your French grammar practice hub. Pick a module and drill it.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total XP', value: `${totalXp}`, icon: '⚡' },
          { label: 'Overall Mastery', value: `${totalMastery}%`, icon: '🎯' },
          { label: 'Modules', value: `${modules.length}`, icon: '📚' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-sm"
          >
            <div className="text-2xl mb-1" aria-hidden="true">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Weakest skill suggestion */}
      {weakestModule && getModule(weakestModule.id).mastery < 100 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-french-red/5 border border-french-red/20 rounded-2xl p-4 flex items-center gap-4"
        >
          <span className="text-3xl" aria-hidden="true">💡</span>
          <div className="flex-1">
            <p className="font-semibold text-gray-800">Suggested: {weakestModule.title}</p>
            <p className="text-sm text-gray-500">
              Your weakest skill right now — keep drilling!
            </p>
          </div>
          <Link
            to={`/module/${weakestModule.slug}`}
            className="px-4 py-2 bg-french-red text-white rounded-xl text-sm font-semibold
              hover:bg-red-700 transition-colors focus:outline-none focus:ring-2
              focus:ring-french-red focus:ring-offset-2"
          >
            Practice
          </Link>
        </motion.div>
      )}

      {/* Module grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">All Modules</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod, i) => {
            const prog = getModule(mod.id);
            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/module/${mod.slug}`}
                  className="flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm
                    hover:shadow-md hover:border-french-blue/40 transition-all p-5 gap-4 group
                    focus:outline-none focus:ring-2 focus:ring-french-blue focus:ring-offset-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl" aria-hidden="true">{mod.icon}</span>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Module {i + 1}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-800 group-hover:text-french-blue transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-gray-400">{mod.subtitle}</p>
                    </div>
                    <ProgressRing pct={prog.mastery} size={56} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{prog.xp} XP</span>
                      <span>{mod.exercises.length} exercises</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-french-blue rounded-full transition-all"
                        style={{ width: `${prog.mastery}%` }}
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
