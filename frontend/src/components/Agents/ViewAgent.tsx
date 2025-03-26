import { useState } from "react"

interface agentVal {
    "id": string,
    "name": string,
    "version": string,
    "pipelineID": string,
    "pipelineName": string,
    "status": string,
    "hostname": string,
    "platform": string,
    "labels": object
}

const ViewAgent = () => {
    const [agentVal, setAgentVal] = useState<agentVal>()

    return (
        <div>
            {agentVal && <div>
                <p>Agent {agentVal.name}</p>
                <p>Name {agentVal.name}</p>
                <p>Version {agentVal.version}</p>
                <p>Pipeline Name {agentVal.pipelineName}</p>
                <p>Status {agentVal.status}</p>
                <p>Hostname {agentVal.hostname}</p>
                <p>Platform {agentVal.platform}</p>

            </div>}
        </div>
    )
}

export default ViewAgent
