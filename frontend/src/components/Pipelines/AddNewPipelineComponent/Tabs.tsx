import { useState } from 'react'

const TABS = [
    { label: "Pipelines", value: "pipelines" },
    { label: "Agents", value: "agents" },
];

const Tabs = () => {
    const [activeTab, setActiveTab] = useState("pipelines");
    return (
        <div className="flex gap-2 border-b">
            {TABS.map(({ label, value }) => (
                <button
                    key={value}
                    onClick={() => setActiveTab(value)}
                    className={`px-4 py-2 text-lg rounded-t-md text-gray-600 focus:outline-none ${activeTab === value
                        ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
                        : ""
                        }`}
                >
                    {label}
                </button>
            ))}
        </div>
    )
}

export default Tabs
