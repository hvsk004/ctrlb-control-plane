import { AgentValues } from "@/types/agentValues.type";
import React, { createContext, useContext, useState } from "react";


interface AgentsValuesProps {
    agentValues: AgentValues[],
    setAgentValues: (agent: AgentValues[]) => void
}

const AgentValuesContext = createContext<AgentsValuesProps | undefined>(undefined);

export const AgentValuesProvider = ({ children }: { children: React.ReactNode }) => {
    const [agentValues, setAgentValues] = useState<AgentValues[]>([]);

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