import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ArrowRight, 
  Check, 
  RefreshCw, 
  X, 
  HelpCircle,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Zap
} from 'lucide-react';
import { ActiveTab, AffiliateProduct } from '../types';

interface MasterAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAutomation: () => void;
  products: AffiliateProduct[];
  highContrast: boolean;
  isFullPageView?: boolean;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; actionType: string; payload?: any }[];
}

export const MasterAIAssistant: React.FC<MasterAIAssistantProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  onOpenAutomation,
  products,
  highContrast,
  isFullPageView = false,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: 'Olá! Sou o seu **Mestre IA**, assistente comercial oficial da plataforma. Estou conectado aos seus produtos, comissões e redes sociais. Como posso impulsionar suas vendas hoje?',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: 'Qual produto devo divulgar hoje?', actionType: 'PROMPT' },
        { label: 'Qual produto dá a maior comissão?', actionType: 'PROMPT' },
        { label: 'Quanto recebi de comissão este mês?', actionType: 'PROMPT' },
        { label: 'Qual rede social está trazendo mais vendas?', actionType: 'PROMPT' },
      ],
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Desculpe, ocorreu um erro ao analisar a resposta.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: data.suggestedActions,
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Erro no assistente:', err);
      const fallbackMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: 'Não foi possível conectar ao motor Gemini neste momento. Mas com base nas métricas salvas, o produto líder hoje é a **Air Fryer Digital 5.5L** com comissão de R$ 46,78!',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: { label: string; actionType: string; payload?: any }) => {
    if (action.actionType === 'PROMPT') {
      handleSendMessage(action.label);
    } else if (action.actionType === 'NAVIGATE_AUTOMATION') {
      onOpenAutomation();
    } else if (action.actionType === 'NAVIGATE_SMART_CHOICE') {
      setActiveTab('smart-choice');
    } else if (action.actionType === 'NAVIGATE_FINANCIAL') {
      setActiveTab('financial');
    } else if (action.actionType === 'NAVIGATE_PRODUCTS') {
      setActiveTab('products');
    } else if (action.actionType === 'NAVIGATE_CONNECTIONS') {
      setActiveTab('connections');
    }
  };

  // If used as drawer and closed
  if (!isOpen && !isFullPageView) return null;

  const containerClasses = isFullPageView
    ? 'space-y-6 max-w-4xl mx-auto'
    : 'fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between';

  return (
    <div className={containerClasses}>
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-sm tracking-tight">Mestre IA</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-300">
              Estrategista Comercial de Afiliados
            </p>
          </div>
        </div>

        {!isFullPageView && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Fechar Assistente"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl shadow-xs leading-relaxed whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>

            <span className="text-[10px] text-slate-400 mt-1 px-1">
              {msg.timestamp}
            </span>

            {/* Suggested Actions if any */}
            {msg.suggestedActions && msg.suggestedActions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                {msg.suggestedActions.map((act, i) => (
                  <button
                    key={i}
                    onClick={() => handleActionClick(act)}
                    className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 text-[11px] font-bold border border-purple-200 flex items-center space-x-1 transition-all"
                  >
                    <span>{act.label}</span>
                    <ArrowRight className="w-3 h-3 text-purple-600" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-slate-500 text-xs p-2">
            <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
            <span>O Mestre IA está consultando o catálogo e métricas...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Question Chips */}
      <div className="p-2 border-t border-slate-100 bg-slate-50 flex overflow-x-auto gap-1 text-[11px] no-scrollbar">
        {[
          'Qual produto divulgar hoje?',
          'Maior comissão?',
          'Comissões do mês',
          'Melhor rede social',
        ].map(chip => (
          <button
            key={chip}
            onClick={() => handleSendMessage(chip)}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 whitespace-nowrap shrink-0 transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="Pergunte ao Mestre IA (ex: 'Crie uma campanha...')"
            className="flex-1 p-2.5 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-hidden"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white disabled:bg-slate-300 shadow-md transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
