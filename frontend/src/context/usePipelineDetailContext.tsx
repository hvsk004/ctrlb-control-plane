import { createContext, useContext,useState,ReactNode } from "react";

interface PipelineOverviewContextProps {
    pipelineDetail: object;
    setPipelineDetail: object;
    
}

const PipelineOverviewContext = createContext<PipelineOverviewContextProps | undefined>(undefined);

export const PipelineOverviewProvider = ({ children }: { children: ReactNode }) => {
    const [pipelineDetail, setPipelineDetail] = useState<object>({});

    return (
        <PipelineOverviewContext.Provider value={{ pipelineDetail, setPipelineDetail }}>
            {children}
        </PipelineOverviewContext.Provider>
    );
}

export const usePipelineOverview=()=>{
    const context = useContext(PipelineOverviewContext);
    if (context === undefined) {
        throw new Error("usePipelineOverview must be used within a PipelineOverviewProvider");
    }
    return context;
}


