import React, { useState, useRef, useEffect } from 'react';
import { Send, X, ChevronDown, ChevronUp, PlusCircle, Bot } from 'lucide-react';
import { getBotResponse } from '../utils/ChatBotResponses';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hola, soy tu asistente virtual. ¿En qué puedo ayudarte hoy con tu búsqueda de pacientes?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    setTimeout(() => {
      
      const lowerCaseMessage = message.toLowerCase();

      const newBotMessage: Message = {
        id: Date.now().toString(),
        text: getBotResponse(lowerCaseMessage),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newBotMessage]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Common questions
  const commonQuestions = [
    "¿Cómo busco un paciente?",
    "¿Cómo filtro por tipo de estudio?",
    "¿Cómo veo los estudios pendientes?",
    "¿Cómo uso los filtros avanzados?"
  ];

  const handleQuickQuestion = (question: string) => {
    setMessage(question);
    // Focus on the input after setting the message
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  return (
    <>
      {/* Chat button */}
      <button
        className="fixed bottom-6 right-6 z-50 rounded-full bg-[#26a69a] p-4 text-white shadow-lg transition-all duration-200 hover:bg-[#1f8c81]"
        onClick={toggleChat}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 flex w-96 max-w-[calc(100vw-1.5rem)] max-h-[calc(100dvh-7rem)] flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-900">
          {/* Chat header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#26a69a] to-[#1f8c81] px-4 py-3 text-white">
            <h3 className="font-bold">Asistente Virtual</h3>
            <div className="flex gap-2">
              <button onClick={toggleMinimize} className="rounded p-1 hover:bg-white/10">
                {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              <button onClick={toggleChat} className="rounded p-1 hover:bg-white/10">
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex min-h-0 flex-1 flex-col">
              {/* Messages container */}
              <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-950/40">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`p-3 rounded-lg max-w-xs lg:max-w-md ${
                        msg.sender === 'user'
                          ? 'bg-[#26a69a] text-white'
                          : 'bg-white text-slate-800 border border-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <p className={`mt-1 text-xs ${msg.sender === 'user' ? 'text-white/70' : 'text-slate-500'}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick questions */}
              <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-800 dark:bg-slate-950/40">
                <p className="mb-2 text-xs text-slate-500">Preguntas frecuentes:</p>
                <div className="flex flex-wrap gap-2">
                  {commonQuestions.map((question, index) => (
                    <button
                      key={index}
                      className="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-700 transition-colors hover:bg-[#26a69a] hover:text-white"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input area */}
              <div className="border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                <div className="relative">
                  <textarea
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-10 outline-none focus:border-[#26a69a] focus:ring-2 focus:ring-[#26a69a]/20 dark:border-slate-700 dark:bg-slate-950/40 dark:text-white"
                    placeholder="Escribe un mensaje..."
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    className="absolute right-2 bottom-2 text-[#26a69a] hover:text-[#1f8c81]"
                    onClick={handleSendMessage}
                  >
                    <Send size={20} />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Presiona Enter para enviar</span>
                  <button className="flex items-center text-[#26a69a] hover:text-[#1f8c81]">
                    <PlusCircle size={14} className="mr-1" /> Adjuntar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;