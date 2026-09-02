import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { Chatbot } from './components/Chatbot/Chatbot';
import { DigitalTwinsSection } from './sections/DigitalTwins/DigitalTwinsSection';
import { UseCasesSection } from './sections/UseCases/UseCasesSection';
import { PipelinesSection } from './sections/Pipelines/PipelinesSection';
import { LiveFeaturesSection } from './sections/Misc/LiveFeaturesSection';
import { StudioSection } from './sections/Misc/StudioSection';
import { ModelDriftSection } from './sections/Misc/ModelDriftSection';
import { MonitoringSection } from './sections/Misc/MonitoringSection';
import type { ChatContext, SectionId } from './types';

function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('pipelines');
  const [collapsed, setCollapsed] = useState(() => typeof window !== 'undefined' && window.innerWidth < 900);
  const [pipelineId, setPipelineId] = useState('usbank-churn');
  const [chatContext, setChatContext] = useState<ChatContext | null>({ type: 'section', section: 'pipelines' });

  const selectSection = (id: SectionId) => {
    setActiveSection(id);
    setChatContext({ type: 'section', section: id });
  };

  const openPipeline = (id: string) => {
    setPipelineId(id);
    setActiveSection('pipelines');
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-mesh">
        <Sidebar active={activeSection} onSelect={selectSection} collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />

        <main className="min-w-0 flex-1">
          {activeSection === 'digital-twins' && (
            <DigitalTwinsSection onEntitySelect={(entity) => setChatContext({ type: 'entity', entity })} />
          )}
          {activeSection === 'live-features' && <LiveFeaturesSection />}
          {activeSection === 'use-cases' && (
            <UseCasesSection
              onUseCaseSelect={(useCase) => setChatContext({ type: 'use-case', useCase })}
              onOpenPipeline={openPipeline}
            />
          )}
          {activeSection === 'pipelines' && (
            <PipelinesSection pipelineId={pipelineId} onPipelineChange={setPipelineId} onContext={setChatContext} />
          )}
          {activeSection === 'studio' && <StudioSection />}
          {activeSection === 'model-drift' && <ModelDriftSection />}
          {activeSection === 'monitoring' && <MonitoringSection />}
        </main>

        <Chatbot context={chatContext} />
      </div>
    </ThemeProvider>
  );
}

export default App;
