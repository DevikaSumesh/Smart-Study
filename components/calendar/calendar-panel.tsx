"use client"

import { useMemo, useState } from "react"

const weekDays = ["S", "M", "T", "W", "T", "F", "S"]

function buildMonth(date = new Date()) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1)
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  const grid: (number | null)[] = []
  const leading = first.getDay()
  for (let i = 0; i < leading; i++) grid.push(null)
  for (let d = 1; d <= last.getDate(); d++) grid.push(d)
  while (grid.length % 7 !== 0) grid.push(null)
  return grid
}

export function CalendarPanel() {
  const [current, setCurrent] = useState(new Date())
  const [sleep, setSleep] = useState(6)
  const [mood, setMood] = useState<number | null>(3)
  const [events, setEvents] = useState<string[]>([])

  const grid = useMemo(() => buildMonth(current), [current])
  const monthLabel = current.toLocaleString("default", { month: "long", year: "numeric" })

  return (
    <div className="panel p-6 rounded-[var(--radius-panel)]">
      <div className="flex items-center justify-between">
        <button
          className="btn-outline px-3 py-1"
          onClick={() => setCurrent((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
          aria-label="Previous month"
        >
          ‹
        </button>
        <h3 className="text-lg font-semibold text-[color:var(--brand-dark)]">{monthLabel}</h3>
        <button
          className="btn-outline px-3 py-1"
          onClick={() => setCurrent((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-sm">
        {weekDays.map((d) => (
          <div key={d} className="font-medium text-black/70">
            {d}
          </div>
        ))}
        {grid.map((d, i) => (
          <div
            key={i}
            className={`aspect-square rounded-xl border grid place-items-center ${
              d ? "bg-white hover:bg-[color:var(--brand)]/10 cursor-pointer" : "bg-transparent border-transparent"
            }`}
            onClick={() => d && alert(`Add events for ${d} ${monthLabel}`)}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Add events</span>
          <span className="opacity-60">(stub)</span>
        </div>
        <input
          placeholder="Type an event and press Enter"
          className="w-full rounded-xl border px-4 py-2"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim()) {
              setEvents((ev) => [e.currentTarget.value.trim(), ...ev])
              e.currentTarget.value = ""
            }
          }}
        />
        {!!events.length && (
          <ul className="text-sm text-black/80 space-y-1">
            {events.map((e, i) => (
              <li key={i}>• {e}</li>
            ))}
          </ul>
        )}

        <div className="pt-2">
          <div className="text-sm font-medium mb-2">Slide to set your total sleep time</div>
          <input
            type="range"
            min={2}
            max={10}
            step={0.5}
            value={sleep}
            onChange={(e) => setSleep(Number.parseFloat(e.target.value))}
            className="w-full accent-[color:var(--brand)]"
          />
          <div className="text-sm mt-1">Selected: {sleep} hr</div>
        </div>

        <div className="pt-2">
          <div className="text-sm font-medium mb-2">How is your mood lately?</div>
          <div className="flex items-center gap-4 text-2xl">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setMood(n)}
                className={`h-10 w-10 grid place-items-center rounded-full border ${
                  mood === n ? "bg-[color:var(--brand)]/10 border-[color:var(--brand)]" : "bg-white"
                }`}
                aria-label={`Mood ${n}`}
                title={`Mood ${n}`}
              >
                {["☹", "😐", "🙂", "😊", "😎"][n - 1]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
