import React from 'react';
import { 
  LayoutDashboard, 
  Cpu,
  ShoppingBag, 
  Sparkles, 
  Wand2, 
  Palette, 
  Link2, 
  Send, 
  Calendar, 
  DollarSign, 
  Network, 
  Bot, 
  FileText
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  highContrast: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, highContrast }) => {
  const menuItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Painel Principal', icon: LayoutDashboard },
    { id: 'autonomy', label: 'Autonomia Total', icon: Cpu, badge: '24/7 Piloto' },
    { id: 'products', label: 'Central de Produtos', icon: ShoppingBag, badge: 'Catálogo' },
    { id: 'smart-choice', label: 'Escolha Inteligente', icon: Sparkles, badge: 'IA Score' },
    { id: 'automation', label: 'Automação 1-Clique', icon: Wand2, badge: 'Auto' },
    { id: 'content-studio', label: 'Fábrica de Conteúdo', icon: Palette },
    { id: 'links', label: 'Links de Afiliados', icon: Link2 },
    { id: 'publications', label: 'Central de Publicações', icon: Send },
    { id: 'calendar', label: 'Calendário Inteligente', icon: Calendar },
    { id: 'financial', label: 'Financeiro de Comissões', icon: DollarSign },
    { id: 'connections', label: 'Conexões & Redes', icon: Network },
    { id: 'assistant', label: 'Assistente Mestre IA', icon: Bot },
    { id: 'audit-logs', label: 'Auditoria & Logs', icon: FileText },
  ];

  return (
    <aside className={`w-64 shrink-0 border-r min-h-[calc(100vh-5.5rem)] flex flex-col justify-between p-4 transition-colors ${
      highContrast 
        ? 'bg-black text-white border-yellow-400' 
        : 'bg-slate-50/70 border-slate-200'
    }`}>
      <div>
        <div className="px-3 mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Navegação da Plataforma
          </p>
        </div>

        <nav className="space-y-1" aria-label="Navegação Principal">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all text-left ${
                  isActive
                    ? highContrast
                      ? 'bg-yellow-400 text-black ring-2 ring-white font-black'
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : highContrast
                      ? 'hover:bg-slate-800 text-white'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-emerald-700 text-emerald-100' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className={`mt-6 p-3.5 rounded-xl border text-xs ${
        highContrast
          ? 'border-yellow-400 bg-slate-900 text-yellow-300'
          : 'border-slate-200 bg-white text-slate-600'
      }`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-bold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Motor de IA Ativo</span>
          </span>
          <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">v2.4</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Monitoramento em tempo real de links, posts agendados e comissões.
        </p>
      </div>
    </aside>
  );
};
