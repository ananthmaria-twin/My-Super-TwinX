import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Send, Sparkles, X } from 'lucide-react';
import clsx from 'clsx';
import type { ChatContext, ChatMessage } from '../../types';
import { contextReply, freeTextReply, proactiveTip } from './chatLogic';
import { TypingIndicator } from './TypingIndicator';

let idCounter = 0;
const nextId = () => `msg-${++idCounter}`;

interface ChatbotProps {
  context: ChatContext | null;
}

export function Chatbot({ context }: ChatbotProps) {
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: nextId(),
      role: 'assistant',
      text: 'Hi there 👋, working on churn risk today? I can guide you.',
      suggestions: ['Explain this pipeline', 'Show a use case'],
    },
  ]);
  const lastContextKey = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!context) return;
    const key = JSON.stringify(context);
    if (key === lastContextKey.current) return;
    lastContextKey.current = key;

    setTyping(true);
    const timeout = window.setTimeout(() => {
      const reply = contextReply(context);
      setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', text: reply.text, suggestions: reply.suggestions }]);
      setTyping(false);
      if (!open) setHasUnread(true);

      const tip = context.type === 'section' ? proactiveTip(context.section) : null;
      if (tip) {
        window.setTimeout(() => {
          setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', text: tip }]);
          if (!open) setHasUnread(true);
        }, 900);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 700);
    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setHasUnread(false);
  }, [open]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', text }]);
    setInput('');
    setTyping(true);
    window.setTimeout(() => {
      const reply = freeTextReply(text);
      setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', text: reply.text, suggestions: reply.suggestions }]);
      setTyping(false);
    }, 600 + Math.random() * 400);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="glass-panel glow-ring fixed bottom-24 right-4 z-50 flex h-[min(560px,70vh)] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-(--border-soft) sm:right-6"
          >
            <div className="flex items-center justify-between border-b border-(--border-soft) bg-gradient-to-r from-twin-blue/10 via-twin-teal/10 to-twin-purple/10 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-twin-blue to-twin-purple">
                  <Bot size={15} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-(--text-primary)">TwinX Assistant</p>
                  <p className="flex items-center gap-1 text-[10px] text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-400" /> Online
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-1.5 text-(--text-muted) hover:bg-white/10">
                <X size={16} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <div key={m.id} className={clsx('flex flex-col gap-1.5', m.role === 'user' ? 'items-end' : 'items-start')}>
                  <motion.div
                    initial={{ opacity: 0, y: 8, x: m.role === 'user' ? 8 : -8 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    className={clsx(
                      'max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm',
                      m.role === 'assistant'
                        ? 'rounded-bl-sm bg-white/[0.06] text-(--text-primary) shadow-[0_0_18px_-8px_rgba(59,130,246,0.5)]'
                        : 'rounded-br-sm bg-gradient-to-r from-twin-blue to-twin-purple text-white',
                    )}
                  >
                    {m.text}
                  </motion.div>
                  {m.suggestions && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => send(s)}
                          className="rounded-full border border-(--border-soft) bg-white/[0.03] px-2.5 py-1 text-[11px] text-twin-teal transition-colors hover:border-twin-teal hover:bg-twin-teal/10"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {typing && <TypingIndicator />}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-(--border-soft) p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything…"
                className="flex-1 rounded-xl border border-(--border-soft) bg-white/[0.03] px-3 py-2 text-xs text-(--text-primary) placeholder:text-(--text-muted) focus:border-twin-blue focus:outline-none"
              />
              <button
                type="submit"
                className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-twin-blue to-twin-purple text-white transition-transform hover:scale-105"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-5 right-4 z-50 flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-twin-blue via-twin-teal to-twin-purple shadow-[0_10px_30px_-6px_rgba(59,130,246,0.55)] sm:right-6"
      >
        {hasUnread && !open && (
          <motion.span
            className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center rounded-full bg-pink-500 ring-2 ring-(--surface)"
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
          >
            <Sparkles size={8} className="text-white" />
          </motion.span>
        )}
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
          {open ? <X size={22} className="text-white" /> : <Bot size={24} className="text-white" />}
        </motion.span>
        {!open && <span className="absolute inset-0 -z-10 animate-pulse-slow rounded-full bg-twin-blue/40 blur-xl" />}
      </motion.button>
    </>
  );
}
