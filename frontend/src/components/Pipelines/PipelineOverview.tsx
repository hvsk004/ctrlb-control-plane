import PipelineOverviewTable from './PipelineOverviewTable'
import PipelineDetails from './PipelineDetails'
import { usePipelineOverview } from '@/context/usePipelineDetailContext'
import pipelineServices from '@/services/pipelineServices'
import { useEffect } from 'react'

const PipelineOverview = ({pipelineId}:{pipelineId:string}) => {
    // const { setPipelineOverview } = usePipelineOverview()
    // const fetchPipelinedOverview = async () => {
    //     const res = await pipelineServices.getPipelineById(id)
    //     setPipelineOverview(res)
    // }
    // useEffect(() => {
    //     fetchPipelinedOverview()
    // }, [])
    return (
        <div>
            <PipelineDetails pipelineId={pipelineId}/>
            <PipelineOverviewTable pipelineId={pipelineId} />
        </div>
    )
}

export default PipelineOverview
