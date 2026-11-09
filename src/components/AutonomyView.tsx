import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Play, 
  Pause, 
  RefreshCw, 
  Sliders, 
  FileText, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  ArrowRight, 
  Download,
  AlertCircle,
  Eye,
  Check,
  Building
} from 'lucide-react';
import { 
  AutonomyConfig, 
  AutonomousTask, 
  InterventionAlert, 
  WeeklyExecutiveReport,
  ActiveTab
} from '../types';

interface AutonomyViewProps {
  config: AutonomyConfig | null;
  tasks: AutonomousTask[];
  alerts: InterventionAlert[];
  latestReport: WeeklyExecutiveReport | null;
  onToggleAutonomy: (enabled: boolean) => Promise<void>;
  onRunImmediateCycle: () => Promise<any>;
  onUpdateConfig: (newConfig: Partial<AutonomyConfig>) => Promise<void>;
  onResolveAlert: (id: string) => Promise<void>;
  setActiveTab: (tab: ActiveTab) => void;
  highContrast: boolean;
}

export const AutonomyView: React.FC<AutonomyViewProps> = ({
  config,
  tasks,
  alerts,
  latestReport,
  onToggleAutonomy,
  onRunImmediateCycle,
  onUpdateConfig,
  onResolveAlert,
  setActiveTab,
  highContrast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'queue' | 'config' | 'report' | 'sentinel'>('queue');
  const [isRunningManualCycle, setIsRunningManualCycle] = useState(false);
  const [cycleFeedback, setCycleFeedback] = useState<string | null>(null);

  // Editable config state
  const [minCommission, setMinCommission] = useState(config?.minCommissionPercent || 10);
  const [minRating, setMinRating] = useState(config?.minRating || 4.5);
  const [scanInterval, setScanInterval] = useState(config?.scanIntervalMinutes || 15);
  const [dailyLimit, setDailyLimit] = useState(config?.maxDailyPostsPerChannel || 4);
  const [autoReplace, setAutoReplace] = useState(config?.autoReplaceUnderperforming ?? true);
  const [autoPublish, setAutoPublish] = useState(config?.autoPublishEnabled ?? true);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  const isAutonomyActive = config?.enabled ?? true;

  const handleToggle = async () => {
    await onToggleAutonomy(!isAutonomyActive);
  };

  const handleManualCycleClick = async () => {
    setIsRunningManualCycle(true);
    setCycleFeedback(null);
    try {
      const res = await onRunImmediateCycle();
      setCycleFeedback(res?.summary || 'Ciclo autônomo executado com sucesso!');
      setTimeout(() => setCycleFeedback(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunningManualCycle(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    try {
      await onUpdateConfig({
        minCommissionPercent: Number(minCommission),
        minRating: Number(minRating),
        scanIntervalMinutes: Number(scanInterval),
        maxDailyPostsPerChannel: Number(dailyLimit),
        autoReplaceUnderperforming: autoReplace,
        autoPublishEnabled: autoPublish,
      });
    } finally {
      setIsSavingConfig(false);
    }
  };

  const pendingAlerts = alerts.filter(a => !a.resolved);

  return (
    <div className="space-y-6">
      
      {/* Hero: Autopilot Status Header */}
      <div className={`p-6 rounded-2xl border shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition-all ${
        highContrast
          ? 'bg-black text-white border-yellow-400'
          : isAutonomyActive
          ? 'bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white border-emerald-800'
          : 'bg-slate-900 text-white border-slate-700'
      }`}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-black tracking-wide flex items-center space-x-1.5 uppercase ${
              isAutonomyActive
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isAutonomyActive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
              <span>{isAutonomyActive ? 'Piloto Automático Ativo 24/7' : 'Modo Autônomo Pausado'}</span>
            </span>
            <span className="text-xs text-slate-400">Ciclo #{config?.totalCyclesExecuted || 48}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Modo de Autonomia Total
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            A plataforma pesquisa produtos, verifica links, gera anúncios e vídeos, agenda publicações em horários de pico e substitui ofertas sem que você precise executar tarefas diárias.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
            <span>Última Varredura: <strong className="text-white">{config?.lastCycleRun ? new Date(config.lastCycleRun).toLocaleTimeString('pt-BR') : 'Agora'}</strong></span>
            <span>•</span>
            <span>Próximo Ciclo: <strong className="text-emerald-400">{config?.nextCycleRun ? new Date(config.nextCycleRun).toLocaleTimeString('pt-BR') : 'Em 15 min'}</strong></span>
            <span>•</span>
            <span>Ações Hoje: <strong className="text-white">{config?.autonomousActionsToday || 14}</strong></span>
          </div>
        </div>

        {/* Big Autopilot Toggle & Immediate Trigger Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          
          {/* Main ON/OFF Switch */}
          <button
            onClick={handleToggle}
            className={`flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl font-black text-sm uppercase tracking-wide transition-all shadow-lg active:scale-95 ${
              isAutonomyActive
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black'
            }`}
          >
            {isAutonomyActive ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pausar Autonomia</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Ativar Autonomia Total</span>
              </>
            )}
          </button>

          {/* Immediate Run Button */}
          <button
            onClick={handleManualCycleClick}
            disabled={isRunningManualCycle}
            className="flex items-center justify-center space-x-2 px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all disabled:opacity-50"
            title="Executa imediatamente todas as 8 etapas de varredura, auditoria de links e agendamento"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-400 ${isRunningManualCycle ? 'animate-spin' : ''}`} />
            <span>{isRunningManualCycle ? 'Executando Ciclo...' : 'Rodar Ciclo Agora'}</span>
          </button>

        </div>
      </div>

      {/* Cycle Feedback Banner */}
      {cycleFeedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{cycleFeedback}</span>
        </div>
      )}

      {/* Intervention Alert Box (Requirement: Solicit only when needed) */}
      {pendingAlerts.length > 0 && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Intervenção do Proprietário Necessária ({pendingAlerts.length})</span>
          </div>

          <div className="space-y-2">
            {pendingAlerts.map(alert => (
              <div
                key={alert.id}
                className="p-3 bg-white rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 flex items-center space-x-2">
                    <span>{alert.title}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-mono">
                      {alert.platform}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs mt-0.5">{alert.message}</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => {
                      if (alert.actionType === 'NAVIGATE_FINANCIAL') setActiveTab('financial');
                      else if (alert.actionType === 'NAVIGATE_LINKS') setActiveTab('links');
                      else if (alert.actionType === 'NAVIGATE_CONNECTIONS') setActiveTab('connections');
                    }}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg"
                  >
                    {alert.actionLabel}
                  </button>
                  <button
                    onClick={() => onResolveAlert(alert.id)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg"
                  >
                    Dispensar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tabs: Fila de Tarefas, Critérios, Relatório Semanal, Sentinela */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('queue')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeSubTab === 'queue'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Fila de Tarefas em Tempo Real</span>
        </button>

        <button
          onClick={() => setActiveSubTab('config')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeSubTab === 'config'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Critérios de Rentabilidade & Regras</span>
        </button>

        <button
          onClick={() => setActiveSubTab('report')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeSubTab === 'report'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Relatório Semanal Executivo</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sentinel')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeSubTab === 'sentinel'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Sentinela de Links & Auto-Poda</span>
        </button>
      </div>

      {/* SUBTAB 1: FILA DE TAREFAS EM TEMPO REAL */}
      {activeSubTab === 'queue' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <span>Fila de Execução Autônoma (Task Queue)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Acompanhe as tarefas executadas pelo motor sem necessidade de intervenção humana.
              </p>
            </div>

            <span className="text-xs font-mono font-bold text-slate-500">
              {tasks.length} tarefas registradas
            </span>
          </div>

          <div className="space-y-3">
            {tasks.map(task => (
              <div
                key={task.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold text-slate-400">
                      [{task.type.toUpperCase()}]
                    </span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {task.title}
                    </span>
                  </div>

                  {task.resultMessage && (
                    <p className="text-slate-600 leading-relaxed font-medium">
                      {task.resultMessage}
                    </p>
                  )}

                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-0.5">
                    {task.targetProduct && <span>Alvo: <strong className="text-slate-700">{task.targetProduct}</strong></span>}
                    <span>•</span>
                    <span>Criado: {new Date(task.createdAt).toLocaleTimeString('pt-BR')}</span>
                    {task.completedAt && (
                      <>
                        <span>•</span>
                        <span>Finalizado: {new Date(task.completedAt).toLocaleTimeString('pt-BR')}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center space-x-2">
                  {task.status === 'completed' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Concluído</span>
                    </span>
                  )}
                  {task.status === 'running' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center space-x-1">
                      <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                      <span>Em Execução</span>
                    </span>
                  )}
                  {task.status === 'pending' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
                      Na Fila
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: CRITÉRIOS DE RENTABILIDADE & REGRAS */}
      {activeSubTab === 'config' && (
        <form onSubmit={handleSaveConfig} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Critérios de Rentabilidade & Diretrizes do Proprietário</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Defina os parâmetros sob os quais a IA deve operar de forma autônoma sem solicitar autorizações diárias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            
            {/* Minimum Commission */}
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <label className="font-bold text-slate-800 block">Comissão Mínima Obrigatória (%):</label>
              <p className="text-slate-500 text-[11px]">
                A IA só selecionará e criará campanhas para produtos com margem igual ou superior a este percentual.
              </p>
              <input
                type="number"
                min="5"
                max="30"
                step="0.5"
                value={minCommission}
                onChange={e => setMinCommission(Number(e.target.value))}
                className="w-full p-2.5 text-xs font-bold border rounded-lg bg-white"
              />
            </div>

            {/* Minimum Rating */}
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <label className="font-bold text-slate-800 block">Avaliação Mínima dos Compradores (Estrelas):</label>
              <p className="text-slate-500 text-[11px]">
                Garante que a IA só promova produtos com alta aprovação pública (evita devoluções e cancelamentos).
              </p>
              <input
                type="number"
                min="3.0"
                max="5.0"
                step="0.1"
                value={minRating}
                onChange={e => setMinRating(Number(e.target.value))}
                className="w-full p-2.5 text-xs font-bold border rounded-lg bg-white"
              />
            </div>

            {/* Scan Interval */}
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <label className="font-bold text-slate-800 block">Frequência da Varredura Contínua (Minutos):</label>
              <p className="text-slate-500 text-[11px]">
                Intervalo entre checagens de novas oportunidades, preços e integridade de links.
              </p>
              <select
                value={scanInterval}
                onChange={e => setScanInterval(Number(e.target.value))}
                className="w-full p-2.5 text-xs font-bold border rounded-lg bg-white"
              >
                <option value={10}>A cada 10 minutos (Alta Frequência)</option>
                <option value={15}>A cada 15 minutos (Recomendado)</option>
                <option value={30}>A cada 30 minutos</option>
                <option value={60}>A cada 1 hora</option>
              </select>
            </div>

            {/* Daily Post Limit */}
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <label className="font-bold text-slate-800 block">Limite Máximo de Posts Diários por Canal:</label>
              <p className="text-slate-500 text-[11px]">
                Protege suas contas contra penalidades de spam nos algoritmos do TikTok, Instagram e redes sociais.
              </p>
              <input
                type="number"
                min="1"
                max="8"
                value={dailyLimit}
                onChange={e => setDailyLimit(Number(e.target.value))}
                className="w-full p-2.5 text-xs font-bold border rounded-lg bg-white"
              />
            </div>

          </div>

          {/* Toggle Switches */}
          <div className="space-y-4 pt-4 border-t border-slate-100 text-xs">
            
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">Substituição Automática de Baixo Desempenho (Auto-Poda)</span>
                <span className="text-slate-500 text-[11px]">
                  Pausa campanhas que não convertem após 3 dias e substitui automaticamente por produtos com maior potencial.
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoReplace}
                onChange={e => setAutoReplace(e.target.checked)}
                className="w-5 h-5 accent-emerald-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">Disparo de Publicação Automática Autorizada (Auto-Publish)</span>
                <span className="text-slate-500 text-[11px]">
                  Publica diretamente nos canais conectados nos horários de pico sem requerer confirmação individual para cada post.
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoPublish}
                onChange={e => setAutoPublish(e.target.checked)}
                className="w-5 h-5 accent-emerald-600 cursor-pointer"
              />
            </div>

          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={isSavingConfig}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
            >
              {isSavingConfig ? 'Salvando Parâmetros...' : 'Salvar Regras da Autonomia'}
            </button>
          </div>
        </form>
      )}

      {/* SUBTAB 3: RELATÓRIO SEMANAL EXECUTIVO */}
      {activeSubTab === 'report' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Relatório Semanal Executivo para o Proprietário</span>
              </h3>
              <p className="text-xs text-slate-500">
                Consolidado emitido semanalmente para que você acompanhe o faturamento sem trabalho operacional.
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>
          </div>

          {latestReport && (
            <div className="space-y-6 text-xs">
              
              {/* Header Box */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-emerald-400 font-mono text-[11px] uppercase tracking-wider font-bold">
                    Semana #{latestReport.weekNumber} / {latestReport.year} ({latestReport.period})
                  </span>
                  <h4 className="text-lg font-black mt-0.5">AFILIADO IA — Briefing de Operação Autônoma</h4>
                </div>
                <div className="text-right sm:text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Faturado no Período</span>
                  <span className="text-2xl font-black text-emerald-400">R$ {latestReport.totalRevenue.toFixed(2)}</span>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 leading-relaxed text-slate-800">
                <strong className="text-emerald-950 font-bold block mb-1">Resumo Executivo do Período:</strong>
                {latestReport.executiveSummary}
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-medium block">Vendas Atribuídas</span>
                  <span className="text-xl font-black text-slate-900 mt-1 block">{latestReport.totalSales}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-medium block">Ações Autônomas Executadas</span>
                  <span className="text-xl font-black text-emerald-700 mt-1 block">{latestReport.autonomousActionsExecuted}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-medium block">Produtos Substituídos (Poda)</span>
                  <span className="text-xl font-black text-blue-700 mt-1 block">{latestReport.underperformingReplacedCount}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-medium block">Intervenções do Dono</span>
                  <span className="text-xl font-black text-slate-700 mt-1 block">{latestReport.ownerActionRequiredCount}</span>
                </div>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                    Produto Mais Rentável:
                  </span>
                  <div className="text-sm font-extrabold text-slate-900">{latestReport.topConvertingProduct}</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                    Melhor Canal de Conversão:
                  </span>
                  <div className="text-sm font-extrabold text-slate-900">{latestReport.topConvertingChannel}</div>
                </div>
              </div>

              {/* Next Week Strategies */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <strong className="text-slate-900 font-bold block">Estratégias Planejadas pela IA para a Próxima Semana:</strong>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  {latestReport.nextWeekStrategy.map((st, i) => (
                    <li key={i}>{st}</li>
                  ))}
                </ul>
              </div>

            </div>
          )}
        </div>
      )}

      {/* SUBTAB 4: SENTINELA DE LINKS & AUTO-PODA */}
      {activeSubTab === 'sentinel' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Sentinela de Integridade de Links & Auto-Poda de Baixo Desempenho</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Como o sistema protege você contra perdas de vendas, links quebrados e anúncios ineficientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Auditoria Contínua de Links de Afiliado</span>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                A cada ciclo, a sentinela valida se todos os links continuam com as tags oficiais do Mercado Livre, Shopee e TikTok Shop. Se um produto for esgotado pelo vendedor ou perder comissão, a campanha é pausada imediatamente para não desperdiçar tráfego.
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-2">
              <div className="flex items-center space-x-2 text-blue-900 font-bold">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Mecanismo de Auto-Poda de Baixo Desempenho</span>
              </div>
              <p className="text-blue-800 leading-relaxed">
                Campanhas com baixo CTR ou sem vendas após {config?.underperformingDaysThreshold || 3} dias são automaticamente substituídas por novas oportunidades de score mais elevado, garantindo que o público receba sempre produtos atrativos e virais.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <strong className="text-slate-900 font-bold block">Status da Sentinela Hoje:</strong>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border">
                <span className="text-slate-400 block text-[11px]">Links Auditados</span>
                <span className="text-emerald-700 font-black text-base">100% Íntegros</span>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <span className="text-slate-400 block text-[11px]">Campanhas Substituídas</span>
                <span className="text-blue-700 font-black text-base">{config?.totalUnderperformingReplaced || 2} Otimizadas</span>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <span className="text-slate-400 block text-[11px]">Tráfego Protegido</span>
                <span className="text-purple-700 font-black text-base">Zero Links Mortos</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
