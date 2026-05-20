"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text);
const getDirection = (text: string) => isArabic(text) ? 'rtl' : 'ltr';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

// Helper function to dynamically format plain text into Markdown
const formatToMarkdown = (text: string) => {
  if (!text) return text;
  let formatted = text;

  // Convert "1- ", "2- " into proper Markdown numbered lists "1. ", "2. "
  formatted = formatted.replace(/(^|\n)(\d+)(-|:)\s/g, '$1$2. ');

  // Highlight Arabic list starters
  formatted = formatted.replace(/(^|\n)(أولا|ثانيا|ثالثا|رابعا|خامسا|سادسا|أخيراً)(:|-)?\s/g, '$1**$2:** ');

  // If the model outputs inline bullet points like "text - point1 - point2", break them into lines
  formatted = formatted.replace(/([^\n])\s+-\s/g, '$1\n- ');

  // Make sure bold markers "**" are properly spaced if they get glued to words
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '**$1**');

  return formatted;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'مرحباً بك! أنا سوبو (SOPO)، المساعد الذكي الخاص بك في المنصة. كيف يمكنني مساعدتك؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // For typing effect (real streaming now)
  const [typingMessage, setTypingMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingMessage, isOpen, isLoading, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setTypingMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setIsLoading(false);
      setIsTyping(true);

      if (!response.body) throw new Error('No stream body');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        
        // Parse the chunk. Handle SSE or raw text.
        if (chunk.includes('data:')) {
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.trim().startsWith('data:')) {
              const dataStr = line.replace(/^data:/, '').trim();
              if (dataStr === '[DONE]') continue;
              if (!dataStr) continue;
              try {
                const data = JSON.parse(dataStr);
                const text = data.choices?.[0]?.delta?.content || data.response || data.text || data.message || '';
                fullContent += text;
              } catch (err) {
                // Not JSON, might be raw text after data:
                fullContent += dataStr;
              }
            }
          }
        } else {
          // Assume raw text or generic JSON
          try {
            const data = JSON.parse(chunk);
            const text = data.choices?.[0]?.delta?.content || data.response || data.text || data.message || '';
            fullContent += text;
          } catch {
            fullContent += chunk;
          }
        }
        
        setTypingMessage(fullContent);
      }
      
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', content: fullContent }]);
      setTypingMessage('');
    } catch (error) {
      console.error('Chat error:', error);
      setIsLoading(false);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', content: 'عذراً، حدث خطأ أثناء الاتصال بالخادم.' }]);
      setTypingMessage('');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full bg-black border border-gray-800 shadow-lg shadow-blue-900/30 hover:border-blue-500/50 hover:scale-105 active:scale-95 transition-all z-50 flex items-center justify-center overflow-hidden ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <img src="/assets/sopo_logo.gif" alt="Open Chat" className="w-full h-full object-cover scale-[1.15]" />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 w-96 h-[34rem] max-h-[85vh] bg-[#0a0a0a] border border-gray-800 rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#0f0f0f] rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-black border border-gray-800 flex items-center justify-center overflow-hidden shadow-inner">
              <img src="/assets/sopo_logo.gif" alt="SOPO AI" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-100 text-sm">SOPO AI</h3>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors bg-gray-800/50 hover:bg-gray-700/50 p-1.5 rounded-full">
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[#0a0a0a]">
          {messages.map((msg, idx) => {
            const dir = getDirection(msg.content);
            return (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  dir={dir}
                  className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-sm' 
                      : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-sm prose prose-invert prose-sm leading-relaxed'
                  } ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                >
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {formatToMarkdown(msg.content)}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* Real-time Streaming Output */}
          {isTyping && (
            <div className="flex justify-start">
              <div 
                dir={getDirection(typingMessage)}
                className={`max-w-[85%] rounded-2xl p-3 bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-sm prose prose-invert prose-sm leading-relaxed ${getDirection(typingMessage) === 'rtl' ? 'text-right' : 'text-left'}`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {formatToMarkdown(typingMessage) + '▋'}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Thinking State */}
          {isLoading && !isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-gray-400 border border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2 text-sm shadow-sm">
                <span className="font-medium text-xs">Thinking</span>
                <span className="flex gap-1 mt-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-800 bg-[#0f0f0f] rounded-b-2xl">
          <form onSubmit={handleSend} className="relative flex items-center mb-2">
            <input
              type="text"
              dir="auto"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full bg-gray-900 border border-gray-700 rounded-full py-3 pl-5 pr-12 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
              disabled={isLoading || isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading || isTyping}
              className="absolute right-2 p-2 rounded-full text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-transparent disabled:text-gray-500 transition-all"
            >
              <Send size={16} className="ml-0.5" />
            </button>
          </form>
          <div className="text-center pt-1 flex items-center justify-center gap-1.5 opacity-60">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">
              Powered by Dragon Ai
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
