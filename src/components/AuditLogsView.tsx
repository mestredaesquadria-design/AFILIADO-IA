import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Download, 
  RefreshCw, 
  Search, 
  Database,
  Lock,
  UserCheck
} from 'lucide-react';
import { AuditLog } from '../types';

interface AuditLogsViewProps {
  logs: AuditLog[];
  onRefreshLogs: () => void;
  onResetDb: () => void;
  highContrast: boolean;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({
  logs,
  onRefreshLogs,
  onResetDb,
  highContrast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(l => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return l.action.toLowerCase().includes(q) || l.details.toLowerCase().includes(q) || l.category.toLowerCase().includes(q);
  });

  const exportLogsAsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `auditoria_afiliado_ia_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center space-x-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            <span>Registro de Atividades & Conformidade LGPD</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Trilha de auditoria completa de todas as operações realizadas no sistema com isolamento de segurança e proteção de tokens.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportLogsAsJson}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Exportar Relatório JSON</span>
          </button>

          <button
            onClick={onResetDb}
            className="flex items-center space-x-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
            title="Restaurar dados oficiais iniciais de demonstração"
          >
            <Database className="w-4 h-4" />
            <span>Restaurar Banco de Dados</span>
          </button>
        </div>
      </div>

      {/* Security & LGPD Principles Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
          <div className="font-bold flex items-center space-x-1.5">
            <Lock className="w-4 h-4 text-emerald-700" />
            <span>Tokens e Chaves Protegidos</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            Credenciais do Mercado Livre, Shopee, TikTok Shop e Gemini residem exclusivamente no backend sem exposição no cliente.
          </p>
        </div>

        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-900 space-y-1">
          <div className="font-bold flex items-center space-x-1.5">
            <UserCheck className="w-4 h-4 text-blue-700" />
            <span>Conformidade com LGPD & Termos</span>
          </div>
          <p className="text-[11px] text-blue-800 leading-relaxed">
            O sistema não coleta dados sensíveis de compradores e não faz scraping proibido, respeitando as políticas oficiais de afiliados.
          </p>
        </div>

        <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 space-y-1">
          <div className="font-bold flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-700" />
            <span>Trilha de Auditoria Auditável</span>
          </div>
          <p className="text-[11px] text-purple-800 leading-relaxed">
            Todas as ações de criação de campanhas, conexões e pagamentos ficam registradas com timestamp e endereço IP.
          </p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Filtrar por ação, detalhes ou categoria..."
              className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
          </div>

          <button
            onClick={onRefreshLogs}
            className="p-2 rounded-lg border hover:bg-slate-100 text-slate-600 text-xs font-bold flex items-center space-x-1"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Atualizar</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Ação</th>
                <th className="py-3 px-4">Detalhes</th>
                <th className="py-3 px-4 text-right">Usuário</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 font-mono text-[11px]">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-xs">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-500">
                    {log.user}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
