import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from './Icon'
import { LanguageSelector } from './LanguageSelector'
import { sendChatMessage, type ChatMessage, type Language, type Persona } from '../../lib/aiClient'

interface ChatWidgetProps {
  persona: Persona
  context: Record<string, unknown>
}

export function ChatWidget({ persona, context }: ChatWidgetProps) {
  const [open, setOpen] = useState(false)
  const [language, setLanguage] = useState<Language>('en')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isSending])

  async function handleSend() {
    const text = input.trim()
    if (!text || isSending) return
    const next = [...messages, { role: 'user', content: text } as ChatMessage]
    setMessages(next)
    setInput('')
    setError(null)
    setIsSending(true)
    try {
      const { reply } = await sendChatMessage(persona, language, context, next)
      setMessages([...next, { role: 'assistant', content: reply }])
    } catch {
      setError("Couldn't get a reply right now. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-40 right-4 z-40 flex h-[28rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-card bg-white shadow-warm-lg sm:right-6 lg:bottom-24"
          >
            <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-marigold-100 text-marigold-700">
                  <Icon name="sparkle" className="h-3.5 w-3.5" />
                </div>
                <p className="font-display text-sm font-semibold text-ink-900">Kithnest Assistant</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="text-ink-400 hover:text-ink-700">
                <Icon name="x" className="h-4 w-4" />
              </button>
            </div>

            <div className="border-b border-ink-100 px-4 py-2">
              <LanguageSelector value={language} onChange={setLanguage} />
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
              {messages.length === 0 && (
                <p className="text-sm text-ink-400">
                  {persona === 'parent'
                    ? "Ask me anything about your child's progress, workload, or updates from school."
                    : "Ask me anything about your school's engagement, classes, or roster."}
                </p>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    'max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ' +
                    (m.role === 'user'
                      ? 'ml-auto bg-teal-500 text-white'
                      : 'mr-auto bg-ink-100 text-ink-800')
                  }
                >
                  {m.content}
                </div>
              ))}
              {isSending && <div className="mr-auto max-w-[85%] rounded-2xl bg-ink-100 px-3.5 py-2 text-sm text-ink-400">Thinking…</div>}
              {error && <p className="text-xs text-coral-600">{error}</p>}
            </div>

            <div className="flex items-center gap-2 border-t border-ink-100 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a question…"
                className="flex-1 rounded-pill border border-ink-200 px-3.5 py-2 text-sm outline-none focus:border-teal-400"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={isSending || !input.trim()}
                aria-label="Send"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-500 text-white disabled:opacity-40"
              >
                <Icon name="send" className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-marigold-500 text-ink-900 shadow-warm-lg transition-transform active:scale-95 sm:right-6 lg:bottom-6"
      >
        <Icon name={open ? 'x' : 'message'} className="h-6 w-6" />
      </button>
    </>
  )
}
