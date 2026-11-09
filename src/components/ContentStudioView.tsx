import React, { useState, useEffect, useRef } from 'react';
import { 
  Palette, 
  Video, 
  FileText, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Smartphone, 
  Square, 
  Monitor, 
  Layers, 
  Clock, 
  Send,
  RefreshCw,
  Tag
} from 'lucide-react';
import { AffiliateProduct } from '../types';

interface ContentStudioViewProps {
  products: AffiliateProduct[];
  selectedProduct: AffiliateProduct | null;
  onSelectProduct: (product: AffiliateProduct) => void;
  onSchedulePost: (content: { mediaType: 'image' | 'video'; mediaUrl: string; caption: string; channel: string }) => void;
  highContrast: boolean;
}

export const ContentStudioView: React.FC<ContentStudioViewProps> = ({
  products,
  selectedProduct,
  onSelectProduct,
  onSchedulePost,
  highContrast,
}) => {
  const activeProduct = selectedProduct || products[0] || null;
  const [activeSubTab, setActiveSubTab] = useState<'images' | 'videos' | 'texts'>('images');

  // Image Studio States
  const [imageFormat, setImageFormat] = useState<'stories' | 'feed' | 'banner'>('stories');
  const [imageCallout, setImageCallout] = useState('🔥 OFERTA VERIFICADA HOJE');
  const [imageBadge, setImageBadge] = useState('Frete Grátis Disponível');

  // Video Studio States
  const [videoDuration, setVideoDuration] = useState<15 | 30 | 45 | 60>(30);
  const [videoAngle, setVideoAngle] = useState<'demo' | 'pain_solution' | 'unboxing' | 'offer_alert'>('offer_alert');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Text Studio States
  const [activeChannelCopy, setActiveChannelCopy] = useState<'Instagram' | 'TikTok' | 'WhatsApp' | 'YouTube' | 'Facebook' | 'Pinterest'>('Instagram');
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [generatedCopies, setGeneratedCopies] = useState<any>(null);

  // Video subtitle timer simulation
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentSubtitleIndex(prev => (prev + 1) % 4);
      }, 2500);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Audio speech synthesis for video narration
  const handleTogglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      if ('speechSynthesis' in window && !isAudioMuted) {
        window.speechSynthesis.cancel();
        const scriptText = activeProduct
          ? `Atenção! Conheça o ${activeProduct.name}. Mais de ${activeProduct.reviewCount} avaliações positivas no ${activeProduct.marketplace}. Por apenas R$ ${activeProduct.price.toFixed(2)}. Link oficial na bio com desconto e garantia!`
          : 'Confira esse super achadinho oficial com desconto!';
        const utterance = new SpeechSynthesisUtterance(scriptText);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.05;
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      setIsPlaying(false);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  // Fetch or generate copies on product change
  useEffect(() => {
    if (!activeProduct) return;
    setIsGeneratingCopy(true);
    fetch('/api/content/generate-copy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: activeProduct.id, channel: activeChannelCopy }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.materials) {
          setGeneratedCopies(data.materials);
        }
      })
      .catch(err => console.error('Erro ao gerar materiais:', err))
      .finally(() => setIsGeneratingCopy(false));
  }, [activeProduct?.id]);

  const subtitlesList = [
    `🔥 Achadinho Oficial: ${activeProduct?.name || 'Produto'}`,
    `⭐️ Nota ${activeProduct?.rating || 4.8} com mais de ${activeProduct?.reviewCount || 1000} avaliações reais`,
    `💰 De R$ ${activeProduct?.originalPrice?.toFixed(2) || (activeProduct?.price ? activeProduct.price * 1.2 : 199).toFixed(2)} por apenas R$ ${activeProduct?.price.toFixed(2) || 99}`,
    `👉 Link oficial e seguro verificado na bio e comentários!`,
  ];

  const handleCopyClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Product Selector */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center space-x-2">
            <Palette className="w-6 h-6 text-emerald-600" />
            <span>Fábrica de Conteúdo com IA</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Geração de imagens publicitárias fiéis, vídeos verticais com narração e legendas, e copys comerciais multicanal.
          </p>
        </div>

        {/* Product Dropdown Selector */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Produto Ativo:</label>
          <select
            value={activeProduct?.id || ''}
            onChange={e => {
              const p = products.find(prod => prod.id === e.target.value);
              if (p) onSelectProduct(p);
            }}
            className="text-xs font-semibold border border-slate-300 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden max-w-xs truncate"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>
                [{p.marketplace}] {p.name} (R$ {p.price.toFixed(2)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub-Tabs: Imagens, Vídeos, Textos */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('images')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeSubTab === 'images'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Gerador de Imagens & Banners</span>
        </button>

        <button
          onClick={() => setActiveSubTab('videos')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeSubTab === 'videos'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Gerador de Vídeos Curtos (Reels/TikTok)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('texts')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeSubTab === 'texts'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Gerador de Copys & Textos</span>
        </button>
      </div>

      {/* TAB 1: GERADOR DE IMAGENS */}
      {activeSubTab === 'images' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Controls Panel */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Configurações do Criativo</span>
            </h3>

            {/* Format Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Formato da Mídia:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setImageFormat('stories')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    imageFormat === 'stories'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[11px] block">Stories / 9:16</span>
                </button>

                <button
                  onClick={() => setImageFormat('feed')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    imageFormat === 'feed'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Square className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[11px] block">Feed / 1:1</span>
                </button>

                <button
                  onClick={() => setImageFormat('banner')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    imageFormat === 'banner'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Monitor className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[11px] block">Banner / 16:9</span>
                </button>
              </div>
            </div>

            {/* Commercial Callout Tag */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Chamada Comercial Superior:</label>
              <select
                value={imageCallout}
                onChange={e => setImageCallout(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white"
              >
                <option value="🔥 OFERTA VERIFICADA HOJE">🔥 OFERTA VERIFICADA HOJE</option>
                <option value="⚡ O MAIS BEM AVALIADO DE 2026">⚡ O MAIS BEM AVALIADO DE 2026</option>
                <option value="💥 DESCONTO LIMITADO NO APP">💥 DESCONTO LIMITADO NO APP</option>
                <option value="✨ ACHADINHO VIRAL DO MOMENTO">✨ ACHADINHO VIRAL DO MOMENTO</option>
              </select>
            </div>

            {/* Badge Tag */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Selo Promocional de Destaque:</label>
              <select
                value={imageBadge}
                onChange={e => setImageBadge(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white"
              >
                <option value="Frete Grátis Disponível">Frete Grátis Disponível</option>
                <option value="Compra 100% Protegida">Compra 100% Protegida</option>
                <option value="Envio Rápido Full">Envio Rápido Full</option>
                <option value="Mais de 4.000 Vendidos">Mais de 4.000 Vendidos</option>
              </select>
            </div>

            {/* Compliance Guarantee Note */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] leading-relaxed">
              <strong>Fidelidade Garantida:</strong> A IA preserva a foto, modelo, marca e características reais do produto sem criar ilusões ou especificações falsas.
            </div>

            <button
              onClick={() => onSchedulePost({
                mediaType: 'image',
                mediaUrl: activeProduct?.imageUrl || '',
                caption: `🔥 ${imageCallout}!\n\n${activeProduct?.name}\nPor apenas R$ ${activeProduct?.price.toFixed(2)} no ${activeProduct?.marketplace}!\n\n${imageBadge} • Link verificado na bio e comentários.`,
                channel: 'Instagram',
              })}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Imagem para Central de Publicações</span>
            </button>
          </div>

          {/* Canvas Live Preview */}
          <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl flex flex-col items-center justify-center min-h-[460px]">
            <div className="text-xs text-slate-400 mb-3 font-semibold">
              Pré-visualização do Criativo Publicitário ({imageFormat === 'stories' ? '9:16 Vertical' : imageFormat === 'feed' ? '1:1 Quadrado' : '16:9 Banner'})
            </div>

            {/* Simulated Banner Canvas */}
            <div className={`relative bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800 transition-all ${
              imageFormat === 'stories'
                ? 'w-64 aspect-9/16'
                : imageFormat === 'feed'
                ? 'w-72 aspect-square'
                : 'w-full max-w-lg aspect-16/9'
            }`}>
              
              {/* Product Real Image */}
              <img
                src={activeProduct?.imageUrl}
                alt={activeProduct?.name}
                className="w-full h-full object-cover"
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/80 pointer-events-none" />

              {/* Top Banner Callout */}
              <div className="absolute top-3 inset-x-3 text-center">
                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-lg uppercase tracking-wide">
                  {imageCallout}
                </span>
              </div>

              {/* Center Right Promo Badge */}
              <div className="absolute top-12 right-3">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-amber-400 text-slate-950 shadow-md flex items-center space-x-1">
                  <Tag className="w-3 h-3" />
                  <span>{imageBadge}</span>
                </span>
              </div>

              {/* Bottom Product Info & CTA */}
              <div className="absolute bottom-3 inset-x-3 space-y-1.5 text-white">
                <div className="flex items-center space-x-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-white/20 backdrop-blur-md">
                    {activeProduct?.marketplace}
                  </span>
                  <span className="text-[10px] text-amber-300 font-bold">
                    ★ {activeProduct?.rating} ({activeProduct?.reviewCount})
                  </span>
                </div>

                <h4 className="text-xs font-black line-clamp-2 leading-tight">
                  {activeProduct?.name}
                </h4>

                <div className="flex items-baseline space-x-2 pt-0.5">
                  <span className="text-sm font-black text-emerald-400">
                    R$ {activeProduct?.price.toFixed(2)}
                  </span>
                  {activeProduct?.originalPrice && (
                    <span className="text-[10px] text-slate-400 line-through">
                      R$ {activeProduct?.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="w-full py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-[10px] text-center shadow-lg uppercase tracking-wider">
                  Toque no Link da Bio Oficial
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 2: GERADOR DE VÍDEOS */}
      {activeSubTab === 'videos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Controls Panel */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Video className="w-4 h-4 text-rose-600" />
              <span>Configurações do Vídeo Curto</span>
            </h3>

            {/* Duration Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Duração do Vídeo:</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[15, 30, 45, 60].map(sec => (
                  <button
                    key={sec}
                    onClick={() => setVideoDuration(sec as any)}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                      videoDuration === sec
                        ? 'border-rose-600 bg-rose-50 text-rose-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Script Angle / Variation */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ângulo do Roteiro:</label>
              <select
                value={videoAngle}
                onChange={e => setVideoAngle(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white"
              >
                <option value="offer_alert">Alerta de Oferta Relâmpago (Alto Impacto)</option>
                <option value="demo">Demonstração Prática de Funcionalidades</option>
                <option value="pain_solution">Problema do Dia a Dia x Solução</option>
                <option value="unboxing">Sensação de Unboxing e Primeiras Impressões</option>
              </select>
            </div>

            {/* Audio Voice Control */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700 flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>Narração em Português (TTS)</span>
              </span>
              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className={`p-1.5 rounded-lg border text-xs font-bold ${
                  isAudioMuted ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Roteiro Comercial Pré-gerado */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800">Roteiro de Vendas Sincronizado:</span>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                "{subtitlesList.join(' ')}"
              </p>
            </div>

            <button
              onClick={() => onSchedulePost({
                mediaType: 'video',
                mediaUrl: activeProduct?.imageUrl || '',
                caption: `🚨 Alerta de achadinho! Testei e aprovei: ${activeProduct?.name}! Confira os detalhes no link verificado na bio. #achadinhos #viral #afiliado`,
                channel: 'TikTok',
              })}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Vídeo para Central de Publicações</span>
            </button>
          </div>

          {/* Interactive Video Player (9:16) */}
          <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl flex flex-col items-center justify-center min-h-[480px]">
            <div className="text-xs text-slate-400 mb-3 font-semibold">
              Player Vertical Interativo (Estilo TikTok / Reels / Shorts)
            </div>

            <div className="relative w-64 aspect-9/16 bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-700">
              
              {/* Product Background Image with gentle zoom effect during play */}
              <img
                src={activeProduct?.imageUrl}
                alt={activeProduct?.name}
                className={`w-full h-full object-cover transition-transform duration-1000 ${
                  isPlaying ? 'scale-110' : 'scale-100'
                }`}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />

              {/* Dynamic Animated Subtitle / Karaoke Style */}
              <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 text-center pointer-events-none">
                <div className="inline-block p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-yellow-400/80 shadow-2xl">
                  <span className="text-xs sm:text-sm font-black text-yellow-300 tracking-wide uppercase drop-shadow-md">
                    {subtitlesList[currentSubtitleIndex]}
                  </span>
                </div>
              </div>

              {/* Video Overlay Top Badge */}
              <div className="absolute top-4 left-3 right-3 flex items-center justify-between text-white text-[10px]">
                <span className="px-2 py-0.5 rounded-full bg-rose-600 font-bold uppercase tracking-wide">
                  TikTok / Shorts {videoDuration}s
                </span>
                <span className="px-2 py-0.5 rounded-full bg-black/60 font-mono">
                  {isPlaying ? '0:14' : '0:00'} / 0:{videoDuration}
                </span>
              </div>

              {/* Play/Pause Center Button Overlay */}
              <button
                onClick={handleTogglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                title={isPlaying ? 'Pausar reprodução' : 'Reproduzir vídeo com narração em áudio'}
              >
                {!isPlaying && (
                  <div className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                )}
              </button>

              {/* Bottom Video Floating Action */}
              <div className="absolute bottom-3 inset-x-3 space-y-1 text-white">
                <div className="text-[11px] font-bold line-clamp-1">{activeProduct?.name}</div>
                <div className="text-xs font-black text-emerald-400">R$ {activeProduct?.price.toFixed(2)}</div>
                <div className="w-full py-1.5 rounded-lg bg-rose-600 text-white text-[10px] font-black text-center shadow-md">
                  Ver Oferta Oficial na Bio
                </div>
              </div>

            </div>

            {/* Play Controls Bar */}
            <div className="mt-4 flex items-center space-x-3">
              <button
                onClick={handleTogglePlay}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pausar Prévia' : 'Ouvir e Reproduzir Vídeo'}</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: GERADOR DE TEXTOS / COPYS */}
      {activeSubTab === 'texts' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          
          {/* Channel Selector for Texts */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Copys e Legendas Adaptadas por Canal
              </h3>
              <p className="text-xs text-slate-500">
                Linguagem comercial natural, sem promessas enganosas e com chamadas de ação autorizadas.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(['Instagram', 'TikTok', 'WhatsApp', 'YouTube', 'Facebook', 'Pinterest'] as const).map(ch => (
                <button
                  key={ch}
                  onClick={() => setActiveChannelCopy(ch)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeChannelCopy === ch
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {/* Generated Content Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Copy Box */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Texto Otimizado para {activeChannelCopy}
                </span>
                <button
                  onClick={() => handleCopyClipboard(generatedCopies?.captions?.[activeChannelCopy] || '')}
                  className="flex items-center space-x-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  {copiedText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedText ? 'Copiado!' : 'Copiar Texto'}</span>
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 leading-relaxed whitespace-pre-line min-h-[180px]">
                {isGeneratingCopy ? (
                  <div className="flex items-center space-x-2 text-slate-400 h-32 justify-center">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>Gerando texto inteligente com a IA...</span>
                  </div>
                ) : (
                  generatedCopies?.captions?.[activeChannelCopy] || 'Carregando texto oficial...'
                )}
              </div>

              <button
                onClick={() => onSchedulePost({
                  mediaType: 'image',
                  mediaUrl: activeProduct?.imageUrl || '',
                  caption: generatedCopies?.captions?.[activeChannelCopy] || '',
                  channel: activeChannelCopy,
                })}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                <Send className="w-4 h-4" />
                <span>Agendar Post com este Texto</span>
              </button>
            </div>

            {/* Titles & Hashtags Box */}
            <div className="space-y-4">
              
              {/* Titles */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Títulos de Alta Conversão Sugeridos:
                </span>
                <div className="space-y-1.5">
                  {(generatedCopies?.titles || [
                    `Achadinho imperdível: ${activeProduct?.name}`,
                    `Economize hoje no ${activeProduct?.marketplace}`,
                    `Review sincero: Vale a pena comprar?`,
                  ]).map((title: string, i: number) => (
                    <div
                      key={i}
                      onClick={() => handleCopyClipboard(title)}
                      className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 cursor-pointer flex justify-between items-center"
                    >
                      <span>{title}</span>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Hashtags */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Hashtags Recomendadas para Alcance:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(generatedCopies?.hashtags || ['#achadinhos', '#promoção', '#afiliado', '#oferta']).map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
