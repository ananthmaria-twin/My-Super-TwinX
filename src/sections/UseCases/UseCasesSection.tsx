import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Topbar } from '../../components/Topbar';
import { useCases } from '../../data/useCases';
import type { UseCase } from '../../types';
import { UseCaseCard } from './UseCaseCard';
import { CreateUseCaseModal } from './CreateUseCaseModal';

interface UseCasesSectionProps {
  onUseCaseSelect: (useCase: UseCase) => void;
  onOpenPipeline: (pipelineId: string) => void;
}

export function UseCasesSection({ onUseCaseSelect, onOpenPipeline }: UseCasesSectionProps) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <Topbar
        title="Use Cases"
        description="Business questions and the capabilities that answer them. A use case bundles capabilities mapped to the digital-twin layer. Derived features compute per-entity attributes when data updates; scenario execution capabilities run on demand."
        actions={
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-twin-blue to-twin-purple px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition-transform hover:scale-105"
          >
            <Plus size={14} /> Upload Use Case
          </button>
        }
      />

      <div className="grid flex-1 grid-cols-1 gap-4 px-4 sm:px-8 py-8 sm:grid-cols-2 xl:grid-cols-3">
        {useCases.map((uc, i) => (
          <UseCaseCard key={uc.id} useCase={uc} index={i} onOpen={onUseCaseSelect} onOpenPipeline={onOpenPipeline} />
        ))}
      </div>

      <CreateUseCaseModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
