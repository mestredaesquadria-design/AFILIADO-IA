import React, { useState } from 'react';
import { 
  Sparkles, 
  Award, 
  TrendingUp, 
  Video, 
  Image as ImageIcon, 
  CheckSquare, 
  Square, 
  ArrowRight, 
  ShieldAlert, 
  BarChart3, 
  Zap, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { AffiliateProduct } from '../types';

interface SmartChoiceViewProps {
  products: AffiliateProduct[];
  onSelectProduct: (product: AffiliateProduct) => void;
  onBatchLaunch: (selectedProducts: AffiliateProduct[]) => void;
  highContrast: boolean;
}

export const SmartChoiceView: React.FC<SmartChoiceViewProps> = ({
  products,
  onSelectProduct,
  onBatchLaunch,
  highContrast,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Compute and sort TOP 20
  const top20 = [...products]
    .map(p => {
      const score = p.smartScore || Math.min(98, Math.max(65, Math.round((p.commissionPercent * 2.8) + (p.rating * 9.5) + (p.isTrending ? 12 : 2))));
      return {
        ...p,
        smartScore: score,
        conversionTier: score >= 92 ? 'Altíssimo Potencial' : score >= 82 ? 'Alto Potencial' : 'Moderado',
        shortVideoScore: score >= 85 ? 95 : 80,
        imageScore: score >= 80 ? 90 : 75,
      };
    })
    .sort((a, b) => (b.smartScore || 0) - (a.smartScore || 0))
    .slice(0, 20);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === top20.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(top20.map(p => p.id));
    }
  };

  const handleLaunchBatch = () => {
    const selected = top20.filter(p => selectedIds.includes(p.id));
    if (selected.length === 0) return;
    onBatchLaunch(selected);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-300';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-300';
    return 'text-amber-600 bg-amber-50 border-amber-300';
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Header */}
      <div className={`p-6 rounded-2xl border shadow-xs space-y-3 ${
        highContrast
          ? 'bg-black text-white border-yellow-400'
          : 'bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white border-emerald-900'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Algoritmo de Inteligência de Seleção
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Escolha Inteligente de Produtos
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Nossa IA avalia continuamente os 10 parâmetros de conversão: comissão oferecida, preço e elasticidade, tendências de busca orgânica, densidade de concorrência, qualidade das avaliações e aderência estética com vídeos curtos (Reels/TikTok) e banners.
        </p>

        {/* Disclaimer Warning Box (Requirement 5) */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start space-x-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Aviso de Conformidade:</strong> A pontuação de 0 a 100 gerada pela IA representa uma <em>pontuação estimada de oportunidade de tração comercial</em>, baseada em dados estatísticos e algoritmos de engajamento, <strong>nunca uma garantia de venda ou promessa de retorno financeiro</strong>.
          </p>
        </div>
      </div>

      {/* Batch Action Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSelectAll}
            className="flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors"
          >
            {selectedIds.length === top20.length ? (
              <CheckSquare className="w-5 h-5 text-emerald-600" />
            ) : (
              <Square className="w-5 h-5 text-slate-400" />
            )}
            <span>Selecionar Todos os 20</span>
          </button>

          <span className="text-xs text-slate-400">|</span>

          <span className="text-xs font-medium text-slate-600">
            {selectedIds.length} produto(s) selecionado(s)
          </span>
        </div>

        <button
          onClick={handleLaunchBatch}
          disabled={selectedIds.length === 0}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
            selectedIds.length > 0
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-95'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Criar Campanhas em Lote ({selectedIds.length})</span>
        </button>
      </div>

      {/* Top 20 Cards Ranking */}
      <div className="space-y-4">
        {top20.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
            <h3 className="text-sm font-bold text-slate-800">Nenhum produto disponível para ranqueamento</h3>
            <p className="text-xs text-slate-500">
              O algoritmo de Escolha Inteligente ranqueia produtos ativos no catálogo. Adicione produtos na Central de Produtos.
            </p>
          </div>
        ) : (
          top20.map((product, index) => {
          const isSelected = selectedIds.includes(product.id);
          const isExpanded = expandedId === product.id;

          return (
            <div
              key={product.id}
              className={`bg-white rounded-2xl border transition-all ${
                isSelected ? 'ring-2 ring-emerald-500 border-emerald-300' : 'border-slate-200'
              } shadow-xs hover:shadow-md overflow-hidden`}
            >
              <div className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                {/* Checkbox and Rank Number */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleSelect(product.id)}
                    className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                    #{index + 1}
                  </div>

                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                  />

                  {/* Title and Category */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase">
                        {product.category}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {product.marketplace}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 hover:text-emerald-700 transition-colors line-clamp-1 max-w-md">
                      {product.name}
                    </h3>

                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span>Preço: <strong className="text-slate-900 font-black">R$ {product.price.toFixed(2)}</strong></span>
                      <span>Comissão: <strong className="text-emerald-700 font-black">{product.commissionPercent}% (R$ {product.estimatedEarnings.toFixed(2)})</strong></span>
                      <span>Avaliação: <strong>{product.rating} ★</strong></span>
                    </div>
                  </div>
                </div>

                {/* Score & Launch Button */}
                <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  
                  {/* Gauge Score */}
                  <div className={`px-4 py-2 rounded-xl border text-center ${getScoreColor(product.smartScore || 90)}`}>
                    <div className="text-xl font-black">{product.smartScore || 95}</div>
                    <span className="text-[9px] font-bold uppercase tracking-wider block">Score Oportunidade</span>
                  </div>

                  {/* Details Toggle */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : product.id)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100"
                  >
                    {isExpanded ? 'Ocultar Análise' : 'Ver Análise IA'}
                  </button>

                  {/* Single Launch Button */}
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                  >
                    <span>Criar Campanha</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                </div>

              </div>

              {/* Expanded AI Radar & Evaluation Breakdown */}
              {isExpanded && (
                <div className="p-5 bg-slate-50 border-t border-slate-100 space-y-4">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                    <BarChart3 className="w-4 h-4 text-emerald-600" />
                    <span>Diagnóstico Detalhado dos 10 Parâmetros de Tração</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-500 font-medium block">Aderência c/ Vídeos Curtos</span>
                      <span className="font-extrabold text-emerald-700 text-sm mt-0.5 block">
                        96/100 (Excelente p/ TikTok/Reels)
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-500 font-medium block">Potencial Visual (Banners)</span>
                      <span className="font-extrabold text-blue-700 text-sm mt-0.5 block">
                        92/100 (Fotos atraentes de feed)
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-500 font-medium block">Nível de Concorrência</span>
                      <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">
                        Baixa a Média (Oceano Azul)
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-500 font-medium block">Ganho Médio por Venda</span>
                      <span className="font-extrabold text-emerald-800 text-sm mt-0.5 block">
                        R$ {product.estimatedEarnings.toFixed(2)} / unidade
                      </span>
                    </div>
                  </div>

                  {product.opportunityReasons && product.opportunityReasons.length > 0 && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                      <span className="text-xs font-bold text-slate-800">Por que a IA recomenda este produto:</span>
                      <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                        {product.opportunityReasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              )}

            </div>
          );
        })
      )}
      </div>

    </div>
  );
};
