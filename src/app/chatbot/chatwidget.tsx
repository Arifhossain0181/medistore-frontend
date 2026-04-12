'use client';

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { MessageCircle, SendHorizonal, Sparkles, Trash2, X } from 'lucide-react';

type Role = 'user' | 'assistant';

interface Message {
  role: Role;
  content: string;
}

const SUGGESTED_QUESTIONS: string[] = [
  'Napa Extra কখন খাব?',
  'মাথাব্যথায় কোন ওষুধ?',
  'Paracetamol এর side effects?',
];

export default function ChatWidget() {
  const [open, setOpen] = useState<boolean>(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'হ্যালো! আমি MediStore AI Assistant 💊\nযেকোনো medicine সম্পর্কে জিজ্ঞেস করুন।',
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const handleOpenChat = () => {
      setOpen(true);
    };

    window.addEventListener('medistore:open-chat', handleOpenChat);
    return () => {
      window.removeEventListener('medistore:open-chat', handleOpenChat);
    };
  }, []);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;

    const userMsg: Message = { role: 'user', content };
    const updatedMessages: Message[] = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      if (!res.ok) {
        const rawText = await res.text();
        throw new Error(rawText || `Request failed (${res.status})`);
      }

      const data: {
        success: boolean;
        data?: { reply: string };
        message?: string;
      } = await res.json();

      if (data.success && data.data) {
        const reply = data.data?.reply || 'উত্তর পাওয়া যায়নি। আবার চেষ্টা করুন।';
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: reply },
        ]);
      } else {
        throw new Error(data.message || 'Unknown error');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'সংযোগ সমস্যা';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `দুঃখিত, এখন সমস্যা হচ্ছে: ${message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = (): void => {
    setMessages([
      {
        role: 'assistant',
        content:
          'হ্যালো! আমি MediStore AI Assistant 💊\nযেকোনো medicine সম্পর্কে জিজ্ঞেস করুন।',
      },
    ]);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        className="fixed right-4 bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200/60 bg-linear-to-br from-emerald-500 to-cyan-500 text-white shadow-[0_18px_40px_-16px_rgba(15,23,42,0.65)] transition-transform duration-300 hover:scale-105 dark:border-slate-700 sm:right-6 sm:bottom-6"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed right-4 bottom-20 left-4 z-50 flex h-[72vh] max-h-[640px] w-auto flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-slate-50/95 shadow-[0_28px_70px_-34px_rgba(15,23,42,0.75)] backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95 sm:right-6 sm:bottom-24 sm:left-auto sm:h-[70vh] sm:w-[calc(100vw-2rem)] sm:max-w-[390px]">
          <div className="flex items-center justify-between border-b border-emerald-100 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/80">
            <div className="flex items-start gap-2">
              <div className="rounded-md bg-emerald-100 p-1.5 dark:bg-emerald-900/45">
                <Sparkles className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">MediStore AI Assistant</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Prisma-backed medicine helper</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-2.5 py-3 sm:px-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  onClick={() => sendMessage(question)}
                  className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs text-slate-700 transition hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {question}
                </button>
              ))}
            </div>

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="mb-2 inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Typing
                <span className="animate-pulse">.</span>
                <span className="animate-pulse [animation-delay:150ms]">.</span>
                <span className="animate-pulse [animation-delay:300ms]">.</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 border-t border-emerald-100 bg-white/75 p-2.5 dark:border-slate-700 dark:bg-slate-900/85 sm:p-3">
            <input
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="কিছু জিজ্ঞেস করুন..."
              className="flex-1 rounded-lg border border-emerald-100 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-emerald-300 placeholder:text-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />

            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <SendHorizonal className="h-4 w-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}