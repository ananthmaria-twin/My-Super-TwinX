import { useState } from 'react';
import { motion } from 'framer-motion';
import { Topbar } from '../../components/Topbar';
import { entityGroups } from '../../data/entities';
import type { Entity } from '../../types';
import { EntityCard } from './EntityCard';
import { EntityModal } from './EntityModal';

interface DigitalTwinsSectionProps {
  onEntitySelect: (entity: Entity) => void;
}

export function DigitalTwinsSection({ onEntitySelect }: DigitalTwinsSectionProps) {
  const [active, setActive] = useState<Entity | null>(null);

  const openEntity = (entity: Entity) => {
    setActive(entity);
    onEntitySelect(entity);
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <Topbar
        title="Digital Twins"
        description="The available data model: entities, attributes, and populations. Entities, typed attributes, and relationships can be drawn from any pipeline. Data is seeded for MVP; production tables are loaded by upstream data pipelines."
      />

      <div className="flex-1 space-y-14 px-4 sm:px-8 py-8">
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-1 text-sm font-semibold uppercase tracking-widest text-twin-blue"
          >
            Core Entities
          </motion.h2>
          <p className="mb-5 text-sm text-(--text-muted)">Foundational rule and rate tables backing the twin layer.</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {entityGroups.core.map((entity, i) => (
              <EntityCard key={entity.id} entity={entity} index={i} onOpen={openEntity} />
            ))}
          </div>
        </section>

        <section>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="mb-1 text-lg font-semibold text-(--text-primary)"
          >
            Ontology &mdash; Entities &amp; Relationships
          </motion.h2>
          <p className="mb-5 text-sm text-(--text-muted)">
            Cross-industry population tables used across pipelines and use cases.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {entityGroups.ontology.map((entity, i) => (
              <EntityCard key={entity.id} entity={entity} index={i} onOpen={openEntity} />
            ))}
          </div>
        </section>
      </div>

      <EntityModal entity={active} onClose={() => setActive(null)} />
    </div>
  );
}
