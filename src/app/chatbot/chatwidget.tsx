'use client';

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';

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
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center"
      >
        💬
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-85 h-120 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <div>
              <p className="font-semibold text-sm">MediStore AI Assistant</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Prisma-backed medicine helper</p>
            </div>
            <button onClick={clearChat} className="text-xs text-blue-600 hover:underline">
              Clear
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="flex flex-wrap gap-2 mb-3">
              {SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  onClick={() => sendMessage(question)}
                  className="rounded-full border px-3 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {question}
                </button>
              ))}
            </div>

            {messages.map((msg, i) => (
              <div key={i} className="mb-2">
                <b>{msg.role}:</b> {msg.content}
              </div>
            ))}

            {loading && <p>Typing...</p>}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="কিছু জিজ্ঞেস করুন..."
              className="flex-1 border px-3 py-2 rounded"
            />

            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}