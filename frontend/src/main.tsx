import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import "./index.css";
import { PipelineStatusProvider } from './context/usePipelineStatus.tsx';
import { Toaster } from './components/ui/toaster.tsx';
import { AgentValuesProvider } from './context/useAgentsValues.tsx';
import { PipelineOverviewProvider } from './context/usePipelineDetailContext.tsx';
import { NodeValueProvider } from './context/useNodeContext.tsx';
import { PipelineChangesLogProvider } from './context/usePipelineChangesLog.tsx';
import { PipelineTabProvider } from './context/useAddNewPipelineActiveTab.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AgentValuesProvider>
      <PipelineStatusProvider>
        <PipelineOverviewProvider>
          <NodeValueProvider>
            <PipelineChangesLogProvider>
              <PipelineTabProvider>
                <App />
              </PipelineTabProvider>
            </PipelineChangesLogProvider>
          </NodeValueProvider>
        </PipelineOverviewProvider>
      </PipelineStatusProvider>
      <Toaster />
    </AgentValuesProvider>
  </StrictMode>,
)
