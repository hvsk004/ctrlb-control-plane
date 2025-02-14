const Overview = [
    { label: "Pipeline Id", value: "5edea737-1eea-419d-a5ed-305a05a4b9b1" },
    { label: "Pipeline created by", value: "rdealtheman@fintechistanbul.net" },
    { label: "Pipeline created", value: "3:16 PM, Oct 9, 2024" },
    { label: "Pipeline last updated by", value: "rdealthemanbel@fintechistanbul.net" },
    { label: "Pipeline last updated", value: "3:16 PM, Oct 9, 2025" },
    { label: "Active agents", value: "2" }
]

const PipelineDetails = () => {
    return (
        <div className="py-4">
            <div className="flex flex-col w-[30rem] md:w-full">
                {Overview.map(({ label, value }) => (
                    <div key={value} className="flex justify-between py-2">
                        <span className="text-gray-700">{label}:</span>
                        <span className="text-gray-500">{value}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PipelineDetails
