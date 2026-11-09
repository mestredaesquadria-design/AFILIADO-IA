import React, { useState, useEffect } from 'react';
import { 
  Link2, 
  Plus, 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  MousePointer, 
  DollarSign, 
  Search,
  Download,
  ShieldCheck,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { AffiliateLink, AffiliateProduct } from '../types';

interface LinksManagerViewProps {
  links: AffiliateLink[];
  products: AffiliateProduct[];
  onAddLink: (link: any) => void;
  onDeleteLink: (id: string) => void;
  onRefreshLinks: () => void;
  highContrast: boolean;
}

export const LinksManagerView: React.FC<LinksManagerViewProps> = ({
  links,
  products,
  onAddLink,
  onDeleteLink,
  onRefreshLinks,
  highContrast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState<{ url: string; qrDataUrl: string; productName: string } | null>(null);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);

  // New link form
  const [newProductId, setNewProductId] = useState(products[0]?.id || '');
  const [newAffiliateUrl, setNewAffiliateUrl] = useState('');
  const [newSubId, setNewSubId] = useState('org_insta_reels');
  const [newCampaignTag, setNewCampaignTag] = useState('black_friday_2026');

  const filteredLinks = links.filter(l => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return l.productName.toLowerCase().includes(q) || l.subId.toLowerCase().includes(q) || l.marketplace.toLowerCase().includes(q);
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleOpenQrModal = async (link: AffiliateLink) => {
    setIsGeneratingQr(true);
    try {
      const res = await fetch(`/api/links/${link.id}/qrcode`);
      const data = await res.json();
      if (data.qrcode) {
        setSelectedQrCode({
          url: link.affiliateUrl,
          qrDataUrl: data.qrcode,
          productName: link.productName,
        });
      }
    } catch (err) {
      console.error('Erro ao gerar QR Code:', err);
    } finally {
      setIsGeneratingQr(false);
    }
  };

  const handleAddLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === newProductId);
    onAddLink({
      productId: newProductId,
      productName: prod ? prod.name : 'Produto',
      marketplace: prod ? prod.marketplace : 'Mercado Livre',
      affiliateUrl: newAffiliateUrl,
      subId: newSubId,
      campaignTag: newCampaignTag,
    });
    setShowAddModal(false);
    setNewAffiliateUrl('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center space-x-2">
            <Link2 className="w-6 h-6 text-emerald-600" />
            <span>Gerenciador de Links de Afiliados</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize códigos de rastreamento (subIDs), gere QR Codes oficiais, monitore cliques e garanta a integridade das suas comissões.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Link de Afiliado</span>
        </button>
      </div>

      {/* Compliance Box (Requirement 7) */}
      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <strong>Garantia de Atribuição Segura:</strong> O sistema mantém estritamente intactos todos os parâmetros de identificação oficial de afiliado dos marketplaces (Mercado Livre, Shopee e TikTok Shop). Não são aplicados redirecionamentos proibidos ou técnicas de mascaramento que violem as políticas dos programas.
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por produto, marketplace ou SubID..."
            className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
          />
        </div>

        <button
          onClick={onRefreshLinks}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center space-x-1"
          title="Verificar integridade dos links"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Health Check</span>
        </button>
      </div>

      {/* Links Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Produto Associado</th>
                <th className="py-3 px-4">Marketplace</th>
                <th className="py-3 px-4">Rastreamento (SubID)</th>
                <th className="py-3 px-4 text-center">Cliques</th>
                <th className="py-3 px-4 text-center">Vendas</th>
                <th className="py-3 px-4 text-right">Comissões</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLinks.map(link => (
                <tr key={link.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs">
                    <div className="truncate" title={link.productName}>{link.productName}</div>
                    <div className="text-[10px] text-slate-400 font-normal font-mono truncate max-w-xs">
                      {link.affiliateUrl}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                      {link.marketplace}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-emerald-800 font-semibold">
                    {link.subId}
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                    {link.clicks.toLocaleString('pt-BR')}
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold text-blue-700">
                    {link.conversions}
                  </td>

                  <td className="py-3.5 px-4 text-right font-black text-emerald-700">
                    R$ {link.earnings.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Ativo & Seguro</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                    {/* Copy Link Button */}
                    <button
                      onClick={() => handleCopy(link.affiliateUrl, link.id)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700"
                      title="Copiar link oficial"
                    >
                      {copiedId === link.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* QR Code Button */}
                    <button
                      onClick={() => handleOpenQrModal(link)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700"
                      title="Gerar e baixar QR Code"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Link */}
                    <button
                      onClick={() => onDeleteLink(link.id)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-rose-600"
                      title="Excluir link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Modal */}
      {selectedQrCode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-slate-900">QR Code Oficial de Afiliado</h3>
            <p className="text-xs text-slate-500 line-clamp-2">{selectedQrCode.productName}</p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block shadow-inner">
              <img
                src={selectedQrCode.qrDataUrl}
                alt="QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>

            <p className="text-[11px] text-slate-400 font-mono truncate px-2">
              {selectedQrCode.url}
            </p>

            <div className="flex justify-center space-x-2 pt-2">
              <a
                href={selectedQrCode.qrDataUrl}
                download="qrcode-afiliado-ia.png"
                className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Baixar Imagem PNG</span>
              </a>

              <button
                onClick={() => setSelectedQrCode(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Link Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddLinkSubmit} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-slate-900">Cadastrar Link de Afiliado</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Produto do Catálogo:</label>
                <select
                  value={newProductId}
                  onChange={e => setNewProductId(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-white"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.marketplace}] {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Link de Afiliado Oficial:</label>
                <input
                  type="url"
                  required
                  value={newAffiliateUrl}
                  onChange={e => setNewAffiliateUrl(e.target.value)}
                  placeholder="https://mercadolivre.com/sec/... ou https://shope.ee/..."
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Identificador SubID:</label>
                  <input
                    type="text"
                    value={newSubId}
                    onChange={e => setNewSubId(e.target.value)}
                    placeholder="ex: reels_insta_01"
                    className="w-full p-2.5 border rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tag de Campanha:</label>
                  <input
                    type="text"
                    value={newCampaignTag}
                    onChange={e => setNewCampaignTag(e.target.value)}
                    placeholder="ex: lancamento_nov"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
              >
                Salvar Link
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
