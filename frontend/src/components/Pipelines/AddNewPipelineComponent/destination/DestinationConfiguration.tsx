import { Button } from '@/components/ui/button';
import { SourceType } from '@/types/sourceConfig.type';
import { useEffect, useState } from 'react';
import DestinationDetails from './DestinationDetails';

interface DestinationConfigurationProps extends SourceType {
    onClose: () => void;
}

const DestinationConfiguration = (source: DestinationConfigurationProps) => {
    const [description, setDescription] = useState('');
    const [telemetryType, setTelemetryType] = useState(source.features);
    const [accessLogPath, setAccessLogPath] = useState('/var/log/apache2/access.log');
    const [errorLogPath, setErrorLogPath] = useState('/var/log/apache2/error.log');
    const [hostname, setHostname] = useState('localhost');
    const [port, setPort] = useState('80');
    const [logsAdvancedOpen, setLogsAdvancedOpen] = useState(false);
    const [metricsAdvancedOpen, setMetricsAdvancedOpen] = useState(false);
    const [tracesAdvancedOpen, setTracesAdvancedOpen] = useState(false)
    const [name, setName] = useState('')

    useEffect(() => {
        const savedSources = localStorage.getItem("Destination");
        const existingSources = savedSources ? JSON.parse(savedSources) : [];
        const updatedSources = existingSources.map((existingSource: SourceType) => {
            if (existingSource.name === source.name && existingSource.description === source.description) {
                return { ...existingSource, name, description };
            }
            return existingSource;
        });
        localStorage.setItem("Destination", JSON.stringify(updatedSources));
    }, [name, description]);


    const handleTelemetryToggle = (type: any) => {
        if (telemetryType.includes(type)) {
            setTelemetryType(telemetryType.filter(t => t !== type));
        } else {
            setTelemetryType([...telemetryType, type]);
        }
    };

    const handleSaveSource = () => {
        setShowSourceDetails(true);
    };

    const [showSourceDetails, setShowSourceDetails] = useState(false);
    return (
        <div className='flex flex-col'>
            {showSourceDetails && <DestinationDetails name={name} description={description} features={source.features} type={source.name} />}
            {!showSourceDetails && <div className="bg-white w-full overflow-auto h-[42rem] mt-5 shadow-md rounded-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <div>
                        <h1 className="text-xl font-medium">Add Source: {source.name}</h1>
                        <p className="text-gray-500 text-sm">Collect metrics and logs from {source.name} server.</p>
                    </div>
                </div>

                <div className="p-4">
                    <h2 className="text-lg font-medium mb-4">Configure</h2>
                    <div className="mb-6">
                        <div className="text-md font-medium text-gray-700 mb-1">Name</div>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="A name for the resource"
                        />
                    </div>
                    <div className="mb-6">
                        <div className="text-md font-medium text-gray-700 mb-1">Short Description</div>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="A short description for the resource"
                        />
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <div className="text-sm font-medium text-gray-700">Choose Telemetry Type:</div>
                        <div className="flex space-x-2">
                            {
                                source.features.map((type, index) => {
                                    return (
                                        <Button key={index} className={`hover:bg-gray-200 hover:text-black ${telemetryType.includes(type) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => handleTelemetryToggle(type)}>
                                            {type}
                                        </Button>
                                    )
                                })
                            }
                        </div>
                    </div>

                    {telemetryType.includes('logs') && (
                        <div className="mb-6 bg-gray-100 p-4 rounded-md">
                            <h3 className="text-lg font-medium mb-4">Logs</h3>
                            <div className="mb-4">
                                <div className="text-sm font-medium text-gray-700 mb-1">Access Log File Path(s)</div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md p-2 pr-10"
                                        value={accessLogPath}
                                        onChange={(e) => setAccessLogPath(e.target.value)}
                                    />
                                    <button className="absolute right-2 top-2 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Access Log File paths to tail for logs.</div>
                            </div>

                            <div className="mb-4">
                                <div className="text-sm font-medium text-gray-700 mb-1">Error Log File Path(s)</div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md p-2 pr-10"
                                        value={errorLogPath}
                                        onChange={(e) => setErrorLogPath(e.target.value)}
                                    />
                                    <button className="absolute right-2 top-2 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Error Log File paths to tail for logs.</div>
                            </div>

                            <button
                                className="flex items-center justify-between w-full p-2 text-left text-gray-700 font-medium border rounded-md"
                                onClick={() => setLogsAdvancedOpen(!logsAdvancedOpen)}
                            >
                                <span>Advanced</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-5 w-5 transform ${logsAdvancedOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {telemetryType.includes('metrics') && (
                        <div className="mb-6 bg-gray-100 p-4 rounded-md">
                            <h3 className="text-lg font-medium mb-4">Metrics</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm font-medium text-gray-700 mb-1">Hostname*</div>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        value={hostname}
                                        onChange={(e) => setHostname(e.target.value)}
                                    />
                                    <div className="text-xs text-gray-500 mt-1">The hostname or IP address of the {source.name} system.</div>
                                </div>

                                <div>
                                    <div className="text-sm font-medium text-gray-700 mb-1">Port</div>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        value={port}
                                        onChange={(e) => setPort(e.target.value)}
                                    />
                                    <div className="text-xs text-gray-500 mt-1">The TCP port of the {source.name} system.</div>
                                </div>
                            </div>

                            <button
                                className="flex items-center justify-between w-full p-2 mt-4 text-left text-gray-700 font-medium border rounded-md"
                                onClick={() => setMetricsAdvancedOpen(!metricsAdvancedOpen)}
                            >
                                <span>Advanced</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-5 w-5 transform ${metricsAdvancedOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    )}
                    {telemetryType.includes("traces") && (
                        <div>
                            <div className="mb-6 bg-gray-100 p-4 rounded-md">
                                <h3 className="text-lg font-medium mb-4">Traces</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-700 mb-1">Hostname*</div>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded-md p-2"
                                            value={hostname}
                                            onChange={(e) => setHostname(e.target.value)}
                                        />
                                        <div className="text-xs text-gray-500 mt-1">The hostname or IP address of the {source.name} system.</div>
                                    </div>

                                    <div>
                                        <div className="text-sm font-medium text-gray-700 mb-1">Port</div>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded-md p-2"
                                            value={port}
                                            onChange={(e) => setPort(e.target.value)}
                                        />
                                        <div className="text-xs text-gray-500 mt-1">The TCP port of the {source.name} system.</div>
                                    </div>
                                </div>

                                <button
                                    className="flex items-center justify-between w-full p-2 mt-4 text-left text-gray-700 font-medium border rounded-md"
                                    onClick={() => setTracesAdvancedOpen(!tracesAdvancedOpen)}
                                >
                                    <span>Advanced</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`h-5 w-5 transform ${tracesAdvancedOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>}
            {!showSourceDetails && <div className="flex justify-end p-4 border-t space-x-2">
                <button
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    onClick={source.onClose}
                >
                    Back
                </button>
                <button onClick={handleSaveSource} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Save
                </button>
            </div>}
        </div>

    );
}

export default DestinationConfiguration
