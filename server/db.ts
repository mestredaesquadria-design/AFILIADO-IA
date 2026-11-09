import fs from 'fs';
import path from 'path';

export interface AffiliateProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  marketplace: 'Mercado Livre' | 'Shopee' | 'TikTok Shop';
  price: number;
  originalPrice?: number;
  commissionPercent: number;
  estimatedEarnings: number;
  imageUrl: string;
  galleryUrls?: string[];
  productUrl: string;
  affiliateUrl: string;
  rating: number;
  reviewCount: number;
  salesCount: number;
  isFavorite: boolean;
  isTrending: boolean;
  extraCommission: boolean;
  lastUpdated: string;
  smartScore?: number;
  opportunityReasons?: string[];
}

export interface AffiliateLink {
  id: string;
  productId: string;
  productName: string;
  marketplace: 'Mercado Livre' | 'Shopee' | 'TikTok Shop';
  originalUrl: string;
  affiliateUrl: string;
  subId: string;
  campaignTag: string;
  clicks: number;
  conversions: number;
  earnings: number;
  status: 'active' | 'warning' | 'expired';
  lastChecked: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  productId: string;
  productName: string;
  productPrice: number;
  commissionEarnings: number;
  channels: string[];
  status: 'draft' | 'active' | 'paused' | 'completed';
  scheduledDate?: string;
  generatedImageId?: string;
  generatedVideoId?: string;
  copyText?: string;
  clicks: number;
  conversions: number;
  revenue: number;
  createdAt: string;
}

export interface Publication {
  id: string;
  campaignId: string;
  productId: string;
  productName: string;
  channel: 'TikTok' | 'Instagram' | 'Facebook' | 'YouTube' | 'Pinterest' | 'WhatsApp';
  mediaType: 'image' | 'video' | 'carousel';
  mediaUrl: string;
  caption: string;
  hashtags: string[];
  affiliateUrl: string;
  scheduledTime: string;
  status: 'Em preparação' | 'Aguardando aprovação' | 'Agendada' | 'Publicada' | 'Falhou' | 'Cancelada';
  mode: 'automatica' | 'assistida' | 'manual';
  history: { timestamp: string; action: string; details?: string }[];
  errorMessage?: string;
  createdAt: string;
}

export interface PlatformConnection {
  id: string;
  type: 'marketplace' | 'social';
  platform: 'Mercado Livre' | 'Shopee' | 'TikTok Shop' | 'TikTok' | 'Instagram' | 'Facebook' | 'YouTube' | 'Pinterest' | 'WhatsApp';
  accountName?: string;
  accountId?: string;
  avatarUrl?: string;
  status: 'connected' | 'disconnected' | 'pending' | 'error';
  permissions: {
    readProducts: boolean;
    publishContent: boolean;
    readCommissions: boolean;
    readMetrics: boolean;
  };
  connectedAt?: string;
  lastSyncAt?: string;
  history: { timestamp: string; event: string; status: 'ok' | 'error'; message: string }[];
  credentialsConfigured: boolean;
  errorDetails?: string;
}

export interface CommissionRecord {
  id: string;
  date: string;
  productId: string;
  productName: string;
  marketplace: 'Mercado Livre' | 'Shopee' | 'TikTok Shop';
  channel: string;
  saleValue: number;
  commissionRate: number;
  commissionValue: number;
  status: 'estimada' | 'pendente' | 'aprovada' | 'cancelada' | 'paga';
  paymentDate?: string;
  receiptNumber?: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: string;
  details: string;
  ip: string;
}

export interface AutomationJob {
  id: string;
  productId: string;
  productName: string;
  status: 'processing' | 'completed' | 'failed' | 'paused';
  progress: number;
  currentStep: string;
  stepsCompleted: string[];
  channels: string[];
  autoApprove: boolean;
  createdAt: string;
}

export interface AutonomyConfig {
  enabled: boolean;
  scanIntervalMinutes: number;
  minCommissionPercent: number;
  minRating: number;
  maxDailyPostsPerChannel: number;
  autoReplaceUnderperforming: boolean;
  underperformingDaysThreshold: number;
  autoPublishEnabled: boolean;
  allowedChannels: string[];
  targetCategories: string[];
  lastCycleRun?: string;
  nextCycleRun?: string;
  totalCyclesExecuted: number;
  autonomousActionsToday: number;
  totalUnderperformingReplaced: number;
}

export interface AutonomousTask {
  id: string;
  type: 'scan_products' | 'verify_links' | 'create_creatives' | 'schedule_post' | 'auto_publish' | 'monitor_performance' | 'recycle_winner' | 'generate_weekly_report';
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  priority: number;
  targetProduct?: string;
  targetChannel?: string;
  resultMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export interface InterventionAlert {
  id: string;
  type: 'token_expired' | 'link_broken' | 'commission_changed' | 'payment_ready' | 'policy_update';
  title: string;
  message: string;
  platform: string;
  severity: 'critical' | 'warning' | 'info';
  actionLabel: string;
  actionType: string;
  resolved: boolean;
  createdAt: string;
}

export interface WeeklyExecutiveReport {
  id: string;
  weekNumber: number;
  year: number;
  period: string;
  executiveSummary: string;
  totalRevenue: number;
  totalSales: number;
  topConvertingProduct: string;
  topConvertingChannel: string;
  autonomousActionsExecuted: number;
  underperformingReplacedCount: number;
  linksVerifiedCount: number;
  ownerActionRequiredCount: number;
  nextWeekStrategy: string[];
  createdAt: string;
}

export interface DatabaseSchema {
  products: AffiliateProduct[];
  links: AffiliateLink[];
  campaigns: Campaign[];
  publications: Publication[];
  connections: PlatformConnection[];
  commissions: CommissionRecord[];
  automationJobs: AutomationJob[];
  autonomousTasks: AutonomousTask[];
  interventionAlerts: InterventionAlert[];
  weeklyReports: WeeklyExecutiveReport[];
  autonomyConfig: AutonomyConfig;
  auditLogs: AuditLog[];
  settings: {
    dailyPostLimitPerChannel: number;
    antiDuplicateProtection: boolean;
    autoCheckLinksIntervalHours: number;
    highContrastMode: boolean;
    fontSize: 'normal' | 'large' | 'xl';
  };
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');

function getSeedData(): DatabaseSchema {
  const now = new Date().toISOString();

  const products: AffiliateProduct[] = [
    {
      id: 'prod-1',
      name: 'Fritadeira Elétrica Air Fryer Digital 5.5L Inox',
      description: 'Fritadeira sem óleo com painel digital touch, 8 funções pré-programadas, cesto antiaderente removível e potência de 1900W.',
      category: 'Casa e Cozinha',
      marketplace: 'Mercado Livre',
      price: 389.90,
      originalPrice: 499.00,
      commissionPercent: 12.0,
      estimatedEarnings: 46.78,
      imageUrl: 'https://images.unsplash.com/photo-1585672840502-3860bb4a41eb?auto=format&fit=crop&w=800&q=80',
      productUrl: 'https://www.mercadolivre.com.br/air-fryer-digital-55l',
      affiliateUrl: 'https://mercadolivre.com/sec/afiliado_ia_airfryer_55l',
      rating: 4.8,
      reviewCount: 4210,
      salesCount: 18500,
      isFavorite: true,
      isTrending: true,
      extraCommission: true,
      lastUpdated: now,
      smartScore: 96,
      opportunityReasons: [
        'Comissão alta de 12% em ticket médio atrativo',
        'Produto com altíssima taxa de conversão em Reels e TikTok',
        'Preço com 22% de desconto oficial em vigor',
        'Avaliação 4.8 com mais de 4 mil opiniões verificadas'
      ]
    },
    {
      id: 'prod-2',
      name: 'Fone de Ouvido Sem Fio Bluetooth com Cancelamento de Ruído ANC',
      description: 'Fones TWS com cancelamento ativo de ruído inteligente, bateria para 36 horas, resistência a suor IPX5 e som espacial 3D.',
      category: 'Eletrônicos',
      marketplace: 'Shopee',
      price: 149.90,
      originalPrice: 229.00,
      commissionPercent: 14.5,
      estimatedEarnings: 21.73,
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      productUrl: 'https://shopee.com.br/fone-tws-bluetooth-anc',
      affiliateUrl: 'https://shope.ee/afiliado_ia_fone_anc_tws',
      rating: 4.9,
      reviewCount: 6890,
      salesCount: 34000,
      isFavorite: true,
      isTrending: true,
      extraCommission: true,
      lastUpdated: now,
      smartScore: 94,
      opportunityReasons: [
        'Comissão agressiva de 14.5% na Shopee Afiliados',
        'Viral constante no TikTok com vídeos demonstrativos de isolamento sonoro',
        'Preço acessível abaixo de R$ 150 com frete grátis nacional'
      ]
    },
    {
      id: 'prod-3',
      name: 'Smartwatch Esportivo AMOLED com Monitor Cardíaco e GPS Integrado',
      description: 'Relógio inteligente com tela AMOLED sempre ativa, mais de 100 modos esportivos, oxímetro SpO2, bateria de 14 dias.',
      category: 'Eletrônicos',
      marketplace: 'Shopee',
      price: 229.00,
      originalPrice: 349.90,
      commissionPercent: 11.0,
      estimatedEarnings: 25.19,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      productUrl: 'https://shopee.com.br/smartwatch-esportivo-amoled',
      affiliateUrl: 'https://shope.ee/afiliado_ia_smartwatch_amoled',
      rating: 4.7,
      reviewCount: 3120,
      salesCount: 12400,
      isFavorite: false,
      isTrending: true,
      extraCommission: false,
      lastUpdated: now,
      smartScore: 91,
      opportunityReasons: [
        'Design premium atraente para imagens e banners',
        'Forte apelo para público fitness e tecnologia',
        'Margem de comissão de R$ 25 por cada unidade vendida'
      ]
    },
    {
      id: 'prod-4',
      name: 'Mini Processador e Triturador Elétrico de Alimentos USB sem Fio',
      description: 'Triturador compacto de 3 lâminas de inox para alho, cebola, temperos e carnes. Bateria recarregável via USB.',
      category: 'Casa e Cozinha',
      marketplace: 'TikTok Shop',
      price: 49.90,
      originalPrice: 79.90,
      commissionPercent: 18.0,
      estimatedEarnings: 8.98,
      imageUrl: 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=800&q=80',
      productUrl: 'https://shop.tiktok.com/mini-processador-eletrico',
      affiliateUrl: 'https://vt.tiktok.com/afiliado_ia_triturador_mini',
      rating: 4.6,
      reviewCount: 9400,
      salesCount: 65000,
      isFavorite: true,
      isTrending: true,
      extraCommission: true,
      lastUpdated: now,
      smartScore: 95,
      opportunityReasons: [
        'Comissão de 18% no TikTok Shop Afiliados',
        'Produto clássico de compra por impulso com demonstração em 15 segundos',
        'Baixo preço de entrada (menos de R$ 50,00)'
      ]
    },
    {
      id: 'prod-5',
      name: 'Kit Câmera de Segurança Wi-Fi 360° com Visão Noturna Colorida',
      description: 'Câmera IP inteligente para uso interno ou externo, rastreamento automático de pessoas, áudio bidirecional e alarme sonoro.',
      category: 'Segurança',
      marketplace: 'Mercado Livre',
      price: 179.90,
      originalPrice: 249.00,
      commissionPercent: 10.5,
      estimatedEarnings: 18.89,
      imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
      productUrl: 'https://mercadolivre.com.br/camera-seguranca-wifi-360',
      affiliateUrl: 'https://mercadolivre.com/sec/afiliado_ia_camera_wifi360',
      rating: 4.7,
      reviewCount: 1870,
      salesCount: 8900,
      isFavorite: false,
      isTrending: false,
      extraCommission: false,
      lastUpdated: now,
      smartScore: 88,
      opportunityReasons: [
        'Alta dor do consumidor: segurança residencial acessível',
        'Excelente taxa de conversão em grupos de WhatsApp e Facebook'
      ]
    },
    {
      id: 'prod-6',
      name: 'Luminária de Mesa LED Articulada com Carregador por Indução',
      description: 'Luminária touch com 3 tons de luz, dimmer de brilho, base com carregador wireless de 15W para smartphones e relógio digital.',
      category: 'Casa e Cozinha',
      marketplace: 'Shopee',
      price: 129.90,
      originalPrice: 189.90,
      commissionPercent: 13.0,
      estimatedEarnings: 16.88,
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      productUrl: 'https://shopee.com.br/luminaria-led-carregador-inducao',
      affiliateUrl: 'https://shope.ee/afiliado_ia_luminaria_inducao',
      rating: 4.8,
      reviewCount: 1250,
      salesCount: 5400,
      isFavorite: false,
      isTrending: true,
      extraCommission: false,
      lastUpdated: now,
      smartScore: 89,
      opportunityReasons: [
        'Produto visualmente atraente para fotos de feed e Pinterest',
        'Público de home office e decoração moderna'
      ]
    },
    {
      id: 'prod-7',
      name: 'Aspirador de Pó Vertical 2 em 1 Sem Fio Bateria Lítio',
      description: 'Aspirador leve portátil e vertical com filtro HEPA lavável, sucção ciclônica de 14kPa e autonomia de até 45 minutos.',
      category: 'Casa e Cozinha',
      marketplace: 'Mercado Livre',
      price: 299.00,
      originalPrice: 420.00,
      commissionPercent: 11.5,
      estimatedEarnings: 34.38,
      imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
      productUrl: 'https://mercadolivre.com.br/aspirador-vertical-sem-fio',
      affiliateUrl: 'https://mercadolivre.com/sec/afiliado_ia_aspirador_2em1',
      rating: 4.7,
      reviewCount: 3400,
      salesCount: 15600,
      isFavorite: true,
      isTrending: true,
      extraCommission: true,
      lastUpdated: now,
      smartScore: 93,
      opportunityReasons: [
        'Excelente ganho de R$ 34,38 por venda',
        'Vídeos de limpeza e organização residencial têm engajamento orgânico massivo',
        'Entrega Full no Mercado Livre'
      ]
    },
    {
      id: 'prod-8',
      name: 'Kit Sérum Clareador Facial Vitamina C Pura + Ácido Hialurônico',
      description: 'Kit de cuidados com a pele anti-idade, combate manchas solares, linhas de expressão e melhora a firmeza e brilho natural.',
      category: 'Beleza & Saúde',
      marketplace: 'TikTok Shop',
      price: 89.90,
      originalPrice: 149.00,
      commissionPercent: 20.0,
      estimatedEarnings: 17.98,
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      productUrl: 'https://shop.tiktok.com/kit-serum-vitamina-c',
      affiliateUrl: 'https://vt.tiktok.com/afiliado_ia_serum_vitamina_c',
      rating: 4.9,
      reviewCount: 7800,
      salesCount: 42000,
      isFavorite: true,
      isTrending: true,
      extraCommission: true,
      lastUpdated: now,
      smartScore: 97,
      opportunityReasons: [
        'Comissão recorde de 20% no TikTok Shop',
        'Nicho de skincare com alta recompra e engajamento feminino',
        'Avaliação média impecável de 4.9 estrelas'
      ]
    }
  ];

  const links: AffiliateLink[] = [
    {
      id: 'link-1',
      productId: 'prod-1',
      productName: 'Fritadeira Elétrica Air Fryer Digital 5.5L Inox',
      marketplace: 'Mercado Livre',
      originalUrl: 'https://www.mercadolivre.com.br/air-fryer-digital-55l',
      affiliateUrl: 'https://mercadolivre.com/sec/afiliado_ia_airfryer_55l',
      subId: 'mla_airfry_camp1',
      campaignTag: 'camp-airfryer-tiktok',
      clicks: 1420,
      conversions: 62,
      earnings: 2900.36,
      status: 'active',
      lastChecked: now,
      createdAt: '2026-10-15T10:00:00Z'
    },
    {
      id: 'link-2',
      productId: 'prod-2',
      productName: 'Fone de Ouvido Sem Fio Bluetooth com Cancelamento de Ruído ANC',
      marketplace: 'Shopee',
      originalUrl: 'https://shopee.com.br/fone-tws-bluetooth-anc',
      affiliateUrl: 'https://shope.ee/afiliado_ia_fone_anc_tws',
      subId: 'shp_fone_reels',
      campaignTag: 'camp-fone-insta',
      clicks: 2840,
      conversions: 114,
      earnings: 2477.22,
      status: 'active',
      lastChecked: now,
      createdAt: '2026-10-20T14:30:00Z'
    },
    {
      id: 'link-3',
      productId: 'prod-4',
      productName: 'Mini Processador e Triturador Elétrico de Alimentos USB',
      marketplace: 'TikTok Shop',
      originalUrl: 'https://shop.tiktok.com/mini-processador-eletrico',
      affiliateUrl: 'https://vt.tiktok.com/afiliado_ia_triturador_mini',
      subId: 'tts_triturador_org',
      campaignTag: 'camp-triturador-tiktok',
      clicks: 3950,
      conversions: 186,
      earnings: 1670.28,
      status: 'active',
      lastChecked: now,
      createdAt: '2026-10-25T18:00:00Z'
    },
    {
      id: 'link-4',
      productId: 'prod-8',
      productName: 'Kit Sérum Clareador Facial Vitamina C Pura',
      marketplace: 'TikTok Shop',
      originalUrl: 'https://shop.tiktok.com/kit-serum-vitamina-c',
      affiliateUrl: 'https://vt.tiktok.com/afiliado_ia_serum_vitamina_c',
      subId: 'tts_serum_vitc',
      campaignTag: 'camp-skincare-nov',
      clicks: 1890,
      conversions: 84,
      earnings: 1510.32,
      status: 'active',
      lastChecked: now,
      createdAt: '2026-11-01T09:00:00Z'
    }
  ];

  const campaigns: Campaign[] = [
    {
      id: 'camp-1',
      name: 'Black Friday Antecipada: Air Fryer 5.5L Digital',
      productId: 'prod-1',
      productName: 'Fritadeira Elétrica Air Fryer Digital 5.5L Inox',
      productPrice: 389.90,
      commissionEarnings: 46.78,
      channels: ['Instagram', 'TikTok', 'WhatsApp'],
      status: 'active',
      scheduledDate: '2026-11-10T19:00:00Z',
      copyText: 'Descobri a Air Fryer com o melhor custo-benefício de 2026! Cesto de 5.5L, painel digital e com 22% de desconto oficial no link oficial de afiliado.',
      clicks: 1420,
      conversions: 62,
      revenue: 2900.36,
      createdAt: '2026-11-02T12:00:00Z'
    },
    {
      id: 'camp-2',
      name: 'Fone TWS com Cancelamento ANC - Lançamento',
      productId: 'prod-2',
      productName: 'Fone de Ouvido Sem Fio Bluetooth com Cancelamento de Ruído ANC',
      productPrice: 149.90,
      commissionEarnings: 21.73,
      channels: ['TikTok', 'YouTube', 'Instagram'],
      status: 'active',
      scheduledDate: '2026-11-11T12:30:00Z',
      copyText: 'Adeus barulho na rua! Esse fone isola o som com tecnologia ANC por menos de R$ 150. Link verificado na bio e nos comentários.',
      clicks: 2840,
      conversions: 114,
      revenue: 2477.22,
      createdAt: '2026-11-04T15:20:00Z'
    },
    {
      id: 'camp-3',
      name: 'Skincare Vitamina C Pura 20% Off',
      productId: 'prod-8',
      productName: 'Kit Sérum Clareador Facial Vitamina C Pura',
      productPrice: 89.90,
      commissionEarnings: 17.98,
      channels: ['TikTok', 'Pinterest', 'WhatsApp'],
      status: 'active',
      scheduledDate: '2026-11-12T18:00:00Z',
      copyText: 'Pele iluminada e sem manchas! O sérum mais bem avaliado do momento com 20% de comissão garantida pelo link de afiliado oficial.',
      clicks: 1890,
      conversions: 84,
      revenue: 1510.32,
      createdAt: '2026-11-06T11:10:00Z'
    }
  ];

  const publications: Publication[] = [
    {
      id: 'pub-1',
      campaignId: 'camp-1',
      productId: 'prod-1',
      productName: 'Fritadeira Elétrica Air Fryer Digital 5.5L Inox',
      channel: 'TikTok',
      mediaType: 'video',
      mediaUrl: 'https://images.unsplash.com/photo-1585672840502-3860bb4a41eb?auto=format&fit=crop&w=800&q=80',
      caption: 'Testei a Air Fryer mais potente de 5.5L! O resultado com batata frita e frango crocante sem 1 gota de óleo. Link com desconto especial na bio! #airfryer #cozinha #achadinhos #oferta #afiliado',
      hashtags: ['#airfryer', '#achadinhos', '#cozinhafacil', '#promocao', '#mercadolivre'],
      affiliateUrl: 'https://mercadolivre.com/sec/afiliado_ia_airfryer_55l',
      scheduledTime: '2026-11-09T19:30:00Z',
      status: 'Publicada',
      mode: 'automatica',
      history: [
        { timestamp: '2026-11-09T19:29:50Z', action: 'Geração de mídia concluída com sucesso' },
        { timestamp: '2026-11-09T19:30:05Z', action: 'Publicação enviada para API Oficial do TikTok' },
        { timestamp: '2026-11-09T19:30:15Z', action: 'Confirmado pelo TikTok: ID_VIDEO_987412' }
      ],
      createdAt: '2026-11-08T10:00:00Z'
    },
    {
      id: 'pub-2',
      campaignId: 'camp-1',
      productId: 'prod-1',
      productName: 'Fritadeira Elétrica Air Fryer Digital 5.5L Inox',
      channel: 'Instagram',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1585672840502-3860bb4a41eb?auto=format&fit=crop&w=800&q=80',
      caption: 'PROMOÇÃO IMPERDÍVEL: Air Fryer Digital 5.5L Inox com 22% de desconto! Toque no link da bio para conferir a oferta oficial antes que acabe o estoque.',
      hashtags: ['#achadinhosshopee', '#mercadolivrebrasil', '#cozinha', '#ofertas'],
      affiliateUrl: 'https://mercadolivre.com/sec/afiliado_ia_airfryer_55l',
      scheduledTime: '2026-11-10T12:00:00Z',
      status: 'Agendada',
      mode: 'automatica',
      history: [
        { timestamp: '2026-11-08T11:00:00Z', action: 'Criada e agendada para horário nobre de almoço' }
      ],
      createdAt: '2026-11-08T11:00:00Z'
    },
    {
      id: 'pub-3',
      campaignId: 'camp-2',
      productId: 'prod-2',
      productName: 'Fone de Ouvido Sem Fio Bluetooth com Cancelamento de Ruído ANC',
      channel: 'YouTube',
      mediaType: 'video',
      mediaUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      caption: 'Melhor Fone TWS Custo-Benefício de 2026! Isolamento de ruído real por menos de 150 reais. Link oficial nos comentários fixados.',
      hashtags: ['#shorts', '#tecnologia', '#fonedeouvido', '#achadinhos'],
      affiliateUrl: 'https://shope.ee/afiliado_ia_fone_anc_tws',
      scheduledTime: '2026-11-10T18:00:00Z',
      status: 'Aguardando aprovação',
      mode: 'manual',
      history: [
        { timestamp: '2026-11-08T15:00:00Z', action: 'Roteiro e vídeo gerados pela IA. Aguardando revisão do administrador.' }
      ],
      createdAt: '2026-11-08T15:00:00Z'
    },
    {
      id: 'pub-4',
      campaignId: 'camp-3',
      productId: 'prod-8',
      productName: 'Kit Sérum Clareador Facial Vitamina C Pura',
      channel: 'WhatsApp',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      caption: '✨ Meninas, olha essa dica de ouro para quem quer clarear manchas e dar aquele brilho na pele! O kit de Vitamina C pura tá com frete grátis e desconto direto aqui: https://vt.tiktok.com/afiliado_ia_serum_vitamina_c',
      hashtags: ['#dica', '#skincare', '#promocao'],
      affiliateUrl: 'https://vt.tiktok.com/afiliado_ia_serum_vitamina_c',
      scheduledTime: '2026-11-11T14:00:00Z',
      status: 'Em preparação',
      mode: 'assistida',
      history: [
        { timestamp: '2026-11-08T17:00:00Z', action: 'Texto formatado para disparo assistido em canais e listas VIP do WhatsApp.' }
      ],
      createdAt: '2026-11-08T17:00:00Z'
    }
  ];

  const connections: PlatformConnection[] = [
    {
      id: 'conn-1',
      type: 'marketplace',
      platform: 'Mercado Livre',
      accountName: 'Conta Afiliado ML - Pro Oficial',
      accountId: 'ML-BR-849201',
      avatarUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=150&q=80',
      status: 'connected',
      permissions: {
        readProducts: true,
        publishContent: false,
        readCommissions: true,
        readMetrics: true
      },
      connectedAt: '2026-09-01T10:00:00Z',
      lastSyncAt: '2026-11-09T03:45:00Z',
      history: [
        { timestamp: '2026-11-09T03:45:00Z', event: 'Sincronização de Comissões e Vendas', status: 'ok', message: '14 novas conversões identificadas no período.' },
        { timestamp: '2026-11-08T12:00:00Z', event: 'Atualização de Catálogo e Preços', status: 'ok', message: '3 produtos atualizados com novos preços promocionais.' }
      ],
      credentialsConfigured: true
    },
    {
      id: 'conn-2',
      type: 'marketplace',
      platform: 'Shopee',
      accountName: 'Shopee Afiliados Brasil - ID 55219',
      accountId: 'SHP-AF-9921',
      avatarUrl: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=150&q=80',
      status: 'connected',
      permissions: {
        readProducts: true,
        publishContent: false,
        readCommissions: true,
        readMetrics: true
      },
      connectedAt: '2026-09-10T14:00:00Z',
      lastSyncAt: '2026-11-09T03:50:00Z',
      history: [
        { timestamp: '2026-11-09T03:50:00Z', event: 'Consulta de Cliques e Comissões', status: 'ok', message: 'API Oficial Shopee respondeu em 210ms.' }
      ],
      credentialsConfigured: true
    },
    {
      id: 'conn-3',
      type: 'marketplace',
      platform: 'TikTok Shop',
      accountName: 'TikTok Creator Marketplace BR',
      accountId: 'TT-SHOP-BR-302',
      avatarUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=150&q=80',
      status: 'connected',
      permissions: {
        readProducts: true,
        publishContent: true,
        readCommissions: true,
        readMetrics: true
      },
      connectedAt: '2026-10-01T16:00:00Z',
      lastSyncAt: '2026-11-09T03:55:00Z',
      history: [
        { timestamp: '2026-11-09T03:55:00Z', event: 'Sincronização de Comissões TikTok Shop', status: 'ok', message: 'Taxas especiais de comissão verificadas.' }
      ],
      credentialsConfigured: true
    },
    {
      id: 'conn-4',
      type: 'social',
      platform: 'TikTok',
      accountName: '@achadinhos.topbrasil',
      accountId: 'TT-USER-7491',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      status: 'connected',
      permissions: {
        readProducts: false,
        publishContent: true,
        readCommissions: false,
        readMetrics: true
      },
      connectedAt: '2026-09-15T09:00:00Z',
      lastSyncAt: '2026-11-09T03:30:00Z',
      history: [
        { timestamp: '2026-11-09T03:30:00Z', event: 'Verificação de Token OAuth', status: 'ok', message: 'Token ativo com escopo video.publish e video.list.' }
      ],
      credentialsConfigured: true
    },
    {
      id: 'conn-5',
      type: 'social',
      platform: 'Instagram',
      accountName: '@ofertas.afiliado.ia',
      accountId: 'IG-BIZ-6612',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      status: 'connected',
      permissions: {
        readProducts: false,
        publishContent: true,
        readCommissions: false,
        readMetrics: true
      },
      connectedAt: '2026-09-18T11:00:00Z',
      lastSyncAt: '2026-11-09T03:35:00Z',
      history: [
        { timestamp: '2026-11-09T03:35:00Z', event: 'Instagram Graph API Ping', status: 'ok', message: 'Conexão ativa para Feed, Stories e Reels.' }
      ],
      credentialsConfigured: true
    },
    {
      id: 'conn-6',
      type: 'social',
      platform: 'YouTube',
      accountName: 'Canal Achados & Reviews BR',
      accountId: 'UC-BR-99014',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      status: 'connected',
      permissions: {
        readProducts: false,
        publishContent: true,
        readCommissions: false,
        readMetrics: true
      },
      connectedAt: '2026-10-05T14:00:00Z',
      lastSyncAt: '2026-11-09T03:20:00Z',
      history: [
        { timestamp: '2026-11-09T03:20:00Z', event: 'YouTube Data API Status', status: 'ok', message: 'Pronto para publicação de Shorts.' }
      ],
      credentialsConfigured: true
    },
    {
      id: 'conn-7',
      type: 'social',
      platform: 'Facebook',
      accountName: 'Página Ofertas e Descontos Imperdíveis',
      accountId: 'FB-PAGE-4412',
      status: 'connected',
      permissions: {
        readProducts: false,
        publishContent: true,
        readCommissions: false,
        readMetrics: true
      },
      connectedAt: '2026-10-12T10:00:00Z',
      lastSyncAt: '2026-11-09T03:10:00Z',
      history: [
        { timestamp: '2026-11-09T03:10:00Z', event: 'Facebook Pages API', status: 'ok', message: 'Pronto para posts com link direto.' }
      ],
      credentialsConfigured: true
    },
    {
      id: 'conn-8',
      type: 'social',
      platform: 'Pinterest',
      accountName: 'Painel Decor & Achadinhos',
      accountId: 'PIN-BIZ-8812',
      status: 'connected',
      permissions: {
        readProducts: false,
        publishContent: true,
        readCommissions: false,
        readMetrics: true
      },
      connectedAt: '2026-10-18T16:00:00Z',
      lastSyncAt: '2026-11-09T03:00:00Z',
      history: [
        { timestamp: '2026-11-09T03:00:00Z', event: 'Pinterest API v5', status: 'ok', message: 'Pins de produtos habilitados.' }
      ],
      credentialsConfigured: true
    },
    {
      id: 'conn-9',
      type: 'social',
      platform: 'WhatsApp',
      accountName: 'Canal VIP Ofertas & Descontos',
      accountId: 'WA-BIZ-5511',
      status: 'connected',
      permissions: {
        readProducts: false,
        publishContent: true,
        readCommissions: false,
        readMetrics: true
      },
      connectedAt: '2026-10-22T08:00:00Z',
      lastSyncAt: '2026-11-09T03:40:00Z',
      history: [
        { timestamp: '2026-11-09T03:40:00Z', event: 'WhatsApp Cloud API / Assistida', status: 'ok', message: 'Transmissão autorizada para listas e canais.' }
      ],
      credentialsConfigured: true
    }
  ];

  const commissions: CommissionRecord[] = [
    {
      id: 'comm-1',
      date: '2026-11-08',
      productId: 'prod-1',
      productName: 'Fritadeira Elétrica Air Fryer Digital 5.5L Inox',
      marketplace: 'Mercado Livre',
      channel: 'TikTok',
      saleValue: 389.90,
      commissionRate: 12.0,
      commissionValue: 46.78,
      status: 'aprovada',
      paymentDate: '2026-11-15',
      receiptNumber: 'REC-ML-7721'
    },
    {
      id: 'comm-2',
      date: '2026-11-08',
      productId: 'prod-1',
      productName: 'Fritadeira Elétrica Air Fryer Digital 5.5L Inox',
      marketplace: 'Mercado Livre',
      channel: 'TikTok',
      saleValue: 389.90,
      commissionRate: 12.0,
      commissionValue: 46.78,
      status: 'aprovada',
      paymentDate: '2026-11-15',
      receiptNumber: 'REC-ML-7722'
    },
    {
      id: 'comm-3',
      date: '2026-11-07',
      productId: 'prod-2',
      productName: 'Fone de Ouvido Sem Fio Bluetooth com Cancelamento de Ruído ANC',
      marketplace: 'Shopee',
      channel: 'Instagram',
      saleValue: 149.90,
      commissionRate: 14.5,
      commissionValue: 21.73,
      status: 'paga',
      paymentDate: '2026-11-07',
      receiptNumber: 'PIX-SHP-882910',
      notes: 'Pago via PIX Mercado Livre/Shopee lote mensal'
    },
    {
      id: 'comm-4',
      date: '2026-11-07',
      productId: 'prod-4',
      productName: 'Mini Processador e Triturador Elétrico de Alimentos USB',
      marketplace: 'TikTok Shop',
      channel: 'TikTok',
      saleValue: 49.90,
      commissionRate: 18.0,
      commissionValue: 8.98,
      status: 'paga',
      paymentDate: '2026-11-07',
      receiptNumber: 'PIX-TT-99381'
    },
    {
      id: 'comm-5',
      date: '2026-11-09',
      productId: 'prod-8',
      productName: 'Kit Sérum Clareador Facial Vitamina C Pura',
      marketplace: 'TikTok Shop',
      channel: 'TikTok',
      saleValue: 89.90,
      commissionRate: 20.0,
      commissionValue: 17.98,
      status: 'pendente',
      notes: 'Aguardando confirmação de entrega da transportadora'
    },
    {
      id: 'comm-6',
      date: '2026-11-09',
      productId: 'prod-1',
      productName: 'Fritadeira Elétrica Air Fryer Digital 5.5L Inox',
      marketplace: 'Mercado Livre',
      channel: 'WhatsApp',
      saleValue: 389.90,
      commissionRate: 12.0,
      commissionValue: 46.78,
      status: 'estimada',
      notes: 'Clique com intenção de compra registrada nas últimas 2h'
    },
    {
      id: 'comm-7',
      date: '2026-11-06',
      productId: 'prod-3',
      productName: 'Smartwatch Esportivo AMOLED com Monitor Cardíaco',
      marketplace: 'Shopee',
      channel: 'Facebook',
      saleValue: 229.00,
      commissionRate: 11.0,
      commissionValue: 25.19,
      status: 'cancelada',
      notes: 'Comprador solicitou cancelamento antes do envio'
    }
  ];

  const automationJobs: AutomationJob[] = [
    {
      id: 'job-1',
      productId: 'prod-1',
      productName: 'Fritadeira Elétrica Air Fryer Digital 5.5L Inox',
      status: 'completed',
      progress: 100,
      currentStep: 'Campanha ativa e distribuída em 3 canais',
      stepsCompleted: [
        'Consulta de dados do produto no Mercado Livre',
        'Validação do link de afiliado oficial',
        'Cálculo e verificação de comissão (12%)',
        'Avaliação de oportunidade pela IA (Score: 96/100)',
        'Geração de 3 criativos de imagem publicitária',
        'Roteirização e renderização do vídeo vertical com narração',
        'Geração de copys comerciais para TikTok, Instagram e WhatsApp',
        'Agendamento nos horários nobres de engajamento'
      ],
      channels: ['TikTok', 'Instagram', 'WhatsApp'],
      autoApprove: true,
      createdAt: '2026-11-08T09:00:00Z'
    }
  ];

  const auditLogs: AuditLog[] = [
    {
      id: 'log-1',
      timestamp: '2026-11-09T03:55:00Z',
      user: 'admin@afiliadoia.com.br',
      action: 'SINCRONIZAÇÃO_AUTOMÁTICA',
      category: 'Marketplace',
      details: 'Sincronização de comissões realizada para Mercado Livre, Shopee e TikTok Shop.',
      ip: '127.0.0.1'
    },
    {
      id: 'log-2',
      timestamp: '2026-11-09T02:30:00Z',
      user: 'admin@afiliadoia.com.br',
      action: 'AUTOMAÇÃO_EXECUTADA',
      category: 'Automação',
      details: 'Fluxo 1-Clique executado para Fritadeira Elétrica Air Fryer Digital 5.5L.',
      ip: '127.0.0.1'
    },
    {
      id: 'log-3',
      timestamp: '2026-11-08T19:30:15Z',
      user: 'sistema',
      action: 'PUBLICAÇÃO_CONCLUÍDA',
      category: 'Redes Sociais',
      details: 'Publicação de vídeo aprovada e disparada no TikTok com link na bio.',
      ip: '127.0.0.1'
    }
  ];

  const autonomousTasks: AutonomousTask[] = [
    {
      id: 'task-auto-1',
      type: 'scan_products',
      title: 'Varredura Contínua de Oportunidades nos Marketplaces',
      status: 'completed',
      priority: 1,
      targetProduct: 'Catálogo Conectado',
      resultMessage: '8 produtos avaliados e catalogados com margem superior a 10% de comissão.',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      completedAt: new Date(Date.now() - 3600000 * 2 + 15000).toISOString(),
    },
    {
      id: 'task-auto-2',
      type: 'verify_links',
      title: 'Sentinela de Integridade: Auditoria de Links e Estoque',
      status: 'completed',
      priority: 1,
      targetProduct: 'Todos os Links Ativos',
      resultMessage: '100% dos links de afiliado validados sem quebra de tag de atribuição oficial.',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date(Date.now() - 3600000 + 8000).toISOString(),
    },
    {
      id: 'task-auto-3',
      type: 'create_creatives',
      title: 'Geração Autônoma de Vídeo Vertical e Copys de Conversão',
      status: 'completed',
      priority: 2,
      targetProduct: 'Fritadeira Elétrica Air Fryer 5.5L',
      resultMessage: 'Vídeo curto de 30s com narração TTS e 3 variações de criativos de imagem gerados.',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      completedAt: new Date(Date.now() - 1800000 + 12000).toISOString(),
    },
    {
      id: 'task-auto-4',
      type: 'schedule_post',
      title: 'Agendamento em Horários Nobres de Pico',
      status: 'completed',
      priority: 2,
      targetChannel: 'TikTok & Instagram',
      resultMessage: 'Postagens distribuídas nos horários estratégicos (12:30 e 19:45).',
      createdAt: new Date(Date.now() - 900000).toISOString(),
      completedAt: new Date(Date.now() - 900000 + 5000).toISOString(),
    },
    {
      id: 'task-auto-5',
      type: 'monitor_performance',
      title: 'Monitoramento de Cliques e Comissões Atribuídas',
      status: 'running',
      priority: 3,
      targetChannel: 'Todos os Canais',
      resultMessage: 'Coletando métricas de conversão das APIs conectadas.',
      createdAt: new Date().toISOString(),
    }
  ];

  const interventionAlerts: InterventionAlert[] = [
    {
      id: 'alert-1',
      type: 'payment_ready',
      title: 'Novo Lote de Comissões Disponível para Conferência',
      message: 'O Mercado Livre Afiliados liberou R$ 93,56 em comissões aprovadas prontas para saque/Pix.',
      platform: 'Mercado Livre',
      severity: 'info',
      actionLabel: 'Verificar no Painel Financeiro',
      actionType: 'NAVIGATE_FINANCIAL',
      resolved: false,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    }
  ];

  const weeklyReports: WeeklyExecutiveReport[] = [
    {
      id: 'rep-sem-45',
      weekNumber: 45,
      year: 2026,
      period: '02 a 08 de Novembro de 2026',
      executiveSummary: 'Operação autônoma funcionou sem necessidade de intervenção operacional. Foram geradas 14 vendas atribuídas, gerando R$ 890,30 em comissões aprovadas e pagas. O TikTok foi o canal com maior taxa de conversão (4.1%), impulsionado pelo vídeo demonstrativo da Air Fryer Digital.',
      totalRevenue: 890.30,
      totalSales: 29,
      topConvertingProduct: 'Fritadeira Elétrica Air Fryer Digital 5.5L Inox',
      topConvertingChannel: 'TikTok Shop / TikTok',
      autonomousActionsExecuted: 142,
      underperformingReplacedCount: 2,
      linksVerifiedCount: 48,
      ownerActionRequiredCount: 0,
      nextWeekStrategy: [
        'Aumentar publicações automáticas no nicho de Casa e Cozinha para o Esquenta Black Friday',
        'Reaproveitar o criativo vencedor da Air Fryer em formato Carrossel no Instagram',
        'Manter monitoramento de links a cada 15 minutos para evitar tráfego perdido'
      ],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    }
  ];

  const autonomyConfig: AutonomyConfig = {
    enabled: true,
    scanIntervalMinutes: 15,
    minCommissionPercent: 10,
    minRating: 4.5,
    maxDailyPostsPerChannel: 4,
    autoReplaceUnderperforming: true,
    underperformingDaysThreshold: 3,
    autoPublishEnabled: true,
    allowedChannels: ['TikTok', 'Instagram', 'WhatsApp', 'YouTube', 'Facebook', 'Pinterest'],
    targetCategories: ['Casa e Cozinha', 'Eletrônicos', 'Beleza & Saúde'],
    lastCycleRun: now,
    nextCycleRun: new Date(Date.now() + 15 * 60000).toISOString(),
    totalCyclesExecuted: 48,
    autonomousActionsToday: 14,
    totalUnderperformingReplaced: 2,
  };

  return {
    products,
    links,
    campaigns,
    publications,
    connections,
    commissions,
    automationJobs,
    autonomousTasks,
    interventionAlerts,
    weeklyReports,
    autonomyConfig,
    auditLogs,
    settings: {
      dailyPostLimitPerChannel: 4,
      antiDuplicateProtection: true,
      autoCheckLinksIntervalHours: 6,
      highContrastMode: false,
      fontSize: 'normal'
    }
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure autonomous fields exist if older database file was loaded
        const seed = getSeedData();
        if (!this.data.autonomousTasks) this.data.autonomousTasks = seed.autonomousTasks;
        if (!this.data.interventionAlerts) this.data.interventionAlerts = seed.interventionAlerts;
        if (!this.data.weeklyReports) this.data.weeklyReports = seed.weeklyReports;
        if (!this.data.autonomyConfig) this.data.autonomyConfig = seed.autonomyConfig;
      } catch (err) {
        console.error('Error loading database, resetting to seed:', err);
        this.data = getSeedData();
        this.save();
      }
    } else {
      this.data = getSeedData();
      this.save();
    }
  }

  private save(): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  // Products
  public getProducts(): AffiliateProduct[] {
    return this.data.products;
  }

  public getProductById(id: string): AffiliateProduct | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public addProduct(product: AffiliateProduct): AffiliateProduct {
    this.data.products.unshift(product);
    this.save();
    return product;
  }

  public updateProduct(id: string, updates: Partial<AffiliateProduct>): AffiliateProduct | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates, lastUpdated: new Date().toISOString() };
    this.save();
    return this.data.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const prevLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Links
  public getLinks(): AffiliateLink[] {
    return this.data.links;
  }

  public addLink(link: AffiliateLink): AffiliateLink {
    this.data.links.unshift(link);
    this.save();
    return link;
  }

  public updateLink(id: string, updates: Partial<AffiliateLink>): AffiliateLink | null {
    const idx = this.data.links.findIndex(l => l.id === id);
    if (idx === -1) return null;
    this.data.links[idx] = { ...this.data.links[idx], ...updates };
    this.save();
    return this.data.links[idx];
  }

  public deleteLink(id: string): boolean {
    const prev = this.data.links.length;
    this.data.links = this.data.links.filter(l => l.id !== id);
    if (this.data.links.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  // Campaigns
  public getCampaigns(): Campaign[] {
    return this.data.campaigns;
  }

  public addCampaign(campaign: Campaign): Campaign {
    this.data.campaigns.unshift(campaign);
    this.save();
    return campaign;
  }

  public updateCampaign(id: string, updates: Partial<Campaign>): Campaign | null {
    const idx = this.data.campaigns.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.campaigns[idx] = { ...this.data.campaigns[idx], ...updates };
    this.save();
    return this.data.campaigns[idx];
  }

  // Publications
  public getPublications(): Publication[] {
    return this.data.publications;
  }

  public addPublication(pub: Publication): Publication {
    this.data.publications.unshift(pub);
    this.save();
    return pub;
  }

  public updatePublication(id: string, updates: Partial<Publication>): Publication | null {
    const idx = this.data.publications.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.publications[idx] = { ...this.data.publications[idx], ...updates };
    this.save();
    return this.data.publications[idx];
  }

  public deletePublication(id: string): boolean {
    const prev = this.data.publications.length;
    this.data.publications = this.data.publications.filter(p => p.id !== id);
    if (this.data.publications.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  // Connections
  public getConnections(): PlatformConnection[] {
    return this.data.connections;
  }

  public updateConnection(id: string, updates: Partial<PlatformConnection>): PlatformConnection | null {
    const idx = this.data.connections.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.connections[idx] = { ...this.data.connections[idx], ...updates };
    this.save();
    return this.data.connections[idx];
  }

  // Commissions
  public getCommissions(): CommissionRecord[] {
    return this.data.commissions;
  }

  public addCommission(comm: CommissionRecord): CommissionRecord {
    this.data.commissions.unshift(comm);
    this.save();
    return comm;
  }

  public updateCommission(id: string, updates: Partial<CommissionRecord>): CommissionRecord | null {
    const idx = this.data.commissions.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.commissions[idx] = { ...this.data.commissions[idx], ...updates };
    this.save();
    return this.data.commissions[idx];
  }

  // Automation
  public getAutomationJobs(): AutomationJob[] {
    return this.data.automationJobs;
  }

  public addAutomationJob(job: AutomationJob): AutomationJob {
    this.data.automationJobs.unshift(job);
    this.save();
    return job;
  }

  public updateAutomationJob(id: string, updates: Partial<AutomationJob>): AutomationJob | null {
    const idx = this.data.automationJobs.findIndex(j => j.id === id);
    if (idx === -1) return null;
    this.data.automationJobs[idx] = { ...this.data.automationJobs[idx], ...updates };
    this.save();
    return this.data.automationJobs[idx];
  }

  // Audit Logs
  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs;
  }

  public addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    this.data.auditLogs.unshift(log);
    // keep max 200 logs
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs.pop();
    }
    this.save();
    return log;
  }

  // Settings
  public getSettings() {
    return this.data.settings;
  }

  public updateSettings(settings: Partial<DatabaseSchema['settings']>) {
    this.data.settings = { ...this.data.settings, ...settings };
    this.save();
    return this.data.settings;
  }

  // Autonomous Engine Methods
  public getAutonomyConfig(): AutonomyConfig {
    return this.data.autonomyConfig;
  }

  public updateAutonomyConfig(updates: Partial<AutonomyConfig>): AutonomyConfig {
    this.data.autonomyConfig = { ...this.data.autonomyConfig, ...updates };
    this.save();
    return this.data.autonomyConfig;
  }

  public getAutonomousTasks(): AutonomousTask[] {
    return this.data.autonomousTasks;
  }

  public addAutonomousTask(task: AutonomousTask): AutonomousTask {
    this.data.autonomousTasks.unshift(task);
    if (this.data.autonomousTasks.length > 100) {
      this.data.autonomousTasks.pop();
    }
    this.save();
    return task;
  }

  public updateAutonomousTask(id: string, updates: Partial<AutonomousTask>): AutonomousTask | null {
    const idx = this.data.autonomousTasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.autonomousTasks[idx] = { ...this.data.autonomousTasks[idx], ...updates };
    this.save();
    return this.data.autonomousTasks[idx];
  }

  public getInterventionAlerts(): InterventionAlert[] {
    return this.data.interventionAlerts;
  }

  public addInterventionAlert(alert: InterventionAlert): InterventionAlert {
    this.data.interventionAlerts.unshift(alert);
    this.save();
    return alert;
  }

  public resolveInterventionAlert(id: string): boolean {
    const idx = this.data.interventionAlerts.findIndex(a => a.id === id);
    if (idx === -1) return false;
    this.data.interventionAlerts[idx].resolved = true;
    this.save();
    return true;
  }

  public getWeeklyReports(): WeeklyExecutiveReport[] {
    return this.data.weeklyReports;
  }

  public addWeeklyReport(report: WeeklyExecutiveReport): WeeklyExecutiveReport {
    this.data.weeklyReports.unshift(report);
    this.save();
    return report;
  }

  public resetToSeed(): DatabaseSchema {
    this.data = getSeedData();
    this.save();
    return this.data;
  }
}

export const db = new Database();
