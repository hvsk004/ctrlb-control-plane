import { Agent } from "@/constants/AgentList";
import { AgentValuesType } from "@/types/agentValues.type";
import React, { createContext, useContext, useState } from "react";


interface AgentsValuesProps {
    agentValues: AgentValuesType[],
    setAgentValues: (agent: AgentValuesType[]) => void
}

const AgentValuesContext = createContext<AgentsValuesProps | undefined>(undefined);

export const AgentValuesProvider = ({ children }: { children: React.ReactNode }) => {
    const [agentValues, setAgentValues] = useState<AgentValuesType[]>([]);


    return (
        <AgentValuesContext.Provider value={{ agentValues, setAgentValues }}>
            {children}
        </AgentValuesContext.Provider>
    );
};

export const useAgentValues = () => {
    const context = useContext(AgentValuesContext);
    if (context === undefined) {
        throw new Error("useAgentValue must be used within an AgentValuesProvider");
    }
    return context;
};