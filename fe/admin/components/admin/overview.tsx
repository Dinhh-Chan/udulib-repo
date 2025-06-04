"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "T2",
    total: 234,
  },
  {
    name: "T3",
    total: 165,
  },
  {
    name: "T4",
    total: 189,
  },
  {
    name: "T5",
    total: 215,
  },
  {
    name: "T6",
    total: 252,
  },
  {
    name: "T7",
    total: 187,
  },
  {
    name: "CN",
    total: 134,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}
