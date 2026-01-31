"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"


export function HostelDensityChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
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
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="electrical" stackId="a" fill="#3B6064" radius={[0, 0, 4, 4]} /> {/* Deep Teal */}
                <Bar dataKey="plumbing" stackId="a" fill="#55828B" radius={[0, 0, 0, 0]} /> {/* Teal */}
                <Bar dataKey="furniture" stackId="a" fill="#87BBA2" radius={[0, 0, 0, 0]} /> {/* Med Sage */}
                <Bar dataKey="internet" stackId="a" fill="#C9E4CA" radius={[4, 4, 0, 0]} /> {/* Light Sage */}
            </BarChart>
        </ResponsiveContainer>
    )
}
