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
  conversionPotential?: string;
  shortVideoFit?: string;
  competitionLevel?: string;
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

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: string;
  details: string;
  ip: string;
}

export interface DashboardMetrics {
  totalProducts: number;
  publishedProducts: number;
  activeCampaigns: number;
  videosProduced: number;
  imagesProduced: number;
  publicationsCount: number;
  totalViews: number;
  totalClicks: number;
  attributedSales: number;
  pendingCommission: number;
  approvedCommission: number;
  paidCommission: number;
  estimatedCommission: number;
  canceledCommission: number;
  bestProduct: string;
  bestChannel: string;
}

export type ActiveTab =
  | 'dashboard'
  | 'autonomy'
  | 'products'
  | 'smart-choice'
  | 'content-studio'
  | 'links'
  | 'publications'
  | 'calendar'
  | 'financial'
  | 'automation'
  | 'connections'
  | 'assistant'
  | 'audit-logs';
