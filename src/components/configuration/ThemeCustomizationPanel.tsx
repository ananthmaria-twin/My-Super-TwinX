import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Eye,
  Check,

  Shield,

  Palette,
  RotateCcw,
} from 'lucide-react';
import { themeService, type ThemeMode } from '../../services/themeService';

interface ThemeOption {
  id: ThemeMode;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  wcagLevel: 'WCAG AA' | 'WCAG AAA';
  contrastRatio: string;
  bgPreview: string;
  cardPreview: string;
  textPreview: string;
  borderPreview: string;
  badgeColor: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'light',
    name: 'Light Operational',
    subtitle: 'Standard Daytime Mode',
    description: 'Crisp high-contrast light theme optimized for day shifts and standard desktop monitors.',
    icon: Sun,
    wcagLevel: 'WCAG AA',
    contrastRatio: '4.8 : 1',
    bgPreview: 'bg-[#f8fafc]',
    cardPreview: 'bg-white',
    textPreview: 'text-slate-900',
    borderPreview: 'border-slate-200',
    badgeColor: 'bg-indigo-100 text-indigo-800',
  },
  {
    id: 'dark',
    name: 'Dark Mission Control',
    subtitle: 'NOC & Low-Light Environments',
    description: 'Deep space palette minimizing ocular fatigue during continuous 24/7 telemetry monitoring.',
    icon: Moon,
    wcagLevel: 'WCAG AA',
    contrastRatio: '6.2 : 1',
    bgPreview: 'bg-[#0b0f19]',
    cardPreview: 'bg-[#131d31]',
    textPreview: 'text-slate-100',
    borderPreview: 'border-slate-700',
    badgeColor: 'bg-indigo-900/80 text-indigo-200',
  },
  {
    id: 'contrast',
    name: 'High Contrast',
    subtitle: 'Maximum Legibility & Accessibility',
    description: 'Pitch-black canvas with bold 2px boundaries and luminous typography for visual accessibility.',
    icon: Eye,
    wcagLevel: 'WCAG AAA',
    contrastRatio: '14.5 : 1',
    bgPreview: 'bg-black',
    cardPreview: 'bg-[#0a0a0a]',
    textPreview: 'text-white',
    borderPreview: 'border-white',
    badgeColor: 'bg-yellow-400 text-black font-black',
  },
];

export default function ThemeCustomizationPanel() {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(themeService.getTheme());
  const [justChanged, setJustChanged] = useState<boolean>(false);

  useEffect(() => {
    const unsub = themeService.subscribe((theme) => {
      setCurrentTheme(theme);
    });
    return () => unsub();
  }, []);

  const handleSelectTheme = (theme: ThemeMode) => {
    themeService.setTheme(theme);
    setJustChanged(true);
    setTimeout(() => setJustChanged(false), 2500);
  };

  return (
    <div
      id="twinx-theme-customization-panel"
      className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1.5 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
              <Palette className="w-3 h-3 text-indigo-600" />
              <span>Appearance & Accessibility</span>
            </span>
            {justChanged && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full animate-in fade-in">
                Preference Saved in LocalStorage
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-1">
            System Theme Customization
          </h3>
          <p className="text-xs text-slate-500 max-w-2xl">
            Toggle between system-wide themes. Your choice persists across browser sessions and applies to all navigation modules, canvas builders, and analytical charts.
          </p>
        </div>

        <button
          onClick={() => handleSelectTheme('light')}
          className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
          title="Reset theme to default light mode"
        >
          <RotateCcw className="w-3 h-3 text-slate-400" />
          <span>Reset Default</span>
        </button>
      </div>

      {/* 3 Theme Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {THEME_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isActive = currentTheme === opt.id;

          return (
            <div
              key={opt.id}
              onClick={() => handleSelectTheme(opt.id)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between relative space-y-4 ${
                isActive
                  ? 'border-[#1a237e] bg-indigo-50/20 shadow-md ring-2 ring-[#1a237e]/20'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              {/* Top Row: Icon, Title, Active Checkmark */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-[#1a237e] text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {isActive ? (
                    <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>ACTIVE</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      Select
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900">{opt.name}</h4>
                <p className="text-[11px] font-medium text-slate-500">{opt.subtitle}</p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {opt.description}
                </p>
              </div>

              {/* Miniature Interactive Preview Swatch */}
              <div
                className={`p-3 rounded-lg border ${opt.borderPreview} ${opt.bgPreview} space-y-2 select-none`}
              >
                <div
                  className={`p-2 rounded border ${opt.borderPreview} ${opt.cardPreview} flex items-center justify-between shadow-2xs`}
                >
                  <div className="space-y-0.5">
                    <span className={`text-[10px] font-bold block ${opt.textPreview}`}>
                      Twin Health Score
                    </span>
                    <span className="text-[9px] font-mono text-emerald-500">
                      98.4% Nominal
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${opt.badgeColor}`}
                  >
                    Live
                  </span>
                </div>
              </div>

              {/* Bottom Specs: WCAG & Contrast Ratio */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="flex items-center space-x-1">
                  <Shield className="w-3 h-3 text-slate-400" />
                  <span>{opt.wcagLevel}</span>
                </span>
                <span className="font-bold text-slate-800">
                  Contrast: {opt.contrastRatio}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
