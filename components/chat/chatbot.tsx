"use client"

import { useState } from "react"

type Msg = { id: number; role: "user" | "assistant"; content: string }

export function ChatBox() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, role: "assistant", content: "Hey there! how can I help you?" },
  ])
  const [input, setInput] = useState("")

  const send = () => {
    if (!input.trim()) return
    const userMsg: Msg = { id: Date.now(), role: "user", content: input.trim() }
    const reply: Msg = {
      id: Date.now() + 1,
      role: "assistant",
      content: "Got it! I'll help you outline steps for that. (demo reply)",
    }
    setMessages((m) => [...m, userMsg, reply])
    setInput("")
  }

  return (
    <div className="panel p-0 overflow-hidden rounded-[var(--radius-panel)]">
      <div className="h-[60vh] md:h-[64vh] bg-app-gradient/50 p-6 space-y-3 overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[70%] rounded-xl px-4 py-2 ${
              m.role === "assistant" ? "bg-white/80 text-black" : "bg-[color:var(--brand)] text-white ml-auto"
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>
      <div className="p-3 flex items-center gap-2 bg-white/80">
        <button className="h-10 w-10 grid place-items-center rounded-full bg-black/10 text-black/70">＋</button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1 rounded-full border px-4 py-2"
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button className="btn-primary" onClick={send} aria-label="Send message">
          Send
        </button>
      </div>
    </div>
  )
}
