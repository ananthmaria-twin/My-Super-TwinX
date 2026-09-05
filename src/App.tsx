import { useState, useEffect } from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import DigitalTwinsModule from './components/digital-twins/DigitalTwinsModule';
import CatalogModule from './components/catalog/CatalogModule';
import PipelinesModule from './components/pipelines/PipelinesModule';
import StudioModule from './components/studio/StudioModule';
import DataSourcesModule from './components/datasources/DataSourcesModule';
import LiveFeaturesModule from './components/livefeatures/LiveFeaturesModule';
import NotebooksModule from './components/notebooks/NotebooksModule';
import OperationsModule from './components/operations/OperationsModule';
import ConfigurationModule from './components/configuration/ConfigurationModule';
import GlobalSearchModal from './components/common/GlobalSearchModal';
import DocumentationModal from './components/common/DocumentationModal';
import AssistantDrawer from './components/common/AssistantDrawer';
import BreadcrumbTrail from './components/common/BreadcrumbTrail';
import QuickActionsModal from './components/common/QuickActionsModal';
import SkeletonLoader from './components/common/SkeletonLoader';
import type { NavModuleId } from './types';
import { DIGITAL_TWIN_ENTITIES } from './data/mockData';
import { alertService } from './services/alertService';
import { themeService } from './services/themeService';

export default function App() {
  const [currentModule, setCurrentModule] = useState<NavModuleId>('digitaltwins');
  const [configResetKey, setConfigResetKey] = useState<number>(0);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState<boolean>(false);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isLoadingModule, setIsLoadingModule] = useState<boolean>(false);
  const [unacknowledgedAlertsCount, setUnacknowledgedAlertsCount] = useState<number>(0);

  // Initialize theme service on startup
  useEffect(() => {
    themeService.getTheme();
  }, []);

  useEffect(() => {
    const unsubscribe = alertService.subscribe((alerts) => {
      const unack = alerts.filter((a) => !a.acknowledged).length;
      setUnacknowledgedAlertsCount(unack);
    });
    return () => unsubscribe();
  }, []);

  const handleSelectModule = (mod: NavModuleId) => {
    if (mod === 'configuration') {
      setConfigResetKey((prev) => prev + 1);
    }
    // Trigger skeleton loading state for realistic perceived performance
    setIsLoadingModule(true);
    setCurrentModule(mod);
    const timer = setTimeout(() => {
      setIsLoadingModule(false);
    }, 420);
    return () => clearTimeout(timer);
  };

  // Global hotkeys: Cmd+K for search, Cmd+J for Quick Actions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsQuickActionsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Global Top Application Header */}
      <Header
        currentModule={currentModule}
        onSelectModule={handleSelectModule}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenQuickActions={() => setIsQuickActionsOpen(true)}
        activeTwinCount={DIGITAL_TWIN_ENTITIES.length}
      />

      {/* Main Structural Shell */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left-Menu Navigation Sidebar */}
        <Sidebar
          currentModule={currentModule}
          onSelectModule={handleSelectModule}
          collapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Breadcrumb Navigation Trail */}
            <BreadcrumbTrail
              currentModule={currentModule}
              onSelectModule={handleSelectModule}
            />

            {isLoadingModule ? (
              <SkeletonLoader module={currentModule} />
            ) : (
              <>
                {currentModule === 'digitaltwins' && <DigitalTwinsModule />}
                {currentModule === 'catalog' && <CatalogModule />}
                {currentModule === 'pipelines' && <PipelinesModule />}
                {currentModule === 'studio' && <StudioModule />}
                {currentModule === 'datasources' && <DataSourcesModule />}
                {currentModule === 'livefeatures' && <LiveFeaturesModule />}
                {currentModule === 'notebooks' && <NotebooksModule />}
                {currentModule === 'operations' && <OperationsModule />}
                {currentModule === 'configuration' && (
                  <ConfigurationModule
                    key={configResetKey}
                    resetKey={configResetKey}
                    onNavigateToModule={handleSelectModule}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Minimized Floating TwinX Copilot Assistant Button (Hover transforms to full design, click opens drawer) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          id="btn-trigger-assistant-copilot"
          onClick={() => setIsAssistantOpen(true)}
          className={`group relative text-white rounded-full shadow-lg hover:shadow-2xl flex items-center transition-all duration-300 ease-out cursor-pointer hover:scale-105 active:scale-95 p-3 ${
            unacknowledgedAlertsCount > 0
              ? 'bg-rose-700 hover:bg-rose-800 ring-2 ring-rose-400/80 shadow-rose-900/20'
              : 'bg-[#1a237e] hover:bg-[#121858] ring-2 ring-indigo-400/40 shadow-indigo-950/30'
          }`}
          title={
            unacknowledgedAlertsCount > 0
              ? `${unacknowledgedAlertsCount} Critical Twin Health Alert active! Hover to view, click to inspect.`
              : 'Open TwinX AI Copilot'
          }
        >
          {/* Minimized corner badge when NOT hovered */}
          {unacknowledgedAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-rose-700 text-[10px] font-black flex items-center justify-center shadow-md border border-rose-200 group-hover:opacity-0 group-hover:scale-75 transition-all">
              {unacknowledgedAlertsCount}
            </span>
          )}

          {/* Icon */}
          <div className="shrink-0 flex items-center justify-center">
            {unacknowledgedAlertsCount > 0 ? (
              <AlertCircle className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5 text-indigo-200 animate-pulse" />
            )}
          </div>

          {/* Expanding Label & Badge Container on Hover */}
          <div className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:pl-2 group-hover:pr-1 overflow-hidden transition-all duration-300 ease-out flex items-center space-x-2 whitespace-nowrap">
            <span className="text-xs font-semibold tracking-wide">
              {unacknowledgedAlertsCount > 0
                ? `TwinX Alerts (${unacknowledgedAlertsCount})`
                : 'TwinX Copilot'}
            </span>
            {unacknowledgedAlertsCount > 0 && (
              <span className="bg-white text-rose-700 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
                {unacknowledgedAlertsCount}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Global Quick Actions Palette Modal (Cmd+J / Ctrl+J) */}
      <QuickActionsModal
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
        onNavigate={(mod) => handleSelectModule(mod)}
        onOpenCopilot={() => setIsAssistantOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
      />

      {/* Global Command Palette Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(mod) => setCurrentModule(mod)}
      />

      {/* Demo Documentation & Architecture Spec Modal */}
      <DocumentationModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      {/* TwinX AI Copilot Assistant Drawer */}
      <AssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </div>
  );
}
