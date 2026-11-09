import React, { useState } from 'react';
import { 
  Network, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ShieldCheck, 
  Key, 
  Lock, 
  RefreshCw, 
  Power, 
  History, 
  ExternalLink,
  ShoppingBag,
  Share2,
  Check
} from 'lucide-react';
import { PlatformConnection } from '../types';

interface ConnectionsViewProps {
  connections: PlatformConnection[];
  onConnect: (id: string, credentials: any) => Promise<void>;
  onDisconnect: (id: string) => Promise<void>;
  onSync: (id: string) => Promise<void>;
  highContrast: boolean;
}

export const ConnectionsView: React.FC<ConnectionsViewProps> = ({
  connections,
  onConnect,
  onDisconnect,
  onSync,
  highContrast,
}) => {
  const [selectedConnection, setSelectedConnection] = useState<PlatformConnection | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for connection modal
  const [accountNameInput, setAccountNameInput] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiSecretInput, setApiSecretInput] = useState('');

  const marketplaces = connections.filter(c => c.type === 'marketplace');
  const socials = connections.filter(c => c.type === 'social');

  const handleOpenConnect = (conn: PlatformConnection) => {
    setSelectedConnection(conn);
    setAccountNameInput(conn.accountName || '');
    setApiKeyInput(conn.credentialsConfigured ? '••••••••••••••••' : '');
    setApiSecretInput(conn.credentialsConfigured ? '••••••••••••••••' : '');
    setShowConnectModal(true);
  };

  const handleOpenHistory = (conn: PlatformConnection) => {
    setSelectedConnection(conn);
    setShowHistoryModal(true);
  };

  const handleSubmitConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConnection) return;
    setIsSubmitting(true);
    try {
      await onConnect(selectedConnection.id, {
        accountName: accountNameInput,
        apiKey: apiKeyInput,
        appSecret: apiSecretInput,
      });
      setShowConnectModal(false);
    } catch (err) {
      console.error('Erro na conexão:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: PlatformConnection['status']) => {
    switch (status) {
      case 'connected':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Conectado</span>
          </span>
        );
      case 'pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center space-x-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Em Análise</span>
          </span>
        );
      case 'error':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center space-x-1">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Erro Token</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>Desconectado</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center space-x-2">
            <Network className="w-6 h-6 text-emerald-600" />
            <span>Conexões com Plataformas & Redes Sociais</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Autenticação segura via APIs oficiais autorizadas do Mercado Livre, Shopee, TikTok Shop e principais redes sociais.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Tokens Criptografados e Protegidos no Backend</span>
        </div>
      </div>

      {/* SECTION 1: MARKETPLACES */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-slate-900 font-black text-sm uppercase tracking-wider">
          <ShoppingBag className="w-4 h-4 text-emerald-600" />
          <span>Programas de Afiliados (Marketplaces)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketplaces.map(conn => (
            <div
              key={conn.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-black text-base text-slate-900">{conn.platform}</h3>
                    <span className="text-[11px] text-slate-500">Programa de Afiliados Oficial</span>
                  </div>
                  {getStatusBadge(conn.status)}
                </div>

                {/* Account Details */}
                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Identificação:</span>
                    <span className="font-bold text-slate-800">{conn.accountName || 'Não configurada'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ID da Conta:</span>
                    <span className="font-mono text-slate-700">{conn.accountId || '---'}</span>
                  </div>
                  {conn.lastSyncAt && (
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Última Sinc:</span>
                      <span>{new Date(conn.lastSyncAt).toLocaleTimeString('pt-BR')}</span>
                    </div>
                  )}
                </div>

                {/* Permissions Checklist (Requirement 2) */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                    Permissões Verificadas:
                  </span>
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <div className="flex items-center space-x-1 text-emerald-700">
                      <Check className="w-3.5 h-3.5" />
                      <span>Ler Produtos</span>
                    </div>
                    <div className="flex items-center space-x-1 text-emerald-700">
                      <Check className="w-3.5 h-3.5" />
                      <span>Comissões</span>
                    </div>
                    <div className="flex items-center space-x-1 text-emerald-700">
                      <Check className="w-3.5 h-3.5" />
                      <span>Métricas</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${conn.permissions.publishContent ? 'text-emerald-700' : 'text-slate-400'}`}>
                      <Check className="w-3.5 h-3.5" />
                      <span>Publicação</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenHistory(conn)}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold"
                  title="Histórico de operações e erros"
                >
                  <History className="w-4 h-4" />
                </button>

                {conn.status === 'connected' ? (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onSync(conn.id)}
                      className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700"
                      title="Sincronizar agora"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDisconnect(conn.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200"
                    >
                      Desconectar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenConnect(conn)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                  >
                    Conectar Conta
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: SOCIAL NETWORKS */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center space-x-2 text-slate-900 font-black text-sm uppercase tracking-wider">
          <Share2 className="w-4 h-4 text-emerald-600" />
          <span>Redes Sociais & Canais de Divulgação</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {socials.map(conn => (
            <div
              key={conn.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-black text-base text-slate-900">{conn.platform}</h3>
                    <span className="text-[11px] text-slate-500">Distribuição Autorizada</span>
                  </div>
                  {getStatusBadge(conn.status)}
                </div>

                {/* Account Details */}
                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Perfil / Canal:</span>
                    <span className="font-bold text-slate-800">{conn.accountName || 'Não conectado'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ID Conexão:</span>
                    <span className="font-mono text-slate-700">{conn.accountId || '---'}</span>
                  </div>
                </div>

                {/* Permissions */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                    Permissões Verificadas:
                  </span>
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <div className="flex items-center space-x-1 text-emerald-700">
                      <Check className="w-3.5 h-3.5" />
                      <span>Postar Vídeos</span>
                    </div>
                    <div className="flex items-center space-x-1 text-emerald-700">
                      <Check className="w-3.5 h-3.5" />
                      <span>Postar Imagens</span>
                    </div>
                    <div className="flex items-center space-x-1 text-emerald-700">
                      <Check className="w-3.5 h-3.5" />
                      <span>Ler Métricas</span>
                    </div>
                    <div className="flex items-center space-x-1 text-emerald-700">
                      <Check className="w-3.5 h-3.5" />
                      <span>Agendamento</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenHistory(conn)}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold"
                  title="Histórico de operações e erros"
                >
                  <History className="w-4 h-4" />
                </button>

                {conn.status === 'connected' ? (
                  <button
                    onClick={() => onDisconnect(conn.id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200"
                  >
                    Desconectar
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenConnect(conn)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                  >
                    Conectar Perfil
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Connect Modal */}
      {showConnectModal && selectedConnection && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSubmitConnect} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-slate-900">
                Conectar com {selectedConnection.platform}
              </h3>
              <button type="button" onClick={() => setShowConnectModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Autenticação segura via API Oficial do {selectedConnection.platform}. Insira seu identificador de afiliado/canal para autorizar a sincronização de dados e métricas.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome da Conta / Perfil:</label>
                <input
                  type="text"
                  required
                  value={accountNameInput}
                  onChange={e => setAccountNameInput(e.target.value)}
                  placeholder="Ex: @meucanal ou Conta Afiliado Oficial"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">App Client ID / API Key:</label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={e => setApiKeyInput(e.target.value)}
                  placeholder="Insira a chave da API oficial..."
                  className="w-full p-2.5 border rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Client Secret / Token de Acesso:</label>
                <input
                  type="password"
                  value={apiSecretInput}
                  onChange={e => setApiSecretInput(e.target.value)}
                  placeholder="Insira o segredo do aplicativo..."
                  className="w-full p-2.5 border rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl text-[11px] text-emerald-900 leading-relaxed">
              🔒 <strong>Segurança Ponta-a-Ponta:</strong> Suas credenciais são transmitidas de forma encriptada e nunca expostas no código do navegador.
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConnectModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
              >
                {isSubmitting ? 'Autenticando...' : 'Autorizar e Conectar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedConnection && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <History className="w-5 h-5 text-emerald-600" />
                <span>Histórico de Operações: {selectedConnection.platform}</span>
              </h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {selectedConnection.history.map((h, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">{h.event}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(h.timestamp).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-slate-600">{h.message}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowHistoryModal(false)}
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
