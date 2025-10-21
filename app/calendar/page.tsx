import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { QuickActions } from "@/components/site/quick-actions"
import { CalendarPanel } from "@/components/calendar/calendar-panel"

export default function CalendarPage() {
  return (
    <>
      <Navbar />
      <section className="container-max py-10">
        <div className="grid md:grid-cols-[1fr,1.2fr] gap-6">
          <div className="panel p-6 bg-app-gradient/20 text-white rounded-[var(--radius-panel)]">
            <h1 className="text-3xl font-semibold">Welcome Riya :)</h1>
            <p className="opacity-90">Plan your schedule and log wellness.</p>
          </div>
          <CalendarPanel />
        </div>
      </section>
      <QuickActions />
      <Footer />
    </>
  )
}
