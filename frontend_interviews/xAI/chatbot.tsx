import React, {
  useState,
  useRef,
  useEffect,
  FormEvent,
  JSX,
} from 'react';

/**
 * Simulated API:
 * - rejects when message === "42"
 * - otherwise responds after 1.5s
 */
async function simulateApiRequest(userMessage: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    window.setTimeout(() => {
      if (userMessage === '42') {
        reject(new Error('Simulated API error'));
      } else {
        resolve(`Simulated API response to ${userMessage}`);
      }
    }, 1500);
  });
}

type Role = 'user' | 'assistant' | 'system';

interface Message {
  id: number;
  role: Role;
  text: string;
}

const App: React.FC = () => {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const msgRef = useRef<HTMLDivElement | null>(null);

  // auto-scroll to bottom when messages change
  useEffect(() => {
    msgRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const data = query.trim();
    if (!data || loading) return;

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      text: data,
    };

    setMsgs(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const resp = await simulateApiRequest(data);
      const aMsg: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        text: resp,
      };
      setMsgs(prev => [...prev, aMsg]);
    } catch (e: any) {
      const errMsg: Message = {
        id: Date.now() + 2,
        role: 'system',
        text: e?.message || 'Try again',
      };
      setMsgs(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="px-4 py-3 border-b border-slate-800">
        <h1 className="text-base font-semibold text-white">XAI Chatbot</h1>
        <p className="text-xs text-slate-400">
          You can chat now. Type &amp; press Enter.
        </p>
      </header>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Messages list (scrollable) */}
        <main className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {msgs.length === 0 && (
            <div className="mt-6 text-center text-xs text-slate-500">
              You can create a new chat.
            </div>
          )}

          {msgs.map(message => {
            const isUser = message.role === 'user';

            const bubbleClasses =
              'max-w-[80%] rounded-2xl px-3 py-2 text-sm ' +
              (isUser
                ? 'bg-blue-500 text-white rounded-br-sm'
                : message.role === 'assistant'
                ? 'bg-slate-700 text-slate-50 rounded-bl-sm'
                : 'bg-red-900/70 text-red-100 border border-red-500/50 rounded-bl-sm');

            return (
              <div
                key={message.id}
                className={isUser ? 'flex justify-end' : 'flex justify-start'}
              >
                <div className={bubbleClasses}>
                  <span className="block text-[10px] uppercase tracking-wide text-slate-300/80 mb-1">
                    {isUser ? 'You' : 'Assistant'}
                  </span>
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start">
              <div className="px-3 py-2 rounded-2xl bg-slate-700/80 text-xs text-slate-200 italic">
                Assistant is typing…
              </div>
            </div>
          )}

          <div ref={msgRef} />
        </main>

        {/* Input bar (fixed at bottom of viewport area) */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-4 py-3 border-t border-slate-800 bg-slate-900"
        >
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Add a new query"
            className="flex-1 bg-slate-800 text-slate-50 rounded-full px-3 py-2 text-sm
                       border border-slate-700 outline-none
                       placeholder:text-slate-500
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-blue-600 transition-colors"
          >
            {loading ? 'Sending…' : 'Submit Query'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
