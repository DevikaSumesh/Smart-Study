"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

type Mood = "sad" | "meh" | "neutral" | "smile" | "grin" | "cool"

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState(0)

  // Step 2: sleep state
  const [hour, setHour] = useState(7)
  const [minute, setMinute] = useState(30)
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM")

  // Step 3: mood + notes
  const [mood, setMood] = useState<Mood | null>(null)
  const [notes, setNotes] = useState("")

  const next = () => setStep((s) => Math.min(s + 1, 2))
  const prev = () => setStep((s) => Math.max(s - 1, 0))
  const skipOrStart = () => router.push("/dashboard")

  const Dot = ({ active }: { active: boolean }) => (
    <span
      className={`inline-block h-2 w-2 rounded-full ${active ? "bg-[color:var(--ink)]" : "bg-[color:var(--ink)]/30"}`}
    />
  )

  return (
    <div className="min-h-screen bg-app-gradient flex items-center justify-center px-4 py-10">
      <div className="panel p-6 md:p-8 max-w-3xl w-full">
        <div className="flex items-center gap-2 mb-4">
          {step > 0 && (
            <button aria-label="Back" onClick={prev} className="btn-outline px-3 py-1.5 rounded-full">
              ←
            </button>
          )}
          <h2 className="mx-auto text-xl md:text-2xl font-semibold text-[color:var(--brand-dark)]">
            {step === 0 && "Plan Your Work"}
            {step === 1 && "Log Your Sleep"}
            {step === 2 && "Expression Analysis"}
          </h2>
        </div>

        {/* content area */}
        <div className="mt-4">
          {step === 0 && (
            <div className="text-center">
              <p className="text-[color:var(--ink)]/80 max-w-2xl mx-auto leading-relaxed">
                Plan your work, organize tasks by tags and projects, and track your progress with ease. Stay structured
                even on busy days.
              </p>

              {/* little sample checklist strip for visual feel */}
              <div className="mt-6 mx-auto max-w-xl text-left bg-[color:var(--brand)]/8 border border-black/10 rounded-2xl p-4">
                {["Complete Data Structures assignment", "Review Algorithm concepts", "Practice Coding problems"].map(
                  (t, i) => (
                    <label key={i} className="flex items-center gap-3 py-2">
                      <input type="checkbox" className="size-5 rounded border-black/20" defaultChecked={i === 0} />
                      <span className="text-[color:var(--ink)]">{t}</span>
                    </label>
                  ),
                )}
                <div className="text-right text-sm text-[color:var(--ink)]/60">View 1 more…</div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="text-center">
              <p className="text-[color:var(--ink)]/80 mb-6">Let us know how many hours did you sleep.</p>

              <div className="flex items-center justify-center gap-4">
                <NumberPicker value={hour} setValue={setHour} min={1} max={12} label="hr" />
                <span className="text-2xl font-semibold text-[color:var(--ink)]">:</span>
                <NumberPicker value={minute} setValue={setMinute} min={0} max={59} step={1} pad label="min" />
                <AmPm value={ampm} setValue={setAmpm} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <p className="text-[color:var(--ink)]/80 mb-5">How do you feel right now?</p>
              <div className="flex items-center justify-center gap-5 text-2xl">
                {[
                  { k: "sad", c: "☹️" },
                  { k: "meh", c: "😕" },
                  { k: "neutral", c: "😐" },
                  { k: "smile", c: "🙂" },
                  { k: "grin", c: "😄" },
                  { k: "cool", c: "😎" },
                ].map((m) => (
                  <button
                    key={m.k}
                    onClick={() => setMood(m.k as Mood)}
                    className={`h-12 w-12 rounded-full flex items-center justify-center ring-1 ring-black/10 transition
                      ${mood === m.k ? "bg-[color:var(--brand)] text-white" : "bg-white hover:bg-black/5"}`}
                    aria-pressed={mood === m.k}
                  >
                    <span aria-hidden>{m.c}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 max-w-xl mx-auto">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Express your thoughts"
                  className="w-full h-36 rounded-2xl bg-black/5 border border-black/10 p-4 outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
                />
              </div>
            </div>
          )}
        </div>

        {/* dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <Dot active={step === 0} />
          <Dot active={step === 1} />
          <Dot active={step === 2} />
        </div>

        {/* actions */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button className="btn-outline px-8 py-2.5" onClick={skipOrStart}>
            Skip
          </button>
          {step === 2 ? (
            <button className="btn-primary px-8 py-2.5" onClick={skipOrStart}>
              Get Started
            </button>
          ) : (
            <button className="btn-primary px-8 py-2.5" onClick={next}>
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function NumberPicker({
  value,
  setValue,
  min,
  max,
  step = 1,
  pad = false,
  label,
}: {
  value: number
  setValue: (n: number) => void
  min: number
  max: number
  step?: number
  pad?: boolean
  label: string
}) {
  const dec = () => setValue(value <= min ? max : Math.max(min, value - step))
  const inc = () => setValue(value >= max ? min : Math.min(max, value + step))
  const shown = pad ? String(value).padStart(2, "0") : value
  return (
    <div className="text-center">
      <button className="btn-outline px-3 py-1.5 rounded-full" onClick={inc} aria-label={`Increase ${label}`}>
        ▲
      </button>
      <div className="mt-2 min-w-[64px] text-xl font-semibold text-[color:var(--ink)] bg-black/10 rounded-xl px-4 py-2 inline-block">
        {shown}
      </div>
      <button className="mt-2 btn-outline px-3 py-1.5 rounded-full" onClick={dec} aria-label={`Decrease ${label}`}>
        ▼
      </button>
    </div>
  )
}

function AmPm({ value, setValue }: { value: "AM" | "PM"; setValue: (v: "AM" | "PM") => void }) {
  return (
    <div className="flex flex-col items-center">
      <button
        className="btn-outline px-3 py-1.5 rounded-full"
        onClick={() => setValue(value === "AM" ? "PM" : "AM")}
        aria-label="Toggle AM/PM"
      >
        ↕
      </button>
      <div className="mt-2 min-w-[64px] text-xl font-semibold text-[color:var(--ink)] bg-black/10 rounded-xl px-4 py-2 inline-block">
        {value}
      </div>
      <div className="mt-2 text-xs uppercase tracking-wide text-[color:var(--ink)]/60">AM/PM</div>
    </div>
  )
}
