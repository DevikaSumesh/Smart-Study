"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const COLORS = ["#cb5a57", "#2aa198"]

export function StatusCard() {
  const data = [
    { name: "Completed", value: 1 },
    { name: "Remaining", value: 3 },
  ]

  return (
    <div className="panel p-6 bg-[color:var(--brand)]/80 text-white rounded-[var(--radius-panel)] shadow-xl">
      <h3 className="text-xl font-semibold mb-4">Task Status</h3>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={40} outerRadius={60} paddingAngle={2}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-sm grid grid-cols-2 gap-2">
        <div>
          Completed : <span className="font-medium">1 / 4</span>
        </div>
        <div className="text-right">3 tasks remaining</div>
      </div>
    </div>
  )
}
