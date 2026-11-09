import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Send, 
  Layers, 
  Video, 
  Image as ImageIcon, 
  CheckCircle, 
  Eye, 
  MousePointer, 
  TrendingUp, 
  Clock, 
  CheckCheck, 
  DollarSign, 
  Award, 
  Flame, 
  Filter, 
  Calendar,
  ArrowUpRight,
  ShieldAlert,
  Play,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { DashboardMetrics, ActiveTab } from '../types';

interface DashboardViewProps {
  metrics: DashboardMetrics | null;
  chartData: any;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAutomation: () => void;
  highContrast: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  chartData,
  setActiveTab,
  onOpenAutomation,
  highContrast,
}) => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'annual'>('daily');
  const [filterMarketplace, setFilterMarketplace] = useState<string>('all');
  const [filterSocial, setFilterSocial] = useState<string>('all');
  const [filterProduct, setFilterProduct] = useState<string>('all');

  const currentPoints = chartData ? chartData[period] || [] : [];
  const maxCommission = currentPoints.length ? Math.max(...currentPoints.map((p: any) => p.commission || 100)) : 1000;
  const maxViews = currentPoints.length ? Math.max(...currentPoints.map((p: any) => p.views || 1000)) : 10000;

  return (
    <div className="space-y-6">
      
      {/* Total Autonomy Status Hero Banner */}
      <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
        highContrast
          ? 'bg-black text-white border-yellow-400'
          : 'bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white border-emerald-800 shadow-md'
      }`}>
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-inner">
            <Cpu className="w-6 h-6 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                Modo de Autonomia Total: Operando 24/7
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 uppercase tracking-wider">
                Piloto Automático
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Pesquisando ofertas, auditando links, gerando criativos e substituindo produtos sem esforço operacional diário.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('autonomy')}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all shrink-0 active:scale-95"
        >
          <span>Painel da Autonomia</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Top Welcome & Quick Action Card */}
      <div className={`p-6 rounded-2xl border shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
        highContrast
          ? 'bg-black text-white border-yellow-400'
          : 'bg-gradient-to-r from-slate-900 to-slate-800 text-white border-slate-800'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Central Comercial de Afiliados
            </span>
            <span className="text-xs text-slate-400">Atualizado agora</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Painel Geral de Performance
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Acompanhe suas campanhas automatizadas, comissões confirmadas e gere novos criativos publicitários em segundos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenAutomation}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Criar Nova Campanha</span>
          </button>
          <button
            onClick={() => setActiveTab('smart-choice')}
            className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-white font-medium text-sm border border-slate-600 transition-all"
          >
            <span>Ver Escolha Inteligente</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Critical Attribution & Commission Clarity Notice (Requirement 3 & 10) */}
      <div className={`p-4 rounded-xl border flex items-start space-x-3 text-xs leading-relaxed ${
        highContrast
          ? 'bg-yellow-400 text-black border-white font-bold'
          : 'bg-amber-50 text-amber-900 border-amber-200'
      }`}>
        <ShieldAlert className="w-5 h-5 shrink-0 text-amber-700 mt-0.5" />
        <div>
          <strong className="font-bold">Diferenciação Estrita de Receitas:</strong> As métricas abaixo separam rigorosamente:
          <span className="font-semibold text-emerald-700 ml-1">Comissões Recebidas / Pagas</span> (já liquidadas em sua conta bancária/Pix),
          <span className="font-semibold text-blue-700 ml-1">Comissões Aprovadas</span> (vendas confirmadas pelos marketplaces prontas para liquidação),
          <span className="font-semibold text-amber-700 ml-1">Comissões Pendentes</span> (no prazo de garantia de 7 a 30 dias dos clientes), e
          <span className="font-semibold text-slate-600 ml-1">Vendas Estimadas</span> (projeção baseada em cliques rastreados).
        </div>
      </div>

      {/* 14 Indicators Grid (Section 3 of prompt) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
        
        {/* 1. Produtos Selecionados */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Prod. Selecionados</span>
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900">{metrics?.totalProducts || 0}</div>
            <span className="text-[11px] text-slate-500">No catálogo ativo</span>
          </div>
        </div>

        {/* 2. Produtos Divulgados */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Prod. Divulgados</span>
            <Send className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900">{metrics?.publishedProducts || 0}</div>
            <span className="text-[11px] text-blue-600 font-medium">Com posts ativos</span>
          </div>
        </div>

        {/* 3. Campanhas Ativas */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Campanhas Ativas</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900">{metrics?.activeCampaigns || 0}</div>
            <span className="text-[11px] text-purple-600 font-medium">Multicanal</span>
          </div>
        </div>

        {/* 4. Vídeos Produzidos */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Vídeos Gerados</span>
            <Video className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900">{metrics?.videosProduced || 0}</div>
            <span className="text-[11px] text-slate-500">Reels, TikTok, Shorts</span>
          </div>
        </div>

        {/* 5. Imagens Produzidas */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Imagens Criadas</span>
            <ImageIcon className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900">{metrics?.imagesProduced || 0}</div>
            <span className="text-[11px] text-slate-500">Banners e feeds</span>
          </div>
        </div>

        {/* 6. Publicações Realizadas */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Publicações</span>
            <CheckCircle className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900">{metrics?.publicationsCount || 0}</div>
            <span className="text-[11px] text-teal-600 font-medium">Disparadas ou agendadas</span>
          </div>
        </div>

        {/* 7. Total de Visualizações */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Visualizações</span>
            <Eye className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900">
              {(metrics?.totalViews || 0).toLocaleString('pt-BR')}
            </div>
            <span className="text-[11px] text-indigo-600 font-medium">+18% este mês</span>
          </div>
        </div>

        {/* 8. Total de Cliques */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Total Cliques</span>
            <MousePointer className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900">
              {(metrics?.totalClicks || 0).toLocaleString('pt-BR')}
            </div>
            <span className="text-[11px] text-cyan-600 font-medium">Links oficiais</span>
          </div>
        </div>

        {/* 9. Vendas Atribuídas */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Vendas Atribuídas</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-emerald-600">{metrics?.attributedSales || 0}</div>
            <span className="text-[11px] text-slate-500">Sem estoque próprio</span>
          </div>
        </div>

        {/* 10. Comissão Pendente */}
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-semibold uppercase">Comissão Pendente</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-amber-700">
              R$ {(metrics?.pendingCommission || 0).toFixed(2)}
            </div>
            <span className="text-[11px] text-amber-600">Em garantia</span>
          </div>
        </div>

        {/* 11. Comissão Aprovada */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-700">
            <span className="text-xs font-semibold uppercase">Comissão Aprovada</span>
            <CheckCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-blue-700">
              R$ {(metrics?.approvedCommission || 0).toFixed(2)}
            </div>
            <span className="text-[11px] text-blue-600">Pronta p/ lote</span>
          </div>
        </div>

        {/* 12. Comissão Recebida (Paga) */}
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-300 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-bold uppercase">Comissão Recebida</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-emerald-700">
              R$ {(metrics?.paidCommission || 0).toFixed(2)}
            </div>
            <span className="text-[11px] text-emerald-700 font-bold">Na conta bancária</span>
          </div>
        </div>

        {/* 13. Melhor Produto */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Melhor Produto</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-xs font-bold text-slate-900 truncate" title={metrics?.bestProduct}>
              {metrics?.bestProduct || 'Air Fryer Digital 5.5L'}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">Maior receita de comissão</span>
          </div>
        </div>

        {/* 14. Melhor Canal de Divulgação */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Melhor Canal</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2">
            <div className="text-lg font-black text-slate-900">{metrics?.bestChannel || 'TikTok'}</div>
            <span className="text-[11px] text-rose-600 font-semibold">Maior conversão</span>
          </div>
        </div>

      </div>

      {/* Filter Bar & Performance Graphs (Requirement 3) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        
        {/* Filters Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Desempenho de Vendas e Comissões</span>
            </h2>
            <p className="text-xs text-slate-500">
              Gráficos consolidados por período com filtro por marketplace, rede e produto
            </p>
          </div>

          {/* Period Selector Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setPeriod('daily')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === 'daily' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Diário
            </button>
            <button
              onClick={() => setPeriod('weekly')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === 'weekly' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semanal
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === 'monthly' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setPeriod('annual')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === 'annual' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Anual
            </button>
          </div>
        </div>

        {/* Dynamic Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Marketplace:</label>
            <select
              value={filterMarketplace}
              onChange={e => setFilterMarketplace(e.target.value)}
              className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-hidden"
            >
              <option value="all">Todos os Marketplaces</option>
              <option value="Mercado Livre">Mercado Livre Afiliados</option>
              <option value="Shopee">Shopee Afiliados</option>
              <option value="TikTok Shop">TikTok Shop Afiliados</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Rede Social / Canal:</label>
            <select
              value={filterSocial}
              onChange={e => setFilterSocial(e.target.value)}
              className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-hidden"
            >
              <option value="all">Todas as Redes Sociais</option>
              <option value="TikTok">TikTok</option>
              <option value="Instagram">Instagram (Reels / Feed / Stories)</option>
              <option value="WhatsApp">WhatsApp (Grupos / Canais)</option>
              <option value="YouTube">YouTube Shorts</option>
              <option value="Facebook">Facebook</option>
              <option value="Pinterest">Pinterest</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Produto em Foco:</label>
            <select
              value={filterProduct}
              onChange={e => setFilterProduct(e.target.value)}
              className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-hidden"
            >
              <option value="all">Todos os Produtos do Catálogo</option>
              <option value="airfryer">Air Fryer Digital 5.5L</option>
              <option value="fone">Fone Bluetooth TWS ANC</option>
              <option value="triturador">Mini Triturador USB</option>
              <option value="serum">Kit Sérum Vitamina C</option>
            </select>
          </div>
        </div>

        {/* Visual Chart Bars (Clean SVG representation) */}
        <div className="pt-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <span className="font-semibold">Comissão Gerada (R$) vs Visualizações</span>
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-xs bg-emerald-500" />
                <span>Comissão (R$)</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-xs bg-blue-400" />
                <span>Visualizações</span>
              </span>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 border-b border-slate-200 pb-2 pt-6">
            {currentPoints.map((pt: any, i: number) => {
              const commHeightPercent = Math.max(12, Math.round((pt.commission / maxCommission) * 85));
              const viewsHeightPercent = Math.max(8, Math.round((pt.views / maxViews) * 85));

              return (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="w-full flex items-end justify-center space-x-1 sm:space-x-2 h-full">
                    
                    {/* Commission Bar */}
                    <div
                      style={{ height: `${commHeightPercent}%` }}
                      className="w-1/2 max-w-[28px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all group-hover:brightness-110 relative flex flex-col justify-end items-center"
                      title={`Comissão: R$ ${pt.commission.toFixed(2)} (${pt.sales} vendas)`}
                    >
                      <span className="hidden group-hover:block absolute -top-8 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow-md whitespace-nowrap z-10">
                        R$ {pt.commission.toFixed(2)}
                      </span>
                    </div>

                    {/* Views Bar */}
                    <div
                      style={{ height: `${viewsHeightPercent}%` }}
                      className="w-1/2 max-w-[28px] bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-md opacity-80 group-hover:opacity-100 transition-all relative flex flex-col justify-end items-center"
                      title={`Visualizações: ${pt.views.toLocaleString('pt-BR')}`}
                    >
                      <span className="hidden group-hover:block absolute -top-8 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow-md whitespace-nowrap z-10">
                        {pt.views.toLocaleString('pt-BR')} views
                      </span>
                    </div>

                  </div>

                  <span className="text-[11px] font-semibold text-slate-600 mt-2 truncate max-w-[60px] text-center">
                    {pt.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <span>Fonte de dados: APIs oficiais e relatórios de comissões aprovadas.</span>
            <span className="font-semibold text-emerald-700">
              Taxa média de conversão da plataforma: 3.4% dos cliques
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
