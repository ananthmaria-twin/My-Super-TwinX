import { motion } from 'framer-motion';
import type { Entity } from '../../types';
import { entityIcons } from './entityIcons';
import { CountUp } from '../../components/CountUp';

interface EntityCardProps {
  entity: Entity;
  index: number;
  onOpen: (entity: Entity) => void;
}

export function EntityCard({ entity, index, onOpen }: EntityCardProps) {
  const Icon = entityIcons[entity.category];

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(entity)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="card-hover group relative overflow-hidden rounded-2xl border border-(--border-soft) bg-(--surface-raised) p-5 text-left"
    >
      <div className="absolute -right-8 -top-8 size-28 rounded-full bg-gradient-to-br from-twin-purple/20 to-twin-blue/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-twin-blue/15 via-twin-teal/15 to-twin-purple/15 ring-1 ring-(--border-soft)">
          <Icon size={19} className="text-twin-purple" />
        </div>
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium tabular-nums text-(--text-muted)">
          <CountUp value={entity.rows} /> rows
        </span>
      </div>

      <h3 className="relative mt-4 text-sm font-semibold text-(--text-primary)">{entity.name}</h3>

      <div className="relative mt-3 flex flex-wrap gap-1.5 overflow-hidden transition-all duration-300 max-h-6 group-hover:max-h-24">
        {entity.attributes.map((attr) => (
          <span
            key={attr.name}
            className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-(--text-muted) transition-colors group-hover:text-twin-teal"
          >
            {attr.name}
          </span>
        ))}
      </div>
    </motion.button>
  );
}
