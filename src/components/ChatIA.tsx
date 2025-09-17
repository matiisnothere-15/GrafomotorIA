import React, { useState, useRef, useEffect } from 'react';
import { iaService } from '../services/iaService';
import { openAIService } from '../services/openaiService';
import type { ChatMessage } from '../services/iaService';
import IconoIA from './IconoIA';
import './ChatIA.css';

interface ChatIAProps {
  tipoEjercicio?: string;
  figuraObjetivo?: string;
  descripcionTrazado?: string;
  nivelActual?: string;
  dificultades?: string[];
  progreso?: string;
  perfilPaciente?: {
    nombre: string;
    id: string;
    edad?: string;
    diagnostico?: string;
  };
}

const ChatIA: React.FC<ChatIAProps> = ({
  tipoEjercicio,
  figuraObjetivo,
  descripcionTrazado,
  nivelActual,
  dificultades = [],
  progreso,
  perfilPaciente
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await openAIService.chatGeneral(inputMessage.trim(), perfilPaciente);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error en ChatIA:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    setIsLoading(true);
    
    try {
      let response: string;
      
      switch (action) {
        case 'analizar':
          if (descripcionTrazado && figuraObjetivo) {
            response = await openAIService.analizarTrazado(descripcionTrazado, figuraObjetivo);
          } else {
            response = 'No hay información de trazado disponible para analizar.';
          }
          break;
        case 'sugerir':
          if (nivelActual && dificultades.length > 0) {
            response = await openAIService.sugerirEjercicios(nivelActual, dificultades, perfilPaciente);
          } else {
            response = 'No hay información suficiente para sugerir ejercicios.';
          }
          break;
        case 'motivar':
          if (progreso && perfilPaciente) {
            response = await openAIService.generarFeedbackPersonalizado(progreso, perfilPaciente);
          } else if (progreso) {
            response = await openAIService.generarMotivacion(progreso);
          } else {
            response = '¡Sigue así! Cada ejercicio te ayuda a mejorar tu coordinación y motricidad fina.';
          }
          break;
        default:
          response = 'Acción no reconocida.';
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error en acción rápida:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isOpen) {
    return (
      <div className="chat-ia-toggle-button" onClick={toggleChat}>
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '70px',
          height: '70px',
          background: '#dc2626',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(220, 38, 38, 0.3)',
          color: 'white',
          fontSize: '24px',
          zIndex: 1000
        }}>
          <IconoIA size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className={`chat-ia-container ${isMinimized ? 'chat-ia-minimized' : ''}`}>
      <div className="chat-ia-header" onClick={toggleMinimize}>
        <div className="chat-ia-title">Asistente IA</div>
        <button className="chat-ia-toggle" onClick={(e) => {
          e.stopPropagation();
          setIsOpen(false);
        }}>
          ×
        </button>
      </div>
      
      {!isMinimized && (
        <div className="chat-ia-body">
          <div className="chat-ia-quick-actions">
            {descripcionTrazado && figuraObjetivo && (
              <button 
                className="chat-ia-quick-action"
                onClick={() => handleQuickAction('analizar')}
                disabled={isLoading}
              >
                Analizar trazado
              </button>
            )}
            {nivelActual && dificultades.length > 0 && (
              <button 
                className="chat-ia-quick-action"
                onClick={() => handleQuickAction('sugerir')}
                disabled={isLoading}
              >
                Sugerir ejercicios
              </button>
            )}
            <button 
              className="chat-ia-quick-action"
              onClick={() => handleQuickAction('motivar')}
              disabled={isLoading}
            >
              Motivación
            </button>
          </div>

          <div className="chat-ia-messages">
            {messages.length === 0 && (
              <div className="chat-ia-message assistant">
                ¡Hola! Soy tu asistente de IA para ejercicios de grafomotricidad. 
                Puedo ayudarte a analizar trazos, sugerir ejercicios y motivarte en tu progreso.
              </div>
            )}
            
            {messages.map((message, index) => (
              <div key={index} className={`chat-ia-message ${message.role}`}>
                {message.content}
              </div>
            ))}
            
            {isLoading && (
              <div className="chat-ia-message assistant">
                <div className="chat-ia-loading">
                  <span>Pensando</span>
                  <div className="chat-ia-loading-dot"></div>
                  <div className="chat-ia-loading-dot"></div>
                  <div className="chat-ia-loading-dot"></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-ia-input-container">
            <textarea
              className="chat-ia-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              rows={1}
              disabled={isLoading}
            />
            <button
              className="chat-ia-send"
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatIA;
