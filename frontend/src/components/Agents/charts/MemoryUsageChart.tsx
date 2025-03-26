"use client"
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
const chartData = [
  { month: "02:05", desktop: 80 },
  { month: "02:10", desktop: 100 },
  { month: "02:15", desktop: 40 },
  { month: "02:20", desktop: 60 },
  { month: "02:25", desktop: 20 },
  { month: "02:30", desktop: 0 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function MemoryUsageChart({ id }: { id: string }) {
  const [dataPoints, setDataPoints] = useState([])

  const getCpuDataPoint = async () => {
    const res = await agentServices.getAgentHealthMetrics(id)
    setDataPoints(res[1].data_points)
  }

  useEffect(() => {
    getCpuDataPoint()
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
        <CardTitle>Memory Usage</CardTitle>
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
