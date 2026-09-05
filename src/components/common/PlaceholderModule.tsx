
import { type LucideIcon } from 'lucide-react';

interface PlaceholderModuleProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function PlaceholderModule({ icon: Icon, title, description }: PlaceholderModuleProps) {
  return (
    <div
      id="placeholder-module"
      className="bg-white rounded-xl border border-slate-200 shadow-xs p-16 flex flex-col items-center justify-center text-center min-h-[420px]"
    >
      <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-slate-400" />
      </div>
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500 mt-2 max-w-md">{description}</p>
      <span className="mt-5 text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
        Not part of this demo
      </span>
    </div>
  );
}
