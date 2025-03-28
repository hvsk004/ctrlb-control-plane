import agentServices from "@/services/agentServices";
import { AgentValuesTable } from "@/types/agentValues.type";
import React, { createContext, useContext, useState, useEffect } from "react";

interface AgentsValuesProps {
    agentValues: AgentValuesTable[];
    setAgentValues: (agent: AgentValuesTable[]) => void;
}

const AgentValuesContext = createContext<AgentsValuesProps | undefined>(undefined);

export const AgentValuesProvider = ({ children }: { children: React.ReactNode }) => {
    const [agentValues, setAgentValues] = useState<AgentValuesTable[]>([]);

    useEffect(() => {
        const fetchAgents = async () => {
            const authToken = localStorage.getItem("authToken");
            if (!authToken) {
                console.warn("No authToken found. Initializing agentValues as an empty array.");
                setAgentValues([]);
                return;
            }

            try {
                const agents = await agentServices.getAllAgents();
                setAgentValues(agents);
            } catch (error) {
                console.error("Failed to fetch agents:", error);
                setAgentValues([]);
            }
        };

        fetchAgents();
    }, []);

    return (
        <AgentValuesContext.Provider value={{ agentValues, setAgentValues }}>
            {children}
        </AgentValuesContext.Provider>
    );
};

export const useAgentValues = () => {
    const context = useContext(AgentValuesContext);
    if (context === undefined) {
        throw new Error("useAgentValues must be used within an AgentValuesProvider");
    }
    return context;
};