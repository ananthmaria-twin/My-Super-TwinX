import type { ReactNode } from 'react';
import { ThemeToggle } from './ThemeToggle';

interface TopbarProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function Topbar({ title, description, actions }: TopbarProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-(--border-soft) px-4 sm:px-8 py-6">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-semibold tracking-tight text-(--text-primary)">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-(--text-secondary)">{description}</p>}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <ThemeToggle />
      </div>
    </header>
  );
}
