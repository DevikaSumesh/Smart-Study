import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { QuickActions } from "@/components/site/quick-actions"
import { TaskCard } from "@/components/dashboard/task-card"
import { SleepCard } from "@/components/dashboard/sleep-card"
import { StatusCard } from "@/components/dashboard/status-card"

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <section className="container-max py-10">
        <header className="panel p-6 md:p-8 mb-6 bg-app-gradient/30 text-white rounded-[var(--radius-panel)]">
          <h1 className="text-3xl font-semibold">Welcome Riya :)</h1>
          <p className="opacity-90">Here’s your summary for today</p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <TaskCard />
          <SleepCard />
          <StatusCard />
        </div>

        <div className="mt-8 panel p-4 flex items-center gap-4">
          <span className="text-2xl">⏰</span>
          <div className="flex-1 text-black/80">
            <b>Next Session :</b> Review Algorithm concepts — <span className="font-medium">4:30 pm</span>
          </div>
          <a href="/pomodoro" className="btn-primary">
            Join now
          </a>
        </div>
      </section>
      <QuickActions />
      <Footer />
    </>
  )
}
