import { Changes, PipelineChangesLog } from "@/constants/PipelineChangesLog";
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

interface PipelineChangesLogProps {
    changesLog: Changes[],
    setChangesLog: Dispatch<SetStateAction<Changes[]>>
}

const PipelineChangesLogContext = createContext<PipelineChangesLogProps | undefined>(undefined);

export const PipelineChangesLogProvider = ({ children }: { children: React.ReactNode }) => {
    const [changesLog, setChangesLog] = useState<Changes[]>(PipelineChangesLog);

    return (
        <PipelineChangesLogContext.Provider value={{ changesLog, setChangesLog }}>
            {children}
        </PipelineChangesLogContext.Provider>
    );
}
const usePipelineChangesLog = () => {
    const context = useContext(PipelineChangesLogContext);
    if (!context) {
        throw new Error("usePipelineChangesLog must be used within a PipelineChangesLogProvider");
    }
    return context;
}

export default usePipelineChangesLog
