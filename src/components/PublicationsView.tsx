import React, { useState } from 'react';
import { 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Copy, 
  ExternalLink, 
  Eye, 
  Play, 
  Check, 
  Layers, 
  ShieldCheck, 
  Smartphone, 
  Video, 
  Image as ImageIcon,
  History,
  Trash2
} from 'lucide-react';
import { Publication } from '../types';

interface PublicationsViewProps {
  publications: Publication[];
  onPublishNow: (id: string) => void;
  onUpdateStatus: (id: string, status: Publication['status']) => void;
  onDeletePublication: (id: string) => void;
  highContrast: boolean;
}

export const PublicationsView: React.FC<PublicationsViewProps> = ({
  publications,
  onPublishNow,
  onUpdateStatus,
  onDeletePublication,
  highContrast,
}) => {
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('Todas');
  const [selectedHistoryPub, setSelectedHistoryPub] = useState<Publication | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const statuses = ['Todas', 'Em preparação', 'Aguardando aprovação', 'Agendada', 'Publicada', 'Falhou', 'Cancelada'];

  const filteredPubs = publications.filter(p => {
    if (activeStatusFilter === 'Todas') return true;
    return p.status === activeStatusFilter;
  });

  const getStatusBadge = (status: Publication['status']) => {
    switch (status) {
      case 'Publicada':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /><span>Publicada</span></span>;
      case 'Agendada':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center space-x-1"><Clock className="w-3.5 h-3.5 text-blue-600" /><span>Agendada</span></span>;
      case 'Aguardando aprovação':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center space-x-1"><Clock className="w-3.5 h-3.5 text-amber-600" /><span>Aguardando Aprovação</span></span>;
      case 'Em preparação':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 flex items-center space-x-1"><Layers className="w-3.5 h-3.5 text-slate-500" /><span>Em preparação</span></span>;
      case 'Falhou':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center space-x-1"><AlertCircle className="w-3.5 h-3.5 text-rose-600" /><span>Falhou</span></span>;
      case 'Cancelada':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-600 flex items-center space-x-1"><XCircle className="w-3.5 h-3.5 text-slate-500" /><span>Cancelada</span></span>;
      default:
        return <span>{status}</span>;
    }
  };

  const getChannelBadge = (channel: string) => {
    const colors: Record<string, string> = {
      TikTok: 'bg-slate-900 text-cyan-300',
      Instagram: 'bg-rose-50 text-rose-700 border-rose-200',
      WhatsApp: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      YouTube: 'bg-red-50 text-red-700 border-red-200',
      Facebook: 'bg-blue-50 text-blue-800 border-blue-200',
      Pinterest: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${colors[channel] || 'bg-slate-100 text-slate-800'}`}>
        {channel}
      </span>
    );
  };

  const handleAssistedPublish = (pub: Publication) => {
    // Copy text + link
    const textToCopy = `${pub.caption}\n\n${pub.hashtags.join(' ')}\n\nLink oficial de afiliado: ${pub.affiliateUrl}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedPostId(pub.id);
    setTimeout(() => setCopiedPostId(null), 3000);

    // Open appropriate web interface for assisted dispatch
    const channelUrls: Record<string, string> = {
      Instagram: 'https://instagram.com',
      TikTok: 'https://www.tiktok.com/upload',
      WhatsApp: 'https://web.whatsapp.com',
      YouTube: 'https://studio.youtube.com',
      Facebook: 'https://facebook.com',
      Pinterest: 'https://pinterest.com',
    };
    const targetUrl = channelUrls[pub.channel] || 'https://instagram.com';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center space-x-2">
            <Send className="w-6 h-6 text-emerald-600" />
            <span>Central de Publicações & Distribuição</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Distribuição multicanal com modos Automático, Agendado e Assistido com proteção contra postagens duplicadas.
          </p>
        </div>

        {/* Protection Anti-Duplication Badge */}
        <div className="flex items-center space-x-2 px-3.5 py-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Proteção Anti-Spam Ativa (Máx. 4 posts/dia por canal)</span>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
        {statuses.map(st => (
          <button
            key={st}
            onClick={() => setActiveStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeStatusFilter === st
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Publications Cards List */}
      <div className="space-y-4">
        {filteredPubs.map(pub => (
          <div
            key={pub.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
          >
            {/* Left: Media Thumbnail + Info */}
            <div className="flex items-start space-x-4">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <img
                  src={pub.mediaUrl}
                  alt={pub.productName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 left-1 p-1 rounded-md bg-black/60 text-white text-[10px]">
                  {pub.mediaType === 'video' ? <Video className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  {getChannelBadge(pub.channel)}
                  {getStatusBadge(pub.status)}
                  <span className="text-[11px] text-slate-400 font-mono">
                    Modo: {pub.mode}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-1 max-w-lg">
                  {pub.productName}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed max-w-xl">
                  {pub.caption}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Horário: {new Date(pub.scheduledTime).toLocaleString('pt-BR')}</span>
                  </span>
                  <span>•</span>
                  <span className="text-emerald-700 font-medium font-mono truncate max-w-xs">
                    Link: {pub.affiliateUrl}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              
              {/* Assisted Publish Button (Requirement 8) */}
              <button
                onClick={() => handleAssistedPublish(pub)}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
                title="Copiar texto/link e abrir canal oficial"
              >
                {copiedPostId === pub.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copiado e Aberto!</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    <span>Publicação Assistida</span>
                  </>
                )}
              </button>

              {/* Publish Direct Button */}
              {pub.status !== 'Publicada' && (
                <button
                  onClick={() => onPublishNow(pub.id)}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publicar Agora</span>
                </button>
              )}

              {/* Approve Button if waiting */}
              {pub.status === 'Aguardando aprovação' && (
                <button
                  onClick={() => onUpdateStatus(pub.id, 'Agendada')}
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Aprovar
                </button>
              )}

              {/* History Button */}
              <button
                onClick={() => setSelectedHistoryPub(pub)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600"
                title="Ver histórico de operações"
              >
                <History className="w-4 h-4" />
              </button>

              {/* Delete Button */}
              <button
                onClick={() => onDeletePublication(pub.id)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-rose-50 text-rose-600"
                title="Excluir publicação"
              >
                <Trash2 className="w-4 h-4" />
              </button>

            </div>

          </div>
        ))}
      </div>

      {/* History Modal */}
      {selectedHistoryPub && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <History className="w-5 h-5 text-emerald-600" />
                <span>Histórico de Operações</span>
              </h3>
              <button onClick={() => setSelectedHistoryPub(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <p className="text-xs text-slate-600 font-semibold">{selectedHistoryPub.productName}</p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {selectedHistoryPub.history.map((h, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>{new Date(h.timestamp).toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="font-bold text-slate-800">{h.action}</div>
                  {h.details && <div className="text-slate-500 text-[11px]">{h.details}</div>}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedHistoryPub(null)}
                className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
