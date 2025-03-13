import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import '@fontsource/sansita'
import "./index.css";
import { PipelineStatusProvider } from './context/usePipelineStatus.tsx';
import { Toaster } from './components/ui/toaster.tsx';
import { AgentValuesProvider } from './context/useAgentsValues.tsx';
import { PipelineOverviewProvider } from './context/usePipelineDetailContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PipelineStatusProvider>
      <AgentValuesProvider>
        <PipelineOverviewProvider>
        <App />
        </PipelineOverviewProvider>
      </AgentValuesProvider>
    </PipelineStatusProvider>
    <Toaster />
  </StrictMode>,
)
