import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Heart, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Star, 
  ShoppingBag, 
  TrendingUp, 
  Plus, 
  Trash2, 
  RefreshCw,
  Zap,
  SlidersHorizontal,
  DollarSign,
  AlertCircle,
  AlertTriangle,
  Loader2,
  X
} from 'lucide-react';
import { AffiliateProduct } from '../types';

interface ProductsViewProps {
  products: AffiliateProduct[];
  onToggleFavorite: (id: string, isFav: boolean) => void;
  onSelectForCampaign: (product: AffiliateProduct) => void;
  onRefreshProducts: () => void;
  onAddNewProduct: (product: any) => void;
  onImportUrl: (url: string) => void;
  highContrast: boolean;
  isLoading?: boolean;
  error?: string | null;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  onToggleFavorite,
  onSelectForCampaign,
  onRefreshProducts,
  onAddNewProduct,
  onImportUrl,
  highContrast,
  isLoading = false,
  error = null,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMarketplace, setSelectedMarketplace] = useState('all');
  const [minCommission, setMinCommission] = useState<number>(0);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [onlyTrending, setOnlyTrending] = useState(false);
  const [onlyExtraCommission, setOnlyExtraCommission] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importUrlInput, setImportUrlInput] = useState('');
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<AffiliateProduct | null>(null);

  // New product form
  const [newProdName, setNewProdName] = useState('');
  const [newProdMarketplace, setNewProdMarketplace] = useState<'Mercado Livre' | 'Shopee' | 'TikTok Shop'>('Mercado Livre');
  const [newProdPrice, setNewProdPrice] = useState('199.90');
  const [newProdCommission, setNewProdCommission] = useState('12.0');
  const [newProdCategory, setNewProdCategory] = useState('Casa e Cozinha');
  const [newProdUrl, setNewProdUrl] = useState('');
  const [newProdAffiliateUrl, setNewProdAffiliateUrl] = useState('');

  const handleCopyLink = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLinkId(id);
    setTimeout(() => setCopiedLinkId(null), 2500);
  };

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  const hasActiveFilters = Boolean(
    searchTerm.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedMarketplace !== 'all' ||
    minCommission > 0 ||
    minRating > 0 ||
    onlyFavorites ||
    onlyTrending ||
    onlyExtraCommission
  );

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedMarketplace('all');
    setMinCommission(0);
    setMinRating(0);
    setOnlyFavorites(false);
    setOnlyTrending(false);
    setOnlyExtraCommission(false);
  };

  // Filtered products
  const filtered = products.filter(p => {
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      const matchName = p.name ? p.name.toLowerCase().includes(q) : false;
      const matchDesc = p.description ? p.description.toLowerCase().includes(q) : false;
      const matchCategory = p.category ? p.category.toLowerCase().includes(q) : false;
      if (!matchName && !matchDesc && !matchCategory) return false;
    }
    if (selectedCategory !== 'all' && p.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    if (selectedMarketplace !== 'all' && p.marketplace !== selectedMarketplace) return false;
    if (p.commissionPercent < minCommission) return false;
    if (p.rating < minRating) return false;
    if (onlyFavorites && !p.isFavorite) return false;
    if (onlyTrending && !p.isTrending) return false;
    if (onlyExtraCommission && !p.extraCommission) return false;
    return true;
  });

  // Sort by profitability (estimated earnings * smartScore)
  const sorted = [...filtered].sort((a, b) => {
    const profitA = a.estimatedEarnings * (a.smartScore || 80);
    const profitB = b.estimatedEarnings * (b.smartScore || 80);
    return profitB - profitA;
  });

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;
    onAddNewProduct({
      name: newProdName,
      marketplace: newProdMarketplace,
      price: parseFloat(newProdPrice),
      commissionPercent: parseFloat(newProdCommission),
      category: newProdCategory,
      productUrl: newProdUrl,
      affiliateUrl: newProdAffiliateUrl,
    });
    setShowAddModal(false);
    setNewProdName('');
  };

  const handleImportUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importUrlInput) return;
    onImportUrl(importUrlInput);
    setShowImportModal(false);
    setImportUrlInput('');
  };

  const getMarketplaceBadge = (marketplace: string) => {
    switch (marketplace) {
      case 'Mercado Livre':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-yellow-100 text-yellow-900 border border-yellow-300">Mercado Livre</span>;
      case 'Shopee':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-900 border border-orange-300">Shopee Afiliados</span>;
      case 'TikTok Shop':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-900 text-cyan-300 border border-cyan-500/30">TikTok Shop</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800">{marketplace}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Title and Import/Add Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-emerald-600" />
            <span>Central de Produtos de Afiliados</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pesquise, filtre e selecione produtos dos marketplaces oficiais com comissões calculadas em tempo real.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all"
          >
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>Importar por Link Oficial</span>
          </button>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Produto Manual</span>
          </button>
        </div>
      </div>

      {/* Comprehensive Filter Panel (Requirement 4) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        
        {/* Row 1: Search & Quick Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search by Name */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome ou especificação..."
              className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Marketplace Filter */}
          <div>
            <select
              value={selectedMarketplace}
              onChange={e => setSelectedMarketplace(e.target.value)}
              className="w-full py-2 px-3 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
            >
              <option value="all">Todos os Marketplaces</option>
              <option value="Mercado Livre">Mercado Livre Afiliados</option>
              <option value="Shopee">Shopee Afiliados</option>
              <option value="TikTok Shop">TikTok Shop Afiliados</option>
            </select>
          </div>

          {/* Minimum Commission Slider */}
          <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <div className="flex-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                <span>Comissão Mínima:</span>
                <span className="text-emerald-700 font-bold">{minCommission}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={minCommission}
                onChange={e => setMinCommission(Number(e.target.value))}
                className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

        </div>

        {/* Row 2: Badges & Toggles (Extra commission, Trending, Favorites, Rating) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          
          <div className="flex flex-wrap items-center gap-2">
            
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                onlyFavorites
                  ? 'bg-rose-50 border-rose-300 text-rose-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              <span>Apenas Favoritos</span>
            </button>

            <button
              onClick={() => setOnlyTrending(!onlyTrending)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                onlyTrending
                  ? 'bg-amber-50 border-amber-300 text-amber-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
              <span>Em Alta / Tendência</span>
            </button>

            <button
              onClick={() => setOnlyExtraCommission(!onlyExtraCommission)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                onlyExtraCommission
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Comissão Extra Ativa</span>
            </button>

          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition-colors"
                title="Limpar todos os filtros aplicados"
              >
                <X className="w-3.5 h-3.5 text-emerald-600" />
                <span>Limpar Filtros</span>
              </button>
            )}
            <span>
              Exibindo <strong className="text-slate-900 font-bold">{sorted.length}</strong> de <strong className="text-slate-900 font-bold">{products.length}</strong> produtos
            </span>
          </div>

        </div>

      </div>

      {/* Loading State Banner */}
      {isLoading && (
        <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
          <div className="inline-flex p-3 rounded-full bg-emerald-50 text-emerald-600">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Carregando catálogo oficial de produtos...</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Sincronizando produtos, comissões percentuais e cálculo de Score de oportunidade.
          </p>
        </div>
      )}

      {/* Error State Banner */}
      {error && !isLoading && (
        <div className="p-6 bg-rose-50 rounded-2xl border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-rose-900">Falha ao sincronizar catálogo</h3>
              <p className="text-xs text-rose-700 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRefreshProducts}
            className="flex items-center space-x-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tentar Novamente</span>
          </button>
        </div>
      )}

      {/* Empty Catalog State */}
      {!isLoading && !error && products.length === 0 && (
        <div className="p-8 bg-white rounded-2xl border border-dashed border-slate-300 text-center space-y-4">
          <div className="inline-flex p-3 rounded-full bg-amber-50 text-amber-600">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Catálogo de Produtos Vazio</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Nenhum produto de afiliado foi encontrado no banco de dados. Adicione sua primeira oferta ou importe via link oficial.
            </p>
          </div>
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={onRefreshProducts}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Atualizar Catálogo</span>
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Importar por Link Oficial</span>
            </button>
          </div>
        </div>
      )}

      {/* Filtered Out State (Products exist but none match filters) */}
      {!isLoading && !error && products.length > 0 && sorted.length === 0 && (
        <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
          <div className="inline-flex p-3 rounded-full bg-slate-100 text-slate-500">
            <Filter className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Nenhum produto corresponde aos filtros</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Existem <strong>{products.length}</strong> produtos cadastrados no catálogo, mas nenhum atendeu à combinação de filtros selecionada.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
          >
            <X className="w-4 h-4" />
            <span>Limpar Filtros e Ver Todos ({products.length})</span>
          </button>
        </div>
      )}

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {sorted.map(product => {
          const discountPercent = product.originalPrice 
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
            : null;

          return (
            <div
              key={product.id}
              className={`group rounded-2xl border transition-all hover:shadow-lg flex flex-col justify-between overflow-hidden ${
                highContrast
                  ? 'bg-black text-white border-yellow-400'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div>
                
                {/* Image and Badges Container */}
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                    {getMarketplaceBadge(product.marketplace)}
                    {discountPercent && discountPercent > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-xs">
                        -{discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => onToggleFavorite(product.id, !product.isFavorite)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md transition-transform active:scale-90"
                    title={product.isFavorite ? 'Remover dos favoritos' : 'Favoritar produto'}
                  >
                    <Heart className={`w-4 h-4 ${product.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                  </button>

                  {/* Commission Rate Overlay Ribbon */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 to-transparent p-2 pt-6 flex items-center justify-between text-white text-xs">
                    <span className="font-extrabold text-emerald-400 flex items-center space-x-1">
                      <span>{product.commissionPercent}% comissão</span>
                    </span>
                    <span className="font-bold text-slate-200 bg-slate-900/60 px-2 py-0.5 rounded text-[11px]">
                      Ganho: R$ {product.estimatedEarnings.toFixed(2)}
                    </span>
                  </div>

                </div>

                {/* Content Details */}
                <div className="p-4 space-y-2.5">
                  
                  {/* Category and Rating */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold uppercase tracking-wider text-slate-400">{product.category}</span>
                    <div className="flex items-center space-x-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">({product.reviewCount})</span>
                    </div>
                  </div>

                  {/* Product Name */}
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors" title={product.name}>
                    {product.name}
                  </h3>

                  {/* Pricing Breakdown */}
                  <div className="pt-1 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-400 line-through mr-1.5">
                          R$ {product.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-lg font-black text-slate-900">
                        R$ {product.price.toFixed(2)}
                      </span>
                    </div>
                    
                    {product.smartScore && (
                      <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800" title="Score de oportunidade estimado pela IA">
                        Score {product.smartScore}
                      </div>
                    )}
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                </div>

              </div>

              {/* Action Buttons Footer */}
              <div className="p-4 pt-0 space-y-2">
                
                {/* Primary: Iniciar Campanha com este produto */}
                <button
                  onClick={() => onSelectForCampaign(product)}
                  className="w-full flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all transform active:scale-98"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Criar Campanha Imediata</span>
                </button>

                {/* Secondary Actions: Copy Affiliate Link & Details */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopyLink(product.affiliateUrl, product.id)}
                    className="flex-1 flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
                    title="Copiar link oficial com tag de afiliado"
                  >
                    {copiedLinkId === product.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Link Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copiar Link Afiliado</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedDetailProduct(product)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                    title="Ver ficha completa do produto"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-[10px] text-slate-400 text-center">
                  Atualizado em: {new Date(product.lastUpdated).toLocaleDateString('pt-BR')}
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Modal: Product Details & Specs */}
      {selectedDetailProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase">Ficha Técnica Oficial</span>
                <h2 className="text-xl font-black text-slate-900 mt-1">{selectedDetailProduct.name}</h2>
              </div>
              <button
                onClick={() => setSelectedDetailProduct(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <img
                src={selectedDetailProduct.imageUrl}
                alt={selectedDetailProduct.name}
                className="w-full aspect-square object-cover rounded-xl border border-slate-200"
              />
              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Marketplace de Origem:</span>
                    <span className="text-emerald-700">{selectedDetailProduct.marketplace}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Preço Atual:</span>
                    <span className="text-slate-900 font-black">R$ {selectedDetailProduct.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Comissão por Venda:</span>
                    <span className="text-emerald-700 font-black">{selectedDetailProduct.commissionPercent}% (R$ {selectedDetailProduct.estimatedEarnings.toFixed(2)})</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Avaliação:</span>
                    <span>{selectedDetailProduct.rating} / 5.0 ({selectedDetailProduct.reviewCount} avaliações)</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Vendas Registradas:</span>
                    <span>{selectedDetailProduct.salesCount.toLocaleString('pt-BR')} unidades</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-1">Descrição Comercial:</h4>
                  <p className="leading-relaxed">{selectedDetailProduct.description}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800">Link de Afiliado Verificado:</h4>
                  <div className="p-2 bg-slate-100 rounded-lg font-mono text-[11px] truncate text-slate-700">
                    {selectedDetailProduct.affiliateUrl}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end space-x-3">
              <button
                onClick={() => setSelectedDetailProduct(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  const p = selectedDetailProduct;
                  setSelectedDetailProduct(null);
                  onSelectForCampaign(p);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Criar Campanha com Este Produto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Import Product by URL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleImportUrlSubmit} className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-emerald-600" />
                <span>Importar Produto via Link Oficial</span>
              </h3>
              <button type="button" onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Cole o link oficial ou link de afiliado do Mercado Livre, Shopee ou TikTok Shop. O sistema extrairá dados reais, preço oficial e taxa de comissão sem distorcer informações.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">URL do Produto / Oferta:</label>
              <input
                type="url"
                required
                value={importUrlInput}
                onChange={e => setImportUrlInput(e.target.value)}
                placeholder="https://www.mercadolivre.com.br/... ou https://shopee.com.br/..."
                className="w-full p-2.5 text-xs font-medium border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
              >
                Consultar e Importar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add Product Manually */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateProductSubmit} className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-900">Cadastrar Produto de Afiliado</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome Completo do Produto:</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  placeholder="Ex: Fritadeira Digital 5.5L Inox..."
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marketplace:</label>
                  <select
                    value={newProdMarketplace}
                    onChange={e => setNewProdMarketplace(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  >
                    <option value="Mercado Livre">Mercado Livre</option>
                    <option value="Shopee">Shopee</option>
                    <option value="TikTok Shop">TikTok Shop</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoria:</label>
                  <input
                    type="text"
                    value={newProdCategory}
                    onChange={e => setNewProdCategory(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preço Atual (R$):</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProdPrice}
                    onChange={e => setNewProdPrice(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Comissão (%):</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newProdCommission}
                    onChange={e => setNewProdCommission(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Link de Afiliado com Tag:</label>
                <input
                  type="url"
                  value={newProdAffiliateUrl}
                  onChange={e => setNewProdAffiliateUrl(e.target.value)}
                  placeholder="https://mercadolivre.com/sec/..."
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
              >
                Salvar Produto
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
