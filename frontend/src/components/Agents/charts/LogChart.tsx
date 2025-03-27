import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import agentServices from "@/services/agentServices"
import { useEffect, useState } from "react"

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig
const LogChart = ({id}:{id:string}) => {
    const [dataPoints, setDataPoints] = useState([])

    const getLogData = async () => {
        const res = await agentServices.getAgentRateMetrics(id)
        setDataPoints(res[2].data_points)
    }

    useEffect(() => {
        getLogData()
    }, [])

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp)
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${hours}:${minutes}`
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Log Chart</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={dataPoints}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="timestamp"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={formatTimestamp}
                        />
                        <YAxis dataKey={"value"} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Area
                            dataKey="desktop"
                            type="natural"
                            fill="var(--color-desktop)"
                            fillOpacity={0.4}
                            stroke="var(--color-desktop)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default LogChart
