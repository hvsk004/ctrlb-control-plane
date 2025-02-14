import PipelineOverviewTable from './PipelineOverviewTable'
import { RefreshCcwIcon } from 'lucide-react'
import PipelineDetails from './PipelineDetails'

const PipelineOverview = () => {
    return (
        <div>
            <PipelineDetails />
            <div>
                <div className="flex">
                    <h1 className="text-xl flex justify-center items-center mt-8 text-gray-600">Agents (1)
                        <RefreshCcwIcon className="w-5 mx-4 text-blue-500" />
                    </h1>
                </div>
                <PipelineOverviewTable />
            </div>
        </div>
    )
}

export default PipelineOverview
