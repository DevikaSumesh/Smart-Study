import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { QuickActions } from "@/components/site/quick-actions"
import { ChatBox } from "@/components/chat/chatbot"

export default function ChatPage() {
  return (
    <>
      <Navbar />
      <section className="container-max py-10">
        <div className="panel p-6 bg-white/70">
          <div className="mb-3 text-[color:var(--brand-dark)] text-lg font-semibold">AI Assistant</div>
          <ChatBox />
        </div>
      </section>
      <QuickActions />
      <Footer />
    </>
  )
}
