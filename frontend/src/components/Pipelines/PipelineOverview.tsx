import PipelineOverviewTable from './PipelineOverviewTable'
import PipelineDetails from './PipelineDetails'


const PipelineOverview = ({pipelineId}:{pipelineId:string}) => {
    return (
        <div>
            <PipelineDetails pipelineId={pipelineId}/>
            <PipelineOverviewTable pipelineId={pipelineId} />
        </div>
    )
}

export default PipelineOverview
