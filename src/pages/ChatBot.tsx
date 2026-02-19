import React, { useState, useRef, useEffect } from 'react';
import { Send, X, ChevronDown, ChevronUp, PlusCircle } from 'lucide-react';

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

    // Simulate bot response after a short delay
    setTimeout(() => {
      let botResponse = '';
      
      // Simple response logic based on keywords
      const lowerCaseMessage = message.toLowerCase();
      if (lowerCaseMessage.includes('estudio') || lowerCaseMessage.includes('radiografía') || 
          lowerCaseMessage.includes('tomografía') || lowerCaseMessage.includes('resonancia')) {
        botResponse = 'Puedes filtrar por tipo de estudio usando el selector en la barra de búsqueda.';
      } else if (lowerCaseMessage.includes('paciente') || lowerCaseMessage.includes('buscar')) {
        botResponse = 'Para buscar un paciente, escribe su nombre o ID en el campo de búsqueda principal.';
      } else if (lowerCaseMessage.includes('filtro') || lowerCaseMessage.includes('avanzado')) {
        botResponse = 'Haz clic en "Mostrar filtros avanzados" para acceder a más opciones de filtrado como fecha y médico.';
      } else if (lowerCaseMessage.includes('fecha')) {
        botResponse = 'Puedes filtrar por fecha usando los filtros avanzados. Haz clic en "Mostrar filtros avanzados".';
      } else if (lowerCaseMessage.includes('pendiente') || lowerCaseMessage.includes('nuevo') || 
                lowerCaseMessage.includes('revisado') || lowerCaseMessage.includes('estado')) {
        botResponse = 'Puedes filtrar por estado del estudio seleccionando la opción correspondiente en el menú desplegable.';
      } else if (lowerCaseMessage.includes('hola') || lowerCaseMessage.includes('saludos')) {
        botResponse = '¡Hola! Soy el asistente virtual del sistema. ¿En qué puedo ayudarte hoy?';
      } else if (lowerCaseMessage.includes('ayuda') || lowerCaseMessage.includes('ayúdame')) {
        botResponse = 'Puedo ayudarte con:\n- Búsqueda de pacientes\n- Filtrado de estudios\n- Navegación del sistema\n- Información sobre estados de los estudios';
      } else {
        botResponse = 'No estoy seguro de cómo ayudarte con eso. ¿Podrías reformular tu pregunta? Puedo ayudarte con búsquedas, filtros o información sobre el sistema.';
      }

      const newBotMessage: Message = {
        id: Date.now().toString(),
        text: botResponse,
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
        className="fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all duration-200 z-50"
        onClick={toggleChat}
      >
        {isOpen ? <X size={24} /> : <Send size={24} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 bg-white rounded-lg shadow-xl w-96 z-40 transition-all duration-300 flex flex-col border border-gray-200">
          {/* Chat header */}
          <div className="bg-green-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">Asistente Virtual</h3>
            <div className="flex gap-2">
              <button onClick={toggleMinimize} className="hover:bg-green-700 p-1 rounded">
                {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              <button onClick={toggleChat} className="hover:bg-green-700 p-1 rounded">
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages container */}
              <div className="p-4 h-96 overflow-y-auto bg-gray-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`p-3 rounded-lg max-w-xs lg:max-w-md ${
                        msg.sender === 'user'
                          ? 'bg-orange-500 text-white'
                          : 'bg-green-100 text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-orange-100' : 'text-gray-500'}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick questions */}
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Preguntas frecuentes:</p>
                <div className="flex flex-wrap gap-2">
                  {commonQuestions.map((question, index) => (
                    <button
                      key={index}
                      className="text-xs bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1 text-gray-700 transition-colors"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input area */}
              <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
                <div className="relative">
                  <textarea
                    className="w-full border border-gray-300 rounded-md pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    placeholder="Escribe un mensaje..."
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    className="absolute right-2 bottom-2 text-green-600 hover:text-green-800"
                    onClick={handleSendMessage}
                  >
                    <Send size={20} />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>Presiona Enter para enviar</span>
                  <button className="flex items-center text-green-600 hover:text-green-800">
                    <PlusCircle size={14} className="mr-1" /> Adjuntar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;