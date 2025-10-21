"use client"

import { useState } from "react"

export function SleepCard() {
  const [hours, setHours] = useState(6.5)
  return (
    <div className="panel p-6 bg-[color:var(--brand)]/80 text-white rounded-[var(--radius-panel)] shadow-xl">
      <h3 className="text-xl font-semibold">Sleep Feedback</h3>
      <div className="mt-3 text-sm">
        Last night : <span className="font-medium">{hours.toFixed(1)} hours</span>
      </div>
      <div className="mt-4">
        <input
          type="range"
          min={3}
          max={10}
          step={0.5}
          value={hours}
          onChange={(e) => setHours(Number.parseFloat(e.target.value))}
          className="w-full accent-white"
        />
        <div className="mt-2 h-2 rounded-full bg-white/30">
          <div
            className="h-2 rounded-full bg-white"
            style={{ width: `${((hours - 3) / 7) * 100}%` }}
            aria-hidden
          />
        </div>
      </div>
      <p className="mt-3 text-sm opacity-90">Try to reach 8 hrs for better focus!</p>
    </div>
  )
}
