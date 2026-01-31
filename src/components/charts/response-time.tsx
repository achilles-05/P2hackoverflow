"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function ResponseTimeChart({ data }: { data?: any[] }) {
    // Fallback data if none provided to avoid empty chart
    const chartData = data || [
        { name: 'Mon', time: 0 },
        { name: 'Tue', time: 0 },
        { name: 'Wed', time: 0 },
        { name: 'Thu', time: 0 },
        { name: 'Fri', time: 0 },
        { name: 'Sat', time: 0 },
        { name: 'Sun', time: 0 },
    ]

    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}h`}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Line
                    type="monotone"
                    dataKey="time"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
