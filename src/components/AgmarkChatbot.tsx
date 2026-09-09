import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

export const AgmarkChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([
    { role: 'bot', content: 'Hello! I am the AGMARK Quality Assistant. You can ask me about statutory grading limits, tolerances, or why a specific lot was rejected.' },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInputValue('');

    // Simulate AI response based on keywords
    setTimeout(() => {
      let botResponse = "I can help with AGMARK tolerances, defect rules, and procurement rules. Please ask about 'sprouting', 'mold', 'grade 1', or 'penalty'.";
      const lower = userMessage.toLowerCase();

      if (lower.includes('sprout')) {
        botResponse = 'Under AGMARK Rules, Grade Extra Class allows 0% sprouting. Grade I allows up to 2.0% sprouting. Grade II allows up to 10.0%. Lots exceeding 10% are rejected.';
      } else if (lower.includes('mold') || lower.includes('rot') || lower.includes('black')) {
        botResponse = 'Aspergillus niger (Black Mold) has a very strict tolerance. It must not exceed 1.0% for Grade II or 0.5% for Grade I to prevent contamination of the central buffer storage.';
      } else if (lower.includes('size') || lower.includes('diameter')) {
        botResponse = 'AGMARK defines 5 sizes: Extra Large (>60mm), Large (50-60mm), Medium (40-50mm), Small (30-40mm), and Under-sized (<30mm). Size uniformity must be >90% for Extra Class.';
      } else if (lower.includes('grade 1') || lower.includes('grade i')) {
        botResponse = 'Grade I represents "Fair Average Quality" (FAQ). It requires <5% total cumulative defects, <2% sprouting, and <0.5% mold. It receives the standard base MSP rate without deduction.';
      } else if (lower.includes('reject') || lower.includes('sub-standard')) {
        botResponse = 'A lot is rejected if cumulative defects exceed 10%, mold exceeds 1%, or sprouting exceeds 10%. Rejected lots are not eligible for MSP procurement.';
      }

      setMessages((prev) => [...prev, { role: 'bot', content: botResponse }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 rounded-full shadow-2xl flex items-center justify-center text-white transition-transform hover:scale-110 z-50 group"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-10 right-0 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
            Ask AGMARK Assistant
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-4">
          
          {/* Chat Header */}
          <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <h3 className="font-bold text-sm">AGMARK AI Assistant</h3>
                <p className="text-[10px] text-indigo-200">Statutory Rules Bot</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 p-4 overflow-y-auto max-h-96 space-y-4 bg-slate-50 text-sm">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                  {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                <div className={`p-2.5 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-slate-200 bg-white flex gap-2 shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about sprouting limits..."
              className="flex-1 bg-slate-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
            <button
              onClick={handleSend}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
