import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { QuickActions } from "@/components/site/quick-actions"
import { PomodoroTimerCard } from "@/components/pomodoro/timer-card"

export default function Pomodoro() {
  return (
    <>
      <Navbar />
      <section className="container-max py-10">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="panel p-6 bg-app-gradient/20 text-white rounded-[var(--radius-panel)]">
            <h1 className="text-3xl font-semibold">Welcome Riya :)</h1>
            <p className="opacity-90">Focus session controls on the right.</p>
          </div>
          <PomodoroTimerCard />
        </div>
      </section>
      <QuickActions />
      <Footer />
    </>
  )
}
