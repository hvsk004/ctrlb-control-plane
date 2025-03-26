import agentServices from "@/services/agentServices";
import { AgentValuesTable } from "@/types/agentValues.type";
import React, { createContext, useContext, useState } from "react";


interface AgentsValuesProps {
    agentValues: AgentValuesTable[],
    setAgentValues: (agent: AgentValuesTable[]) => void
}

const Agent = await agentServices.getAllAgents()

const AgentValuesContext = createContext<AgentsValuesProps | undefined>(undefined);

export const AgentValuesProvider = ({ children }: { children: React.ReactNode }) => {
    const [agentValues, setAgentValues] = useState<AgentValuesTable[]>(Agent);


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