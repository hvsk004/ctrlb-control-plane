interface Source {
    id: number,
    name: string,
    icon: string,
    features: string[]
}

export const sources: Source[] = [
    { id: 1, name: 'Aerospike', icon: '📊', features: ['logs', 'metrics'] },
    { id: 2, name: 'Apache Combined', icon: '🔸', features: ['logs'] },
    { id: 3, name: 'Apache Common', icon: '🔸', features: ['logs'] },
    { id: 4, name: 'Apache HTTP', icon: '🔸', features: ['logs', 'metrics'] },
    { id: 5, name: 'Apache Spark', icon: '⭐', features: ['metrics'] },
    { id: 6, name: 'AWS Cloudwatch', icon: '📈', features: ['logs'] },
    { id: 7, name: 'AWS S3 Rehydration', icon: 'aws', features: ['logs', 'metrics', 'traces'] },
    { id: 8, name: 'Azure Blob', icon: 'azure', features: ['logs', 'traces'] },
    { id: 9, name: 'Azure Blob Rehydration', icon: 'azure', features: ['logs', 'metrics', 'traces'] },
    { id: 10, name: 'Azure Event Hub', icon: 'azure', features: ['logs', 'metrics'] },
    { id: 11, name: 'Bindplane', icon: 'bp', features: ['logs'] },
    { id: 12, name: 'Bindplane Agent', icon: 'bp', features: ['logs', 'metrics'] },
    { id: 13, name: 'Bindplane Gateway', icon: 'bp', features: ['logs', 'metrics', 'traces'] },
];