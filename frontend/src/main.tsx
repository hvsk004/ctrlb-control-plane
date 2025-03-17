import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import '@fontsource/sansita'
import "./index.css";
import { PipelineStatusProvider } from './context/usePipelineStatus.tsx';
import { Toaster } from './components/ui/toaster.tsx';
import { AgentValuesProvider } from './context/useAgentsValues.tsx';
import { PipelineOverviewProvider } from './context/usePipelineDetailContext.tsx';
import { NodeValueProvider } from './context/useNodeContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PipelineStatusProvider>
      <AgentValuesProvider>
        <PipelineOverviewProvider>
          <NodeValueProvider>
            <App />
          </NodeValueProvider>
        </PipelineOverviewProvider>
      </AgentValuesProvider>
    </PipelineStatusProvider>
    <Toaster />
  </StrictMode>,
)
