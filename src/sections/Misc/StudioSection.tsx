import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sigma, UserRound, DollarSign, ShieldAlert, Sparkles } from 'lucide-react';
import { Topbar } from '../../components/Topbar';

const PALETTE = [
  { id: 'age', label: 'Age', icon: UserRound },
  { id: 'fees', label: 'Fees Charged', icon: DollarSign },
  { id: 'competitor', label: 'Competitor Pressure', icon: ShieldAlert },
  { id: 'calc', label: 'New Calculation', icon: Sigma },
];

export function StudioSection() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [hint, setHint] = useState<string | null>(null);

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <Topbar title="Studio" description="Design custom scenarios with drag-and-drop nodes and AI-suggested transformations." />

      <div className="px-4 sm:px-8 py-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-(--text-muted)">Node palette — drag onto the canvas</p>
        <div className="mb-5 flex flex-wrap gap-3">
          {PALETTE.map((item) => (
            <motion.div
              key={item.id}
              drag
              dragConstraints={constraintsRef}
              dragElastic={0.15}
              whileDrag={{ scale: 1.08, zIndex: 20 }}
              onDragEnd={() => setHint(`AI suggests linking "${item.label}" to the churn_risk calculation node →`)}
              className="glass-panel card-hover flex cursor-grab items-center gap-2 rounded-xl border border-(--border-soft) px-3.5 py-2.5 text-xs font-medium text-(--text-primary) active:cursor-grabbing"
            >
              <item.icon size={15} className="text-twin-purple" />
              {item.label}
            </motion.div>
          ))}
        </div>

        <div
          ref={constraintsRef}
          className="bg-mesh relative h-[420px] overflow-hidden rounded-2xl border border-dashed border-(--border-soft) bg-(--surface-raised)/30"
        >
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-(--text-muted)">
            Drop nodes here to compose a scenario
          </p>
        </div>

        {hint && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 rounded-xl border border-(--border-soft) bg-gradient-to-r from-twin-blue/10 to-twin-purple/10 px-4 py-3 text-xs text-(--text-secondary)"
          >
            <Sparkles size={14} className="shrink-0 text-twin-blue" /> {hint}
          </motion.div>
        )}
      </div>
    </div>
  );
}
