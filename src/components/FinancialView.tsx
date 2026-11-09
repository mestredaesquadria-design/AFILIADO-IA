import React, { useState } from 'react';
import { 
  DollarSign, 
  Clock, 
  CheckCheck, 
  XCircle, 
  TrendingUp, 
  ShieldAlert, 
  Upload, 
  Plus, 
  FileText, 
  Download, 
  Filter,
  CheckCircle2,
  Calendar,
  Building
} from 'lucide-react';
import { CommissionRecord } from '../types';

interface FinancialViewProps {
  commissions: CommissionRecord[];
  totals: {
    estimada: number;
    pendente: number;
    aprovada: number;
    cancelada: number;
    paga: number;
  };
  onRegisterReceipt: (id: string, paymentDate: string, receiptNumber: string) => void;
  onImportCsv: (csvContent: string) => void;
  onAddCommission: (comm: any) => void;
  highContrast: boolean;
}

export const FinancialView: React.FC<FinancialViewProps> = ({
  commissions,
  totals,
  onRegisterReceipt,
  onImportCsv,
  onAddCommission,
  highContrast,
}) => {
  const [filterMarketplace, setFilterMarketplace] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedCommId, setSelectedCommId] = useState<string | null>(null);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  // Import CSV modal state
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvText, setCsvText] = useState(`Produto,Marketplace,ValorVenda,ValorComissao,Status
Fritadeira Air Fryer 5.5L,Mercado Livre,389.90,46.78,aprovada
Fone Bluetooth TWS ANC,Shopee,149.90,21.73,paga
Mini Triturador USB,TikTok Shop,49.90,8.98,paga
Kit Sérum Vitamina C,TikTok Shop,89.90,17.98,pendente`);

  const filteredCommissions = commissions.filter(c => {
    if (filterMarketplace !== 'all' && c.marketplace !== filterMarketplace) return false;
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    return true;
  });

  const handleOpenReceiptModal = (id: string) => {
    setSelectedCommId(id);
    setReceiptNumber(`PIX-REC-${Math.floor(100000 + Math.random() * 900000)}`);
    setShowReceiptModal(true);
  };

  const handleReceiptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommId) return;
    onRegisterReceipt(selectedCommId, paymentDate, receiptNumber);
    setShowReceiptModal(false);
    setSelectedCommId(null);
  };

  const handleCsvSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onImportCsv(csvText);
    setShowCsvModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center space-x-2">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            <span>Painel Financeiro de Comissões de Afiliado</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Controle consolidado das receitas de afiliados com conferência de lotes e registro de liquidações Pix/Bancárias.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCsvModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
          >
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>Importar Relatório CSV</span>
          </button>
        </div>
      </div>

      {/* Mandatory Regulatory Compliance Disclaimer (Requirement 11) */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 text-xs leading-relaxed flex items-start space-x-3">
        <Building className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-emerald-400">Declaração de Não-Custódia & Conformidade Legal:</strong> A plataforma AFILIADO IA opera exclusivamente como software de gestão de marketing e conexão via APIs oficiais. O sistema não é instituição financeira, não recebe pagamentos de clientes finais, não transaciona valores de terceiros e não processa pedidos. Todas as comissões são creditadas e pagas diretamente pelos programas oficiais (Mercado Livre Afiliados, Shopee Afiliados e TikTok Shop) na conta bancária/Pix cadastrada pelo administrador em cada marketplace.
        </div>
      </div>

      {/* 5 Distinct Commission Columns (Requirement 11) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* 1. Comissão Estimada */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">1. Estimada</span>
            <TrendingUp className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-700">
              R$ {totals.estimada.toFixed(2)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Cliques com intenção ativa</p>
          </div>
        </div>

        {/* 2. Comissão Pendente */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-bold uppercase tracking-wider">2. Pendente</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-amber-700">
              R$ {totals.pendente.toFixed(2)}
            </div>
            <p className="text-[11px] text-amber-600 mt-1">Em prazo de garantia (7-30d)</p>
          </div>
        </div>

        {/* 3. Comissão Aprovada */}
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-700">
            <span className="text-xs font-bold uppercase tracking-wider">3. Aprovada</span>
            <CheckCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-blue-700">
              R$ {totals.aprovada.toFixed(2)}
            </div>
            <p className="text-[11px] text-blue-600 mt-1">Confirmada para liquidação</p>
          </div>
        </div>

        {/* 4. Comissão Cancelada */}
        <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-xs font-bold uppercase tracking-wider">4. Cancelada</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-rose-700">
              R$ {totals.cancelada.toFixed(2)}
            </div>
            <p className="text-[11px] text-rose-600 mt-1">Devoluções de clientes</p>
          </div>
        </div>

        {/* 5. Comissão Paga (Efetivamente Recebida) */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-300 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-bold uppercase tracking-wider">5. Paga / Recebida</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-emerald-700">
              R$ {totals.paga.toFixed(2)}
            </div>
            <p className="text-[11px] text-emerald-800 font-bold mt-1">Creditada em conta bancária</p>
          </div>
        </div>

      </div>

      {/* Filter and Commission Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700">Extrato de Comissões:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterMarketplace}
              onChange={e => setFilterMarketplace(e.target.value)}
              className="text-xs p-2 border border-slate-200 rounded-xl bg-slate-50"
            >
              <option value="all">Todos os Marketplaces</option>
              <option value="Mercado Livre">Mercado Livre</option>
              <option value="Shopee">Shopee</option>
              <option value="TikTok Shop">TikTok Shop</option>
            </select>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="text-xs p-2 border border-slate-200 rounded-xl bg-slate-50"
            >
              <option value="all">Todos os Status</option>
              <option value="estimada">Estimada</option>
              <option value="pendente">Pendente</option>
              <option value="aprovada">Aprovada</option>
              <option value="cancelada">Cancelada</option>
              <option value="paga">Paga</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Data Venda</th>
                <th className="py-3 px-4">Produto & Campanha</th>
                <th className="py-3 px-4">Marketplace</th>
                <th className="py-3 px-4">Canal Atribuição</th>
                <th className="py-3 px-4 text-right">Valor Venda</th>
                <th className="py-3 px-4 text-right">Taxa (%)</th>
                <th className="py-3 px-4 text-right">Sua Comissão</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Comprovante / Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCommissions.map(comm => (
                <tr key={comm.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {comm.date}
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-900 max-w-xs truncate" title={comm.productName}>
                    {comm.productName}
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {comm.marketplace}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-700">
                    {comm.channel}
                  </td>

                  <td className="py-3 px-4 text-right font-medium">
                    R$ {comm.saleValue.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-slate-600">
                    {comm.commissionRate.toFixed(1)}%
                  </td>

                  <td className="py-3 px-4 text-right font-black text-emerald-700 text-sm">
                    R$ {comm.commissionValue.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      comm.status === 'paga'
                        ? 'bg-emerald-100 text-emerald-800'
                        : comm.status === 'aprovada'
                        ? 'bg-blue-100 text-blue-800'
                        : comm.status === 'pendente'
                        ? 'bg-amber-100 text-amber-800'
                        : comm.status === 'cancelada'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {comm.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {comm.status === 'paga' ? (
                      <span className="text-[10px] font-mono text-emerald-700 font-bold" title={comm.receiptNumber}>
                        {comm.receiptNumber || 'PIX Confirmado'}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleOpenReceiptModal(comm.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200"
                      >
                        Registrar Pagamento
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Register Payment Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleReceiptSubmit} className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-slate-900">Registrar Comprovante de Pagamento</h3>
            <p className="text-xs text-slate-500">
              Insira os dados do comprovante oficial de liquidação enviado pelo marketplace para conciliação.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Data do Pagamento / Pix:</label>
                <input
                  type="date"
                  required
                  value={paymentDate}
                  onChange={e => setPaymentDate(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nº Comprovante / Autenticação Pix:</label>
                <input
                  type="text"
                  required
                  value={receiptNumber}
                  onChange={e => setReceiptNumber(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
              >
                Salvar Comprovante
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CSV Import Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCsvSubmit} className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-slate-900">Importação de Relatórios CSV de Afiliados</h3>
              <button type="button" onClick={() => setShowCsvModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <p className="text-xs text-slate-500">
              Cole o conteúdo exportado do painel do Mercado Livre, Shopee ou TikTok Shop para importar vendas e comissões automaticamente.
            </p>

            <div>
              <label className="block font-bold text-slate-700 text-xs mb-1">Conteúdo CSV (com cabeçalho):</label>
              <textarea
                rows={6}
                value={csvText}
                onChange={e => setCsvText(e.target.value)}
                className="w-full p-2.5 border rounded-xl font-mono text-xs bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCsvModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
              >
                Importar e Conciliar
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
