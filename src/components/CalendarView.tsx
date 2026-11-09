import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Sparkles, 
  Flame, 
  ShoppingBag, 
  Send, 
  Plus, 
  Edit3, 
  Trash2,
  Tag
} from 'lucide-react';
import { Publication, AffiliateProduct } from '../types';

interface CalendarViewProps {
  publications: Publication[];
  products: AffiliateProduct[];
  onReschedule: (id: string, newDate: string) => void;
  onOpenAutomation: () => void;
  highContrast: boolean;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  publications,
  products,
  onReschedule,
  onOpenAutomation,
  highContrast,
}) => {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // AI Optimal times suggestions
  const aiSmartTimes = [
    { hour: '12:30', reason: 'Horário de Almoço (Pico de Engajamento no TikTok & Reels)' },
    { hour: '19:45', reason: 'Horário Nobre da Noite (Maior taxa de conversão em e-commerce)' },
    { hour: '21:15', reason: 'Relaxamento Noturno (Compras por impulso em Casa & Cozinha)' },
  ];

  // Retail promotional dates
  const retailPromoDates = [
    { date: '15 Nov', title: 'Esquenta Black Friday Brasil', tip: 'Focar em eletrônicos e utilidades domésticas' },
    { date: '27 Nov', title: 'Black Friday Oficial 2026', tip: 'Comissões extras de até 20% no Mercado Livre e Shopee' },
    { date: '30 Nov', title: 'Cyber Monday Tech', tip: 'Produtos com alta margem e cupons no TikTok Shop' },
  ];

  // Days for the week view (Nov 8 to Nov 14, 2026)
  const weekDays = [
    { dayName: 'Domingo', dateStr: '08/11', fullDate: '2026-11-08' },
    { dayName: 'Segunda', dateStr: '09/11', fullDate: '2026-11-09', isToday: true },
    { dayName: 'Terça', dateStr: '10/11', fullDate: '2026-11-10' },
    { dayName: 'Quarta', dateStr: '11/11', fullDate: '2026-11-11' },
    { dayName: 'Quinta', dateStr: '12/11', fullDate: '2026-11-12' },
    { dayName: 'Sexta', dateStr: '13/11', fullDate: '2026-11-13' },
    { dayName: 'Sábado', dateStr: '14/11', fullDate: '2026-11-14' },
  ];

  const getPubsForDate = (dateStr: string) => {
    return publications.filter(p => p.scheduledTime.startsWith(dateStr));
  };

  return (
    <div className="space-y-6">
      
      {/* Header and View Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center space-x-2">
            <CalendarIcon className="w-6 h-6 text-emerald-600" />
            <span>Calendário Inteligente de Campanhas</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Planejamento automatizado com sugestões de horários de pico e datas promocionais do varejo nacional.
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('day')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'day' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dia
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'week' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'month' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mês
          </button>
        </div>
      </div>

      {/* AI Suggestions & Retail Promo Dates Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Peak Hours AI Suggestion */}
        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Sugestões da IA: Melhores Horários de Pico</span>
          </div>
          <div className="space-y-1.5">
            {aiSmartTimes.map((st, i) => (
              <div key={i} className="flex items-center space-x-2 text-xs text-slate-700 bg-white p-2 rounded-lg border border-emerald-100">
                <span className="font-black text-emerald-700 font-mono">{st.hour}</span>
                <span className="text-slate-400">•</span>
                <span className="text-[11px] text-slate-600 font-medium">{st.reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Retail Calendar Highlights */}
        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
          <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs">
            <Flame className="w-4 h-4 text-amber-600" />
            <span>Datas Promocionais do Varejo (Novembro 2026)</span>
          </div>
          <div className="space-y-1.5">
            {retailPromoDates.map((rp, i) => (
              <div key={i} className="flex items-center space-x-2 text-xs text-slate-700 bg-white p-2 rounded-lg border border-amber-100">
                <span className="font-black text-amber-700 font-mono shrink-0">{rp.date}</span>
                <span className="text-slate-400">•</span>
                <div className="truncate">
                  <strong className="text-slate-900 font-bold">{rp.title}: </strong>
                  <span className="text-[11px] text-slate-500">{rp.tip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Week Calendar Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-black text-slate-900 text-sm">Novembro de 2026</span>
            <span className="text-xs text-slate-500 font-medium">Semana 46</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenAutomation}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agendar Campanha</span>
            </button>
          </div>
        </div>

        {/* Calendar Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-slate-100 min-h-[420px]">
          {weekDays.map(day => {
            const dayPubs = getPubsForDate(day.fullDate);

            return (
              <div
                key={day.fullDate}
                className={`p-3 space-y-2 flex flex-col justify-between ${
                  day.isToday ? 'bg-emerald-50/30' : 'bg-white'
                }`}
              >
                <div>
                  {/* Day Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">{day.dayName}</span>
                    <span className={`text-xs font-black px-1.5 py-0.5 rounded-md ${
                      day.isToday ? 'bg-emerald-600 text-white' : 'text-slate-800'
                    }`}>
                      {day.dateStr}
                    </span>
                  </div>

                  {/* Scheduled items */}
                  <div className="space-y-2 mt-2">
                    {dayPubs.map(pub => (
                      <div
                        key={pub.id}
                        className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 shadow-xs space-y-1.5 text-xs transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 text-slate-700">
                            {pub.channel}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {new Date(pub.scheduledTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="font-bold text-slate-900 line-clamp-1 text-[11px]" title={pub.productName}>
                          {pub.productName}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-emerald-700 font-bold">
                          <span>{pub.status}</span>
                        </div>
                      </div>
                    ))}

                    {dayPubs.length === 0 && (
                      <div className="py-8 text-center text-slate-300 text-xs">
                        Sem agendamentos
                      </div>
                    )}
                  </div>
                </div>

                {/* Day Footer suggestion */}
                <div className="pt-2 text-center">
                  <button
                    onClick={onOpenAutomation}
                    className="w-full text-[10px] font-bold text-emerald-700 hover:text-emerald-800 py-1 rounded bg-slate-50 hover:bg-emerald-50"
                  >
                    + Agendar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
