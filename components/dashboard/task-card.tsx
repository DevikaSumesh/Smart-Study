"use client"

import { useState } from "react"

type Task = { id: number; title: string; done: boolean }

export function TaskCard() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Complete data structures assignment", done: true },
    { id: 2, title: "Review Algorithm concepts", done: false },
    { id: 3, title: "Practice Coding problems", done: false },
  ])

  const toggle = (id: number) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)))

  return (
    <div className="panel p-6 bg-[color:var(--brand)]/80 text-white rounded-[var(--radius-panel)] shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Today's Tasks</h3>
        <button
          className="text-white/80 hover:text-white text-sm underline underline-offset-4"
          onClick={() => alert("Open edit modal (stub)")}
        >
          Edit
        </button>
      </div>
      <ul className="mt-4 space-y-3">
        {tasks.map((t) => (
          <li key={t.id} className="flex items-start gap-3">
            <input
              aria-label={t.title}
              type="checkbox"
              checked={t.done}
              onChange={() => toggle(t.id)}
              className="mt-1 h-4 w-4 rounded border-white/50 bg-white/20"
            />
            <span className={t.done ? "line-through opacity-80" : ""}>{t.title}</span>
          </li>
        ))}
      </ul>
      <a className="block mt-3 text-sm text-white/80 hover:text-white" href="#">
        View 1 more..
      </a>
    </div>
  )
}
