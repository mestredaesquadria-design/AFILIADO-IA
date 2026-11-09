import React, { useState } from 'react';
import { 
  Wand2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  Send, 
  Play, 
  Settings, 
  Sliders, 
  Zap, 
  CheckSquare, 
  Square, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { AffiliateProduct, AutomationJob } from '../types';

interface AutomationViewProps {
  products: AffiliateProduct[];
  jobs: AutomationJob[];
  selectedProduct: AffiliateProduct | null;
  onSelectProduct: (p: AffiliateProduct) => void;
  onExecuteAutomation: (productId: string, channels: string[], autoApprove: boolean) => Promise<void>;
  onViewPublications: () => void;
  highContrast: boolean;
}

export const AutomationView: React.FC<AutomationViewProps> = ({
  products,
  jobs,
  selectedProduct,
  onSelectProduct,
  onExecuteAutomation,
  onViewPublications,
  highContrast,
}) => {
  const activeProduct = selectedProduct || products[0] || null;
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['TikTok', 'Instagram', 'WhatsApp']);
  const [autoApprove, setAutoApprove] = useState(true);
  const [dailyLimit, setDailyLimit] = useState(4);
  const [antiDuplicate, setAntiDuplicate] = useState(true);
  
  // Running simulation state
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [completedJob, setCompletedJob] = useState<any>(null);

  const channelsList = [
    { id: 'TikTok', label: 'TikTok (Vídeos 9:16 + Link Bio)' },
    { id: 'Instagram', label: 'Instagram (Reels, Feed & Stories)' },
    { id: 'WhatsApp', label: 'WhatsApp (Listas VIP & Canais)' },
    { id: 'YouTube', label: 'YouTube Shorts' },
    { id: 'Facebook', label: 'Facebook Páginas' },
    { id: 'Pinterest', label: 'Pinterest Pins' },
  ];

  const steps = [
    { title: '1. Consulta de Dados do Produto', desc: 'Verificando preço atualizado, estoque e procedência no marketplace oficial' },
    { title: '2. Verificação do Link de Afiliado', desc: 'Auditando a tag de rastreamento oficial sem desvios ou quebras' },
    { title: '3. Consulta da Comissão Garantida', desc: 'Validando taxa percentual e ganho líquido estimado por venda' },
    { title: '4. Avaliação de Oportunidade pela IA', desc: 'Calculando o Score 0-100 de tração e aderência comercial' },
    { title: '5. Geração de Imagens & Banners', desc: 'Criando criativos para Feed e Stories com selos de frete e desconto' },
    { title: '6. Roteirização e Vídeo Vertical', desc: 'Sintetizando narração em áudio, legendas dinâmicas e roteiro de alta retenção' },
    { title: '7. Criação de Textos Multicanal', desc: 'Escrevendo copys personalizadas com linguagem persuasiva e sem promessas falsas' },
    { title: '8. Preparação & Agendamento de Campanhas', desc: 'Distribuindo nos canais autorizados nos melhores horários de pico' },
    { title: '9. Monitoramento & Painel Financeiro', desc: 'Atribuição configurada para contabilizar cliques e comissões recebidas' },
  ];

  const toggleChannel = (id: string) => {
    setSelectedChannels(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleStartAutomation = async () => {
    if (!activeProduct || isRunning) return;
    setIsRunning(true);
    setCompletedJob(null);

    // Animate visual pipeline steps
    for (let i = 0; i < steps.length; i++) {
      setActiveStepIndex(i);
      await new Promise(r => setTimeout(r, 450));
    }

    try {
      await onExecuteAutomation(activeProduct.id, selectedChannels, autoApprove);
      setCompletedJob({
        productName: activeProduct.name,
        channels: selectedChannels,
      });
    } catch (err) {
      console.error('Falha na automação:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className={`p-6 rounded-2xl border shadow-xs space-y-3 ${
        highContrast
          ? 'bg-black text-white border-yellow-400'
          : 'bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-900 text-white border-emerald-800'
      }`}>
        <div className="flex items-center space-x-2">
          <Wand2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Motor Central de Automação Comercial
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Automação Inteligente 1-Clique
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Selecione o produto de afiliado desejado e deixe a IA cuidar de todo o processo: desde a validação do link até a geração de criativos, narração de vídeos e distribuição nos canais autorizados.
        </p>
      </div>

      {/* Main Automation Workflow Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Product Selection & Execution Panel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>Passo 1: Selecionar Produto</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Produto para Divulgação:</label>
            <select
              value={activeProduct?.id || ''}
              onChange={e => {
                const p = products.find(prod => prod.id === e.target.value);
                if (p) onSelectProduct(p);
              }}
              className="w-full text-xs font-semibold p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  [{p.marketplace}] {p.name} (Comissão: {p.commissionPercent}%)
                </option>
              ))}
            </select>
          </div>

          {activeProduct && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-3">
              <img
                src={activeProduct.imageUrl}
                alt={activeProduct.name}
                className="w-14 h-14 object-cover rounded-lg border border-slate-200"
              />
              <div className="space-y-0.5 text-xs truncate">
                <div className="font-bold text-slate-900 truncate">{activeProduct.name}</div>
                <div className="text-emerald-700 font-black">
                  Preço: R$ {activeProduct.price.toFixed(2)} • Ganho: R$ {activeProduct.estimatedEarnings.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-500">
                  {activeProduct.marketplace} • Score Oportunidade: {activeProduct.smartScore || 95}/100
                </div>
              </div>
            </div>
          )}

          {/* Channels Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Canais de Destino Autorizados:</label>
            <div className="space-y-1.5">
              {channelsList.map(ch => {
                const isSelected = selectedChannels.includes(ch.id);
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => toggleChannel(ch.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{ch.label}</span>
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
            
            {/* Approval Mode */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Automação Autorizada</span>
                <span className="text-[11px] text-slate-500">Agendar diretamente sem pausa manual</span>
              </div>
              <input
                type="checkbox"
                checked={autoApprove}
                onChange={e => setAutoApprove(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Anti-Duplicate Protection */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Proteção Anti-Duplicação</span>
                <span className="text-[11px] text-slate-500">Evita repetição de copys idênticas</span>
              </div>
              <input
                type="checkbox"
                checked={antiDuplicate}
                onChange={e => setAntiDuplicate(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 cursor-pointer"
              />
            </div>

          </div>

          {/* Primary Trigger Button */}
          <button
            onClick={handleStartAutomation}
            disabled={isRunning || selectedChannels.length === 0}
            className={`w-full flex items-center justify-center space-x-2 py-4 px-4 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg transition-all ${
              isRunning
                ? 'bg-slate-400 text-white cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 active:scale-95'
            }`}
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Processando Automação...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Executar Automação 1-Clique</span>
              </>
            )}
          </button>
        </div>

        {/* Right Columns: Live Step Pipeline & Results */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Pipeline de Execução em 9 Etapas</span>
            </h3>

            {completedJob && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Campanha Criada com Sucesso!</span>
              </span>
            )}
          </div>

          {/* Steps List */}
          <div className="space-y-2">
            {steps.map((st, idx) => {
              const isPast = activeStepIndex > idx || completedJob !== null;
              const isCurrent = activeStepIndex === idx;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs transition-all flex items-start space-x-3 ${
                    isPast
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                      : isCurrent
                      ? 'bg-blue-50 border-blue-300 text-blue-900 ring-2 ring-blue-400/40'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  <div className="space-y-0.5 flex-1">
                    <div className="font-bold flex items-center justify-between">
                      <span>{st.title}</span>
                      {isPast && <span className="text-[10px] text-emerald-700 font-mono font-bold">CONCLUÍDO</span>}
                      {isCurrent && <span className="text-[10px] text-blue-700 font-mono font-bold animate-pulse">EXECUTANDO</span>}
                    </div>
                    <p className="text-[11px] opacity-80">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Post-execution Summary Card */}
          {completedJob && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-2">
              <span className="font-bold text-emerald-900 block">Resumo do Lançamento:</span>
              <p className="text-emerald-800 leading-relaxed">
                A campanha para <strong>{completedJob.productName}</strong> foi gerada e distribuída para <strong>{completedJob.channels.join(', ')}</strong>. Todas as postagens foram preparadas com mídias em alta resolução, narração em áudio e link de afiliado oficial.
              </p>
              <div className="pt-2">
                <button
                  onClick={onViewPublications}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Ver Publicações Agendadas
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
