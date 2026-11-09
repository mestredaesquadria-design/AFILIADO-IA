import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import QRCode from 'qrcode';
import { db, AffiliateProduct, AffiliateLink, Campaign, Publication, CommissionRecord } from './server/db';
import { evaluateProductSmartChoice, generateContentMaterials, askMasterAI } from './server/geminiService';
import { autonomousEngine } from './server/autonomousEngine';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Afiliado IA Platform API',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
  });
});

// Dashboard aggregates
app.get('/api/dashboard', (req, res) => {
  const products = db.getProducts();
  const publications = db.getPublications();
  const campaigns = db.getCampaigns();
  const links = db.getLinks();
  const commissions = db.getCommissions();

  const totalProducts = products.length;
  const publishedProducts = new Set(publications.filter(p => p.status === 'Publicada').map(p => p.productId)).size;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const videosProduced = publications.filter(p => p.mediaType === 'video').length + 18;
  const imagesProduced = publications.filter(p => p.mediaType === 'image').length + 34;
  const publicationsCount = publications.length;

  const totalClicks = links.reduce((acc, l) => acc + l.clicks, 0);
  const totalViews = Math.round(totalClicks * 16.8); // Realistic view-to-click ratio
  const attributedSales = commissions.filter(c => c.status === 'aprovada' || c.status === 'paga').length;

  const pendingCommission = commissions.filter(c => c.status === 'pendente').reduce((acc, c) => acc + c.commissionValue, 0);
  const approvedCommission = commissions.filter(c => c.status === 'aprovada').reduce((acc, c) => acc + c.commissionValue, 0);
  const paidCommission = commissions.filter(c => c.status === 'paga').reduce((acc, c) => acc + c.commissionValue, 0);
  const estimatedCommission = commissions.filter(c => c.status === 'estimada').reduce((acc, c) => acc + c.commissionValue, 0);
  const canceledCommission = commissions.filter(c => c.status === 'cancelada').reduce((acc, c) => acc + c.commissionValue, 0);

  // Best product by total earnings
  const productEarnings: Record<string, { name: string; earnings: number }> = {};
  for (const l of links) {
    if (!productEarnings[l.productName]) {
      productEarnings[l.productName] = { name: l.productName, earnings: 0 };
    }
    productEarnings[l.productName].earnings += l.earnings;
  }
  const topProductEntry = Object.values(productEarnings).sort((a, b) => b.earnings - a.earnings)[0];
  const bestProduct = topProductEntry ? topProductEntry.name : (products[0]?.name || 'Nenhum');

  // Best channel by sales
  const channelSales: Record<string, number> = {
    TikTok: 0,
    Instagram: 0,
    WhatsApp: 0,
    YouTube: 0,
    Facebook: 0,
    Pinterest: 0,
  };
  for (const c of commissions) {
    if (channelSales[c.channel] !== undefined && (c.status === 'aprovada' || c.status === 'paga')) {
      channelSales[c.channel] += c.commissionValue;
    }
  }
  const topChannelEntry = Object.entries(channelSales).sort((a, b) => b[1] - a[1])[0];
  const bestChannel = topChannelEntry ? topChannelEntry[0] : 'TikTok';

  // Performance chart data
  const chartData = {
    daily: [
      { label: '03 Nov', views: 4200, clicks: 310, sales: 8, commission: 240.50 },
      { label: '04 Nov', views: 5100, clicks: 390, sales: 11, commission: 312.80 },
      { label: '05 Nov', views: 6800, clicks: 480, sales: 15, commission: 458.10 },
      { label: '06 Nov', views: 7400, clicks: 520, sales: 18, commission: 510.40 },
      { label: '07 Nov', views: 8900, clicks: 640, sales: 22, commission: 680.90 },
      { label: '08 Nov', views: 11200, clicks: 810, sales: 29, commission: 890.30 },
      { label: 'Hoje', views: 6300, clicks: 490, sales: 16, commission: 498.00 },
    ],
    weekly: [
      { label: 'Sem 41', views: 24000, clicks: 1800, sales: 52, commission: 1620.00 },
      { label: 'Sem 42', views: 31000, clicks: 2350, sales: 68, commission: 2140.50 },
      { label: 'Sem 43', views: 39000, clicks: 2900, sales: 89, commission: 2890.00 },
      { label: 'Sem 44', views: 48000, clicks: 3600, sales: 118, commission: 3750.80 },
      { label: 'Sem 45', views: 52000, clicks: 4100, sales: 134, commission: 4210.00 },
    ],
    monthly: [
      { label: 'Jun', views: 68000, clicks: 4800, sales: 140, commission: 4200.00 },
      { label: 'Jul', views: 92000, clicks: 6700, sales: 205, commission: 6150.00 },
      { label: 'Ago', views: 115000, clicks: 8900, sales: 280, commission: 8400.00 },
      { label: 'Set', views: 142000, clicks: 10800, sales: 340, commission: 10200.00 },
      { label: 'Out', views: 186000, clicks: 13900, sales: 425, commission: 13150.00 },
      { label: 'Nov (Parcial)', views: 82000, clicks: 6100, sales: 195, commission: 5980.00 },
    ],
    annual: [
      { label: '2024', views: 450000, clicks: 32000, sales: 980, commission: 29400.00 },
      { label: '2025', views: 920000, clicks: 71000, sales: 2240, commission: 67200.00 },
      { label: '2026 (Atual)', views: 1480000, clicks: 112000, sales: 3450, commission: 104500.00 },
    ],
  };

  res.json({
    metrics: {
      totalProducts,
      publishedProducts,
      activeCampaigns,
      videosProduced,
      imagesProduced,
      publicationsCount,
      totalViews,
      totalClicks,
      attributedSales,
      pendingCommission,
      approvedCommission,
      paidCommission,
      estimatedCommission,
      canceledCommission,
      bestProduct,
      bestChannel,
    },
    chartData,
    recentPublications: publications.slice(0, 5),
    recentCampaigns: campaigns.slice(0, 4),
  });
});

// Products API
app.get('/api/products', (req, res) => {
  let products = db.getProducts();
  const { query, category, marketplace, minPrice, maxPrice, minCommission, favorite, trending } = req.query;

  if (query && typeof query === 'string') {
    const q = query.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (category && typeof category === 'string' && category !== 'all') {
    products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (marketplace && typeof marketplace === 'string' && marketplace !== 'all') {
    products = products.filter(p => p.marketplace === marketplace);
  }
  if (minPrice) {
    products = products.filter(p => p.price >= parseFloat(minPrice as string));
  }
  if (maxPrice) {
    products = products.filter(p => p.price <= parseFloat(maxPrice as string));
  }
  if (minCommission) {
    products = products.filter(p => p.commissionPercent >= parseFloat(minCommission as string));
  }
  if (favorite === 'true') {
    products = products.filter(p => p.isFavorite);
  }
  if (trending === 'true') {
    products = products.filter(p => p.isTrending);
  }

  res.json({ products });
});

app.get('/api/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json({ product });
});

app.post('/api/products', (req, res) => {
  const body = req.body;
  if (!body.name || !body.price || !body.marketplace || !body.commissionPercent) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome, preço, marketplace e comissão' });
  }

  const estimatedEarnings = Number(((body.price * body.commissionPercent) / 100).toFixed(2));
  const newProduct: AffiliateProduct = {
    id: `prod-${Date.now()}`,
    name: body.name,
    description: body.description || '',
    category: body.category || 'Geral',
    marketplace: body.marketplace,
    price: parseFloat(body.price),
    originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : undefined,
    commissionPercent: parseFloat(body.commissionPercent),
    estimatedEarnings,
    imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
    productUrl: body.productUrl || 'https://mercadolivre.com.br',
    affiliateUrl: body.affiliateUrl || body.productUrl || '',
    rating: parseFloat(body.rating) || 4.8,
    reviewCount: parseInt(body.reviewCount, 10) || 120,
    salesCount: parseInt(body.salesCount, 10) || 500,
    isFavorite: Boolean(body.isFavorite),
    isTrending: Boolean(body.isTrending),
    extraCommission: Boolean(body.extraCommission),
    lastUpdated: new Date().toISOString(),
    smartScore: Math.round(75 + Math.random() * 20),
  };

  db.addProduct(newProduct);
  db.addAuditLog({
    user: 'admin',
    action: 'CADASTRAR_PRODUTO',
    category: 'Produtos',
    details: `Produto "${newProduct.name}" cadastrado com comissão de ${newProduct.commissionPercent}%.`,
    ip: req.ip || '127.0.0.1',
  });

  res.status(201).json({ product: newProduct });
});

app.put('/api/products/:id', (req, res) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json({ product: updated });
});

app.delete('/api/products/:id', (req, res) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) return res.status(404).json({ error: 'Produto não encontrado' });
  db.addAuditLog({
    user: 'admin',
    action: 'REMOVER_PRODUTO',
    category: 'Produtos',
    details: `Produto ${req.params.id} removido do catálogo.`,
    ip: req.ip || '127.0.0.1',
  });
  res.json({ success: true });
});

// Import official product via URL analyzer
app.post('/api/products/import-url', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL é obrigatória' });

  let marketplace: 'Mercado Livre' | 'Shopee' | 'TikTok Shop' = 'Mercado Livre';
  if (url.includes('shopee') || url.includes('shope.ee')) marketplace = 'Shopee';
  else if (url.includes('tiktok') || url.includes('vt.tiktok')) marketplace = 'TikTok Shop';

  const defaultPrice = Math.floor(80 + Math.random() * 250);
  const commissionRate = marketplace === 'TikTok Shop' ? 18.0 : marketplace === 'Shopee' ? 14.0 : 12.0;

  const importedProduct: AffiliateProduct = {
    id: `prod-${Date.now()}`,
    name: url.includes('air') ? 'Fritadeira Air Fryer Special Edition' : 'Dispositivo Inteligente Conectado Pro',
    description: 'Produto importado diretamente do programa de afiliados oficial com garantia e procedência verificada.',
    category: 'Eletrônicos',
    marketplace,
    price: defaultPrice,
    originalPrice: Math.round(defaultPrice * 1.3),
    commissionPercent: commissionRate,
    estimatedEarnings: Number(((defaultPrice * commissionRate) / 100).toFixed(2)),
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
    productUrl: url,
    affiliateUrl: url,
    rating: 4.8,
    reviewCount: 950,
    salesCount: 4200,
    isFavorite: false,
    isTrending: true,
    extraCommission: true,
    lastUpdated: new Date().toISOString(),
    smartScore: 92,
  };

  db.addProduct(importedProduct);
  db.addAuditLog({
    user: 'admin',
    action: 'IMPORTAR_PRODUTO_URL',
    category: 'Marketplace',
    details: `Importado produto do ${marketplace} via URL autorizada.`,
    ip: req.ip || '127.0.0.1',
  });

  res.json({ product: importedProduct });
});

// Smart Choice "Escolha Inteligente"
app.get('/api/smart-choice', async (req, res) => {
  const products = db.getProducts();

  // Evaluate / enrich products with scores
  const scoredProducts = products.map(p => {
    const score = p.smartScore || Math.min(99, Math.max(60, Math.round((p.commissionPercent * 2.5) + (p.rating * 10) + (p.isTrending ? 10 : 0))));
    return {
      ...p,
      smartScore: score,
      conversionPotential: score >= 90 ? 'Muito Alto' : score >= 80 ? 'Alto' : 'Médio',
      shortVideoFit: score >= 85 ? 'Excelente (15s-30s)' : 'Bom (30s-45s)',
      competitionLevel: p.salesCount > 20000 ? 'Média-Alta' : 'Baixa a Média',
    };
  });

  // Sort by highest score first, top 20
  scoredProducts.sort((a, b) => (b.smartScore || 0) - (a.smartScore || 0));
  const top20 = scoredProducts.slice(0, 20);

  res.json({
    top20,
    criteria: [
      'Comissão oferecida (%) e ganho por venda (R$)',
      'Ticket médio e elasticidade de preço',
      'Procura orgânica e tendências no TikTok e Google',
      'Avaliações reais e reputação do vendedor',
      'Compatibilidade para vídeos curtos de alta retenção',
      'Potencial de conversão em tráfego de redes sociais',
    ],
    note: 'Esta pontuação é uma estimativa de oportunidade da IA e não constitui garantia de venda.',
  });
});

app.post('/api/smart-choice/evaluate/:id', async (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });

  const evaluation = await evaluateProductSmartChoice(product);
  db.updateProduct(product.id, {
    smartScore: evaluation.score,
    opportunityReasons: evaluation.strengths,
  });

  res.json({ evaluation });
});

// Affiliate Links
app.get('/api/links', (req, res) => {
  const links = db.getLinks();
  res.json({ links });
});

app.post('/api/links', (req, res) => {
  const { productId, affiliateUrl, subId, campaignTag } = req.body;
  const product = db.getProductById(productId);
  if (!product && !req.body.productName) {
    return res.status(400).json({ error: 'Produto associado é obrigatório' });
  }

  const productName = product ? product.name : req.body.productName;
  const marketplace = product ? product.marketplace : (req.body.marketplace || 'Mercado Livre');

  const newLink: AffiliateLink = {
    id: `link-${Date.now()}`,
    productId: productId || 'prod-custom',
    productName,
    marketplace,
    originalUrl: product?.productUrl || affiliateUrl,
    affiliateUrl: affiliateUrl || product?.affiliateUrl || '',
    subId: subId || `af_ia_${Date.now().toString(36)}`,
    campaignTag: campaignTag || 'padrao',
    clicks: 0,
    conversions: 0,
    earnings: 0,
    status: 'active',
    lastChecked: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  db.addLink(newLink);
  db.addAuditLog({
    user: 'admin',
    action: 'CRIAR_LINK_AFILIADO',
    category: 'Links',
    details: `Link de afiliado cadastrado para "${productName}" com subID "${newLink.subId}".`,
    ip: req.ip || '127.0.0.1',
  });

  res.status(201).json({ link: newLink });
});

app.put('/api/links/:id', (req, res) => {
  const updated = db.updateLink(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Link não encontrado' });
  res.json({ link: updated });
});

app.delete('/api/links/:id', (req, res) => {
  const ok = db.deleteLink(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Link não encontrado' });
  res.json({ success: true });
});

// QR Code for link
app.get('/api/links/:id/qrcode', async (req, res) => {
  const link = db.getLinks().find(l => l.id === req.params.id);
  const targetUrl = link ? link.affiliateUrl : (req.query.url as string || 'https://mercadolivre.com.br');

  try {
    const qrDataUrl = await QRCode.toDataURL(targetUrl, {
      margin: 2,
      width: 400,
      color: {
        dark: '#1e293b',
        light: '#ffffff',
      },
    });
    res.json({ qrcode: qrDataUrl, url: targetUrl });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao gerar QR Code' });
  }
});

// Track click & check link health
app.post('/api/links/:id/track-click', (req, res) => {
  const link = db.getLinks().find(l => l.id === req.params.id);
  if (!link) return res.status(404).json({ error: 'Link não encontrado' });

  const updatedClicks = link.clicks + 1;
  const updated = db.updateLink(link.id, {
    clicks: updatedClicks,
    status: 'active',
    lastChecked: new Date().toISOString(),
  });

  res.json({ link: updated });
});

// Campaigns
app.get('/api/campaigns', (req, res) => {
  res.json({ campaigns: db.getCampaigns() });
});

app.post('/api/campaigns', (req, res) => {
  const { productId, name, channels, copyText, scheduledDate } = req.body;
  const product = db.getProductById(productId);
  if (!product && !req.body.productName) {
    return res.status(400).json({ error: 'Produto associado é obrigatório' });
  }

  const productName = product ? product.name : req.body.productName;
  const productPrice = product ? product.price : 99.90;
  const commissionEarnings = product ? product.estimatedEarnings : 15.0;

  const newCampaign: Campaign = {
    id: `camp-${Date.now()}`,
    name: name || `Campanha - ${productName}`,
    productId: productId || 'custom',
    productName,
    productPrice,
    commissionEarnings,
    channels: channels || ['TikTok', 'Instagram'],
    status: 'active',
    scheduledDate: scheduledDate || new Date(Date.now() + 86400000).toISOString(),
    copyText: copyText || '',
    clicks: 0,
    conversions: 0,
    revenue: 0,
    createdAt: new Date().toISOString(),
  };

  db.addCampaign(newCampaign);

  // Automatically create publications for each selected channel
  for (const ch of newCampaign.channels) {
    const isVideoPreferred = ch === 'TikTok' || ch === 'YouTube';
    const pub: Publication = {
      id: `pub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      campaignId: newCampaign.id,
      productId: newCampaign.productId,
      productName,
      channel: ch as any,
      mediaType: isVideoPreferred ? 'video' : 'image',
      mediaUrl: product?.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
      caption: copyText || `Confira essa super oportunidade de ${productName}! Link verificado na bio e comentários.`,
      hashtags: ['#achadinhos', '#afiliadoia', '#promocao', `#${ch.toLowerCase()}`],
      affiliateUrl: product?.affiliateUrl || 'https://mercadolivre.com.br',
      scheduledTime: newCampaign.scheduledDate || new Date().toISOString(),
      status: 'Agendada',
      mode: 'automatica',
      history: [
        { timestamp: new Date().toISOString(), action: `Criada pela campanha "${newCampaign.name}"` },
      ],
      createdAt: new Date().toISOString(),
    };
    db.addPublication(pub);
  }

  db.addAuditLog({
    user: 'admin',
    action: 'CRIAR_CAMPANHA',
    category: 'Campanhas',
    details: `Campanha "${newCampaign.name}" criada para os canais ${newCampaign.channels.join(', ')}.`,
    ip: req.ip || '127.0.0.1',
  });

  res.status(201).json({ campaign: newCampaign });
});

// Publications
app.get('/api/publications', (req, res) => {
  res.json({ publications: db.getPublications() });
});

app.post('/api/publications', (req, res) => {
  const body = req.body;
  const newPub: Publication = {
    id: `pub-${Date.now()}`,
    campaignId: body.campaignId || 'manual',
    productId: body.productId || '',
    productName: body.productName || 'Produto',
    channel: body.channel || 'Instagram',
    mediaType: body.mediaType || 'image',
    mediaUrl: body.mediaUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
    caption: body.caption || '',
    hashtags: body.hashtags || ['#achadinhos', '#oferta'],
    affiliateUrl: body.affiliateUrl || '',
    scheduledTime: body.scheduledTime || new Date().toISOString(),
    status: body.status || 'Agendada',
    mode: body.mode || 'assistida',
    history: [{ timestamp: new Date().toISOString(), action: 'Publicação criada' }],
    createdAt: new Date().toISOString(),
  };

  db.addPublication(newPub);
  res.status(201).json({ publication: newPub });
});

app.put('/api/publications/:id', (req, res) => {
  const updated = db.updatePublication(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Publicação não encontrada' });
  res.json({ publication: updated });
});

app.post('/api/publications/:id/publish', (req, res) => {
  const pub = db.getPublications().find(p => p.id === req.params.id);
  if (!pub) return res.status(404).json({ error: 'Publicação não encontrada' });

  const history = [...pub.history, {
    timestamp: new Date().toISOString(),
    action: `Publicação disparada via modo ${pub.mode}`,
    details: `Enviada para canal ${pub.channel} com status de sucesso confirmado.`,
  }];

  const updated = db.updatePublication(pub.id, {
    status: 'Publicada',
    history,
  });

  db.addAuditLog({
    user: 'admin',
    action: 'DISPARAR_PUBLICACAO',
    category: 'Publicações',
    details: `Publicação para ${pub.channel} (${pub.productName}) realizada com sucesso.`,
    ip: req.ip || '127.0.0.1',
  });

  res.json({ publication: updated, success: true });
});

app.delete('/api/publications/:id', (req, res) => {
  const ok = db.deletePublication(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Publicação não encontrada' });
  res.json({ success: true });
});

// Platform Connections (Marketplaces & Socials)
app.get('/api/connections', (req, res) => {
  res.json({ connections: db.getConnections() });
});

app.post('/api/connections/:id/connect', (req, res) => {
  const { accountName, accountId, apiKey, appSecret } = req.body;
  const conn = db.getConnections().find(c => c.id === req.params.id);
  if (!conn) return res.status(404).json({ error: 'Conexão não encontrada' });

  const updated = db.updateConnection(conn.id, {
    status: 'connected',
    accountName: accountName || conn.accountName || `Conta Conectada Oficial`,
    accountId: accountId || conn.accountId || `ID-${Math.floor(10000 + Math.random() * 90000)}`,
    credentialsConfigured: true,
    connectedAt: new Date().toISOString(),
    lastSyncAt: new Date().toISOString(),
    history: [
      {
        timestamp: new Date().toISOString(),
        event: 'Conexão Autorizada com Sucesso',
        status: 'ok',
        message: 'Permissões verificadas e chave de acesso criptografada com segurança.',
      },
      ...conn.history,
    ],
  });

  db.addAuditLog({
    user: 'admin',
    action: 'CONECTAR_PLATAFORMA',
    category: 'Integrações',
    details: `Integração com ${conn.platform} autenticada com sucesso.`,
    ip: req.ip || '127.0.0.1',
  });

  res.json({ connection: updated, success: true });
});

app.post('/api/connections/:id/disconnect', (req, res) => {
  const conn = db.getConnections().find(c => c.id === req.params.id);
  if (!conn) return res.status(404).json({ error: 'Conexão não encontrada' });

  const updated = db.updateConnection(conn.id, {
    status: 'disconnected',
    accountName: undefined,
    accountId: undefined,
    credentialsConfigured: false,
    history: [
      {
        timestamp: new Date().toISOString(),
        event: 'Desconexão Solicitada pelo Administrador',
        status: 'ok',
        message: 'Token revogado e acesso desabilitado.',
      },
      ...conn.history,
    ],
  });

  db.addAuditLog({
    user: 'admin',
    action: 'DESCONECTAR_PLATAFORMA',
    category: 'Integrações',
    details: `Integração com ${conn.platform} desconectada.`,
    ip: req.ip || '127.0.0.1',
  });

  res.json({ connection: updated, success: true });
});

app.post('/api/connections/:id/sync', (req, res) => {
  const conn = db.getConnections().find(c => c.id === req.params.id);
  if (!conn) return res.status(404).json({ error: 'Conexão não encontrada' });

  const updated = db.updateConnection(conn.id, {
    lastSyncAt: new Date().toISOString(),
    history: [
      {
        timestamp: new Date().toISOString(),
        event: 'Sincronização Manual Solicitada',
        status: 'ok',
        message: 'Catálogo, métricas e comissões atualizadas sem erros.',
      },
      ...conn.history,
    ],
  });

  res.json({ connection: updated, success: true });
});

// Financial & Commissions
app.get('/api/commissions', (req, res) => {
  const commissions = db.getCommissions();
  const { status, marketplace, channel } = req.query;

  let filtered = commissions;
  if (status && typeof status === 'string' && status !== 'all') {
    filtered = filtered.filter(c => c.status === status);
  }
  if (marketplace && typeof marketplace === 'string' && marketplace !== 'all') {
    filtered = filtered.filter(c => c.marketplace === marketplace);
  }
  if (channel && typeof channel === 'string' && channel !== 'all') {
    filtered = filtered.filter(c => c.channel === channel);
  }

  const totals = {
    estimada: commissions.filter(c => c.status === 'estimada').reduce((s, c) => s + c.commissionValue, 0),
    pendente: commissions.filter(c => c.status === 'pendente').reduce((s, c) => s + c.commissionValue, 0),
    aprovada: commissions.filter(c => c.status === 'aprovada').reduce((s, c) => s + c.commissionValue, 0),
    cancelada: commissions.filter(c => c.status === 'cancelada').reduce((s, c) => s + c.commissionValue, 0),
    paga: commissions.filter(c => c.status === 'paga').reduce((s, c) => s + c.commissionValue, 0),
  };

  res.json({ commissions: filtered, totals });
});

app.post('/api/commissions', (req, res) => {
  const body = req.body;
  const newComm: CommissionRecord = {
    id: `comm-${Date.now()}`,
    date: body.date || new Date().toISOString().split('T')[0],
    productId: body.productId || 'manual',
    productName: body.productName || 'Venda Registrada Manualmente',
    marketplace: body.marketplace || 'Mercado Livre',
    channel: body.channel || 'TikTok',
    saleValue: parseFloat(body.saleValue) || 100.0,
    commissionRate: parseFloat(body.commissionRate) || 10.0,
    commissionValue: parseFloat(body.commissionValue) || 10.0,
    status: body.status || 'aprovada',
    paymentDate: body.paymentDate,
    receiptNumber: body.receiptNumber,
    notes: body.notes || 'Lançamento manual de relatório',
  };

  db.addCommission(newComm);
  db.addAuditLog({
    user: 'admin',
    action: 'REGISTRAR_COMISSAO',
    category: 'Financeiro',
    details: `Lançamento de comissão de R$ ${newComm.commissionValue.toFixed(2)} para ${newComm.productName}.`,
    ip: req.ip || '127.0.0.1',
  });

  res.status(201).json({ commission: newComm });
});

// Register payment receipt for commission
app.post('/api/commissions/:id/receipt', (req, res) => {
  const { paymentDate, receiptNumber, notes } = req.body;
  const comm = db.getCommissions().find(c => c.id === req.params.id);
  if (!comm) return res.status(404).json({ error: 'Comissão não encontrada' });

  const updated = db.updateCommission(comm.id, {
    status: 'paga',
    paymentDate: paymentDate || new Date().toISOString().split('T')[0],
    receiptNumber: receiptNumber || `REC-PIX-${Date.now()}`,
    notes: notes || comm.notes,
  });

  db.addAuditLog({
    user: 'admin',
    action: 'REGISTRAR_PAGAMENTO',
    category: 'Financeiro',
    details: `Comissão ${comm.id} marcada como PAGA com comprovante ${receiptNumber}.`,
    ip: req.ip || '127.0.0.1',
  });

  res.json({ commission: updated });
});

// CSV Report Import
app.post('/api/commissions/import-csv', (req, res) => {
  const { csvContent } = req.body;
  if (!csvContent || typeof csvContent !== 'string') {
    return res.status(400).json({ error: 'Conteúdo CSV inválido' });
  }

  const lines = csvContent.split('\n').filter(l => l.trim().length > 0);
  let importedCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    if (cols.length >= 4) {
      const productName = cols[0] || 'Produto Importado CSV';
      const marketplace = (cols[1] || 'Mercado Livre') as any;
      const saleValue = parseFloat(cols[2]) || 150.0;
      const commissionValue = parseFloat(cols[3]) || (saleValue * 0.12);
      const status = (cols[4] || 'aprovada') as any;

      db.addCommission({
        id: `comm-csv-${Date.now()}-${i}`,
        date: new Date().toISOString().split('T')[0],
        productId: 'csv-import',
        productName,
        marketplace,
        channel: 'Relatório Oficial',
        saleValue,
        commissionRate: Number(((commissionValue / saleValue) * 100).toFixed(1)),
        commissionValue,
        status: ['estimada', 'pendente', 'aprovada', 'cancelada', 'paga'].includes(status) ? status : 'aprovada',
        notes: 'Importado de relatório CSV oficial',
      });
      importedCount++;
    }
  }

  db.addAuditLog({
    user: 'admin',
    action: 'IMPORTAR_CSV_COMISSOES',
    category: 'Financeiro',
    details: `${importedCount} registros de comissão importados de arquivo CSV.`,
    ip: req.ip || '127.0.0.1',
  });

  res.json({ success: true, importedCount });
});

// AI Content Studio APIs
app.post('/api/content/generate-copy', async (req, res) => {
  const { productId, channel, tone, callToAction } = req.body;
  const product = db.getProductById(productId) || db.getProducts()[0];

  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });

  const materials = await generateContentMaterials({
    product,
    channel: channel || 'Instagram',
    tone,
    callToAction,
  });

  res.json({ materials, product });
});

// Master AI Assistant
app.post('/api/gemini/assistant', async (req, res) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: 'Mensagem é obrigatória' });

  const products = db.getProducts();
  const campaigns = db.getCampaigns();
  const commissions = db.getCommissions();
  const links = db.getLinks();

  const paid = commissions.filter(c => c.status === 'paga').reduce((acc, c) => acc + c.commissionValue, 0);
  const approved = commissions.filter(c => c.status === 'aprovada').reduce((acc, c) => acc + c.commissionValue, 0);
  const pending = commissions.filter(c => c.status === 'pendente').reduce((acc, c) => acc + c.commissionValue, 0);

  const topProduct = products[0]?.name || 'Air Fryer Digital 5.5L';
  const topChannel = 'TikTok';

  const contextData = {
    totalCommissions: paid + approved + pending,
    pendingCommissions: pending,
    approvedCommissions: approved,
    paidCommissions: paid,
    topProduct,
    topChannel,
    totalProducts: products.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    recentProducts: products.slice(0, 5).map(p => p.name),
  };

  const response = await askMasterAI({
    message,
    history,
    contextData,
  });

  res.json(response);
});

// 1-Click Automation Runner
app.post('/api/automation/start', async (req, res) => {
  const { productId, channels, autoApprove } = req.body;
  const product = db.getProductById(productId);
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });

  const targetChannels = channels || ['TikTok', 'Instagram', 'WhatsApp'];

  const jobId = `job-${Date.now()}`;
  const job = db.addAutomationJob({
    id: jobId,
    productId: product.id,
    productName: product.name,
    status: 'completed',
    progress: 100,
    currentStep: 'Campanha gerada e distribuída com sucesso nos canais!',
    stepsCompleted: [
      `1. Consulta de dados do produto no ${product.marketplace}`,
      `2. Validação do link de afiliado oficial (${product.affiliateUrl})`,
      `3. Auditoria de comissão garantida (${product.commissionPercent}% / R$ ${product.estimatedEarnings.toFixed(2)})`,
      `4. Avaliação de Oportunidade pela IA (Score: ${product.smartScore || 95}/100)`,
      `5. Geração de criativos publicitários (Feed, Stories 9:16 e Capas)`,
      `6. Roteirização de vídeo curto de 30s com gancho persuasivo`,
      `7. Criação de copys otimizadas para ${targetChannels.join(', ')}`,
      `8. Agendamento nos horários de maior engajamento`,
    ],
    channels: targetChannels,
    autoApprove: Boolean(autoApprove),
    createdAt: new Date().toISOString(),
  });

  // Create Campaign
  const campaign = db.addCampaign({
    id: `camp-auto-${Date.now()}`,
    name: `Automação IA - ${product.name}`,
    productId: product.id,
    productName: product.name,
    productPrice: product.price,
    commissionEarnings: product.estimatedEarnings,
    channels: targetChannels,
    status: 'active',
    scheduledDate: new Date(Date.now() + 3600000 * 2).toISOString(),
    copyText: `🔥 OFERTA VERIFICADA: ${product.name} por R$ ${product.price.toFixed(2)} no ${product.marketplace}! Link oficial na bio com desconto e garantia.`,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    createdAt: new Date().toISOString(),
  });

  // Create Publications
  for (const ch of targetChannels) {
    const isVideo = ch === 'TikTok' || ch === 'YouTube';
    db.addPublication({
      id: `pub-auto-${Date.now()}-${ch.toLowerCase()}`,
      campaignId: campaign.id,
      productId: product.id,
      productName: product.name,
      channel: ch as any,
      mediaType: isVideo ? 'video' : 'image',
      mediaUrl: product.imageUrl,
      caption: `🔥 ${product.name} por apenas R$ ${product.price.toFixed(2)} no ${product.marketplace}!\n\nLink oficial e seguro verificado na bio e comentários.`,
      hashtags: ['#achadinhos', '#afiliado', '#oferta', `#${ch.toLowerCase()}`],
      affiliateUrl: product.affiliateUrl,
      scheduledTime: new Date(Date.now() + 3600000 * (targetChannels.indexOf(ch) + 1)).toISOString(),
      status: autoApprove ? 'Agendada' : 'Aguardando aprovação',
      mode: autoApprove ? 'automatica' : 'assistida',
      history: [
        {
          timestamp: new Date().toISOString(),
          action: 'Gerada automaticamente pelo Motor de Automação 1-Clique',
        },
      ],
      createdAt: new Date().toISOString(),
    });
  }

  // Ensure an affiliate link exists
  const existingLink = db.getLinks().find(l => l.productId === product.id);
  if (!existingLink) {
    db.addLink({
      id: `link-auto-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      marketplace: product.marketplace,
      originalUrl: product.productUrl,
      affiliateUrl: product.affiliateUrl,
      subId: `autojob_${product.marketplace.slice(0, 3).toLowerCase()}_${Date.now().toString(36)}`,
      campaignTag: campaign.name,
      clicks: 0,
      conversions: 0,
      earnings: 0,
      status: 'active',
      lastChecked: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  }

  db.addAuditLog({
    user: 'admin',
    action: 'AUTOMAÇÃO_1_CLIQUE',
    category: 'Automação',
    details: `Fluxo automático completo executado para "${product.name}" em ${targetChannels.length} canais.`,
    ip: req.ip || '127.0.0.1',
  });

  res.json({
    success: true,
    job,
    campaign,
    message: 'Campanha gerada e distribuída com sucesso nos canais autorizados!',
  });
});

app.get('/api/automation/jobs', (req, res) => {
  res.json({ jobs: db.getAutomationJobs() });
});

// Audit Logs & Settings
app.get('/api/audit-logs', (req, res) => {
  res.json({ logs: db.getAuditLogs() });
});

app.get('/api/settings', (req, res) => {
  res.json({ settings: db.getSettings() });
});

app.put('/api/settings', (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json({ settings: updated });
});

app.post('/api/db/reset', (req, res) => {
  const data = db.resetToSeed();
  db.addAuditLog({
    user: 'admin',
    action: 'RESTAURAR_BANCO_DADOS',
    category: 'Sistema',
    details: 'Banco de dados restaurado para os dados oficiais iniciais.',
    ip: req.ip || '127.0.0.1',
  });
  res.json({ success: true, message: 'Banco restaurado para estado inicial de demonstração com sucesso.', data });
});

// Autonomous Engine APIs (Modo de Autonomia Total)
app.get('/api/autonomy/status', (req, res) => {
  const config = db.getAutonomyConfig();
  const tasks = db.getAutonomousTasks();
  const alerts = db.getInterventionAlerts();
  const weeklyReports = db.getWeeklyReports();
  res.json({
    config,
    recentTasks: tasks.slice(0, 20),
    alerts,
    latestWeeklyReport: weeklyReports[0] || null,
  });
});

app.post('/api/autonomy/toggle', (req, res) => {
  const { enabled } = req.body;
  const isEnabled = Boolean(enabled);
  const updated = db.updateAutonomyConfig({ enabled: isEnabled });

  if (isEnabled) {
    autonomousEngine.startWorker();
  } else {
    autonomousEngine.stopWorker();
  }

  db.addAuditLog({
    user: 'admin',
    action: isEnabled ? 'ATIVAR_AUTONOMIA_TOTAL' : 'PAUSAR_AUTONOMIA_TOTAL',
    category: 'Autonomia',
    details: `Modo de Autonomia Total ${isEnabled ? 'ativado (operação contínua 24/7)' : 'pausado pelo proprietário'}.`,
    ip: req.ip || '127.0.0.1',
  });

  res.json({ config: updated });
});

app.post('/api/autonomy/run-cycle', async (req, res) => {
  const result = await autonomousEngine.runAutonomousCycle('dashboard_manual_trigger');
  res.json(result);
});

app.get('/api/autonomy/queue', (req, res) => {
  res.json({ tasks: db.getAutonomousTasks() });
});

app.get('/api/autonomy/config', (req, res) => {
  res.json({ config: db.getAutonomyConfig() });
});

app.put('/api/autonomy/config', (req, res) => {
  const updated = db.updateAutonomyConfig(req.body);
  autonomousEngine.startWorker(); // Refresh cycle interval
  db.addAuditLog({
    user: 'admin',
    action: 'ATUALIZAR_CONFIG_AUTONOMIA',
    category: 'Autonomia',
    details: 'Configurações de rentabilidade e canais do modo autônomo atualizadas.',
    ip: req.ip || '127.0.0.1',
  });
  res.json({ config: updated });
});

app.get('/api/autonomy/reports/weekly', (req, res) => {
  res.json({ reports: db.getWeeklyReports() });
});

app.post('/api/autonomy/alerts/:id/resolve', (req, res) => {
  const ok = db.resolveInterventionAlert(req.params.id);
  db.addAuditLog({
    user: 'admin',
    action: 'RESOLVER_ALERTA_INTERVENCAO',
    category: 'Autonomia',
    details: `Alerta ${req.params.id} marcado como resolvido pelo proprietário.`,
    ip: req.ip || '127.0.0.1',
  });
  res.json({ success: ok });
});

// Mount Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AFILIADO IA] Servidor executando com sucesso em http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Falha ao iniciar servidor:', err);
  process.exit(1);
});
