import React from 'react';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  Type, 
  Bot, 
  ShieldCheck, 
  Zap, 
  Bell,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAutomation: () => void;
  onToggleAssistant: () => void;
  isAssistantOpen: boolean;
  fontSize: 'normal' | 'large' | 'xl';
  setFontSize: (size: 'normal' | 'large' | 'xl') => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  isAutonomyActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAutomation,
  onToggleAssistant,
  isAssistantOpen,
  fontSize,
  setFontSize,
  highContrast,
  setHighContrast,
  isAutonomyActive = true,
}) => {
  const cycleFontSize = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('xl');
    else setFontSize('normal');
  };

  return (
    <header className={`sticky top-0 z-40 border-b shadow-xs transition-colors ${
      highContrast 
        ? 'bg-black text-white border-yellow-400' 
        : 'bg-white text-slate-800 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Platform Badge */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Zap className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  AFILIADO <span className="text-emerald-600 dark:text-emerald-400">IA</span>
                </span>
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Central Inteligente de Marketing de Afiliados
              </p>
            </div>
          </div>

          {/* Autonomy Badge + Primary Action Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick Autopilot Indicator */}
            <button
              onClick={() => setActiveTab('autonomy')}
              className={`hidden sm:flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                isAutonomyActive
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
              title="Clique para gerenciar o Modo de Autonomia Total"
            >
              <span className={`w-2 h-2 rounded-full ${isAutonomyActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{isAutonomyActive ? 'Autonomia 24/7 Ativa' : 'Autonomia Pausada'}</span>
            </button>

            {/* Primary Action Button (Requirement 16) */}
            <button
              onClick={onOpenAutomation}
              className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold shadow-lg transition-all transform active:scale-95 ${
                highContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300 ring-2 ring-white'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/30'
              }`}
              title="Iniciar processo guiado com IA"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-xs sm:text-sm tracking-wide uppercase">
                Escolher Produto e Criar Campanha
              </span>
            </button>

            {/* Accessibility & Control Bar */}
            <div className="flex items-center space-x-1 border-l border-slate-200 dark:border-slate-700 pl-2 sm:pl-3">
              
              {/* Font Size Adjuster */}
              <button
                onClick={cycleFontSize}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                title={`Ajustar tamanho da fonte: Atual ${fontSize.toUpperCase()}`}
                aria-label="Ajustar tamanho da fonte"
              >
                <div className="flex items-center font-bold text-xs">
                  <Type className="w-4 h-4 mr-0.5" />
                  <span>{fontSize === 'normal' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}</span>
                </div>
              </button>

              {/* High Contrast Toggle */}
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`p-2 rounded-lg transition-colors ${
                  highContrast 
                    ? 'bg-yellow-400 text-black font-bold' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
                title={highContrast ? 'Desativar Alto Contraste' : 'Ativar Alto Contraste para Acessibilidade'}
                aria-label="Alternar Alto Contraste"
              >
                {highContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Master AI Assistant Button */}
              <button
                onClick={onToggleAssistant}
                className={`relative flex items-center space-x-1 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                  isAssistantOpen
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                }`}
                title="Abrir Assistente Mestre IA"
              >
                <Bot className="w-4 h-4 text-purple-600 group-hover:text-purple-800" />
                <span className="hidden md:inline">Mestre IA</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </button>

            </div>

          </div>

        </div>
      </div>
      
      {/* Compliance & Business Model Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1 px-4 text-center border-t border-slate-800 flex items-center justify-center space-x-4">
        <span className="flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
          <span>Modelo de Afiliado Oficial: 100% Comissão de Vendas • Sem Estoque • Sem Logística</span>
        </span>
        <span className="hidden md:inline text-slate-500">|</span>
        <span className="hidden md:inline text-slate-400">APIs Oficiais: Mercado Livre • Shopee • TikTok Shop</span>
      </div>
    </header>
  );
};
