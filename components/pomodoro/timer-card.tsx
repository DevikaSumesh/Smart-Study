"use client"

import { useEffect, useMemo, useRef, useState } from "react"

function format(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

export function PomodoroTimerCard() {
  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running])

  const progress = useMemo(() => 1 - seconds / (25 * 60), [seconds])

  return (
    <div className="panel p-6 md:p-8 rounded-[var(--radius-panel)]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[color:var(--brand-dark)]">Timer</h2>
        <select
          className="rounded-full border px-3 py-1 text-sm"
          value={seconds}
          onChange={(e) => setSeconds(Number.parseInt(e.target.value))}
        >
          <option value={25 * 60}>25:00 Focus</option>
          <option value={5 * 60}>05:00 Break</option>
          <option value={15 * 60}>15:00 Long Break</option>
        </select>
      </div>

      <div className="mt-6 grid place-items-center">
        <div className="relative h-44 w-44 grid place-items-center rounded-full border-4 border-[color:var(--brand)]">
          <svg viewBox="0 0 36 36" className="absolute h-full w-full -rotate-90">
            <path d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32" fill="none" stroke="#e6e6e6" strokeWidth="3" />
            <path
              d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${progress * 100}, 100`}
              className="text-[color:var(--brand)]"
            />
          </svg>
          <div className="text-3xl font-semibold">{format(seconds)}</div>
          <div className="absolute bottom-2 text-xs text-black/60">2 of 4 sessions</div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button className="btn-outline" onClick={() => setSeconds((s) => Math.min(25 * 60, s + 60))}>
            +1m
          </button>
          <button className="btn-primary" onClick={() => setRunning((r) => !r)}>
            {running ? "Pause" : "Start"}
          </button>
          <button className="btn-outline" onClick={() => setSeconds(25 * 60)}>
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
