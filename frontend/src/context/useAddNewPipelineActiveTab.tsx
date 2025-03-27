import React, { createContext, useContext, useState } from "react";

interface PipelineProps {
    currentTab: string,
    setCurrentTab: (tab: string) => void
}

const PipelineTabContext = createContext<PipelineProps>({ currentTab: "pipelines", setCurrentTab: () => { } })

export const PipelineTabProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentTab, setCurrentTab] = useState<string>("pipelines")
    return (
        <PipelineTabContext.Provider value={{ currentTab, setCurrentTab }}>
            {children}
        </PipelineTabContext.Provider>
    )
}

export const usePipelineTab = () => {
    const context = useContext(PipelineTabContext)
    return context
}