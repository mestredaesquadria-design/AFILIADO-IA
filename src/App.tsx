import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ProductsView } from './components/ProductsView';
import { SmartChoiceView } from './components/SmartChoiceView';
import { ContentStudioView } from './components/ContentStudioView';
import { LinksManagerView } from './components/LinksManagerView';
import { PublicationsView } from './components/PublicationsView';
import { CalendarView } from './components/CalendarView';
import { FinancialView } from './components/FinancialView';
import { AutomationView } from './components/AutomationView';
import { AutonomyView } from './components/AutonomyView';
import { ConnectionsView } from './components/ConnectionsView';
import { MasterAIAssistant } from './components/MasterAIAssistant';
import { AuditLogsView } from './components/AuditLogsView';
import { 
  ActiveTab, 
  AffiliateProduct, 
  AffiliateLink, 
  Campaign, 
  Publication, 
  PlatformConnection, 
  CommissionRecord, 
  AutomationJob, 
  AuditLog, 
  DashboardMetrics,
  AutonomyConfig,
  AutonomousTask,
  InterventionAlert,
  WeeklyExecutiveReport
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Data
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [commissionTotals, setCommissionTotals] = useState({
    estimada: 46.78,
    pendente: 17.98,
    aprovada: 93.56,
    cancelada: 25.19,
    paga: 30.71,
  });
  const [jobs, setJobs] = useState<AutomationJob[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Autonomous Engine Data
  const [autonomyConfig, setAutonomyConfig] = useState<AutonomyConfig | null>(null);
  const [autonomousTasks, setAutonomousTasks] = useState<AutonomousTask[]>([]);
  const [interventionAlerts, setInterventionAlerts] = useState<InterventionAlert[]>([]);
  const [latestWeeklyReport, setLatestWeeklyReport] = useState<WeeklyExecutiveReport | null>(null);

  // Selected product in focus for Content Studio / Automation
  const [selectedProduct, setSelectedProduct] = useState<AffiliateProduct | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial Fetch & Refresh functions
  const fetchDashboard = () => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        if (data.metrics) setMetrics(data.metrics);
        if (data.chartData) setChartData(data.chartData);
      })
      .catch(err => console.error('Error fetching dashboard:', err));
  };

  const fetchProducts = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          setProducts(data.products);
          if (!selectedProduct && data.products.length > 0) {
            setSelectedProduct(data.products[0]);
          }
        }
      })
      .catch(err => console.error('Error fetching products:', err));
  };

  const fetchLinks = () => {
    fetch('/api/links')
      .then(res => res.json())
      .then(data => {
        if (data.links) setLinks(data.links);
      })
      .catch(err => console.error('Error fetching links:', err));
  };

  const fetchPublications = () => {
    fetch('/api/publications')
      .then(res => res.json())
      .then(data => {
        if (data.publications) setPublications(data.publications);
      })
      .catch(err => console.error('Error fetching publications:', err));
  };

  const fetchConnections = () => {
    fetch('/api/connections')
      .then(res => res.json())
      .then(data => {
        if (data.connections) setConnections(data.connections);
      })
      .catch(err => console.error('Error fetching connections:', err));
  };

  const fetchCommissions = () => {
    fetch('/api/commissions')
      .then(res => res.json())
      .then(data => {
        if (data.commissions) setCommissions(data.commissions);
        if (data.totals) setCommissionTotals(data.totals);
      })
      .catch(err => console.error('Error fetching commissions:', err));
  };

  const fetchJobs = () => {
    fetch('/api/automation/jobs')
      .then(res => res.json())
      .then(data => {
        if (data.jobs) setJobs(data.jobs);
      })
      .catch(err => console.error('Error fetching jobs:', err));
  };

  const fetchLogs = () => {
    fetch('/api/audit-logs')
      .then(res => res.json())
      .then(data => {
        if (data.logs) setAuditLogs(data.logs);
      })
      .catch(err => console.error('Error fetching logs:', err));
  };

  const fetchAutonomyStatus = () => {
    fetch('/api/autonomy/status')
      .then(res => res.json())
      .then(data => {
        if (data.config) setAutonomyConfig(data.config);
        if (data.recentTasks) setAutonomousTasks(data.recentTasks);
        if (data.alerts) setInterventionAlerts(data.alerts);
        if (data.latestWeeklyReport) setLatestWeeklyReport(data.latestWeeklyReport);
      })
      .catch(err => console.error('Error fetching autonomy status:', err));
  };

  const reloadAll = () => {
    fetchDashboard();
    fetchProducts();
    fetchLinks();
    fetchPublications();
    fetchConnections();
    fetchCommissions();
    fetchJobs();
    fetchLogs();
    fetchAutonomyStatus();
  };

  useEffect(() => {
    reloadAll();
  }, []);

  // Autonomy Handlers
  const handleToggleAutonomy = async (enabled: boolean) => {
    try {
      const res = await fetch('/api/autonomy/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      const data = await res.json();
      if (data.config) {
        setAutonomyConfig(data.config);
        showToast(enabled ? 'Modo de Autonomia Total ATIVADO (Operação 24/7)' : 'Modo Autônomo Pausado pelo Proprietário');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunImmediateCycle = async () => {
    const res = await fetch('/api/autonomy/run-cycle', { method: 'POST' });
    const data = await res.json();
    fetchAutonomyStatus();
    fetchDashboard();
    fetchPublications();
    return data;
  };

  const handleUpdateAutonomyConfig = async (newConfig: Partial<AutonomyConfig>) => {
    try {
      const res = await fetch('/api/autonomy/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });
      const data = await res.json();
      if (data.config) {
        setAutonomyConfig(data.config);
        showToast('Diretrizes e regras da autonomia atualizadas com sucesso!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveAlert = async (id: string) => {
    try {
      const res = await fetch(`/api/autonomy/alerts/${id}/resolve`, { method: 'POST' });
      if (res.ok) {
        setInterventionAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
        showToast('Alerta de intervenção dispensado.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Action Handlers
  const handleToggleFavorite = async (id: string, isFav: boolean) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: isFav }),
      });
      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, isFavorite: isFav } : p));
        showToast(isFav ? 'Produto adicionado aos favoritos!' : 'Removido dos favoritos.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectProductForCampaign = (product: AffiliateProduct) => {
    setSelectedProduct(product);
    setActiveTab('automation');
  };

  const handleBatchLaunch = async (selectedProds: AffiliateProduct[]) => {
    showToast(`Iniciando criação em lote para ${selectedProds.length} produtos...`);
    for (const prod of selectedProds) {
      await fetch('/api/automation/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: prod.id,
          channels: ['TikTok', 'Instagram', 'WhatsApp'],
          autoApprove: true,
        }),
      });
    }
    reloadAll();
    showToast(`${selectedProds.length} campanhas preparadas e agendadas com sucesso!`);
    setActiveTab('publications');
  };

  const handleAddNewProduct = async (newProd: any) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      });
      if (res.ok) {
        fetchProducts();
        showToast('Produto cadastrado com sucesso!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImportUrl = async (url: string) => {
    try {
      const res = await fetch('/api/products/import-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        fetchProducts();
        showToast('Produto importado oficialmente com dados verificados!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLink = async (linkData: any) => {
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(linkData),
      });
      if (res.ok) {
        fetchLinks();
        showToast('Link de afiliado cadastrado!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      const res = await fetch(`/api/links/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLinks(prev => prev.filter(l => l.id !== id));
        showToast('Link removido com sucesso.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSchedulePost = async (content: { mediaType: 'image' | 'video'; mediaUrl: string; caption: string; channel: string }) => {
    if (!selectedProduct) return;
    try {
      const res = await fetch('/api/publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          channel: content.channel,
          mediaType: content.mediaType,
          mediaUrl: content.mediaUrl,
          caption: content.caption,
          affiliateUrl: selectedProduct.affiliateUrl,
          scheduledTime: new Date(Date.now() + 3600000 * 2).toISOString(),
          status: 'Agendada',
          mode: 'automatica',
        }),
      });
      if (res.ok) {
        fetchPublications();
        showToast('Publicação enviada para a Central de Publicações!');
        setActiveTab('publications');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublishNow = async (id: string) => {
    try {
      const res = await fetch(`/api/publications/${id}/publish`, { method: 'POST' });
      if (res.ok) {
        fetchPublications();
        fetchDashboard();
        showToast('Publicação realizada com sucesso no canal oficial!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePublicationStatus = async (id: string, status: Publication['status']) => {
    try {
      const res = await fetch(`/api/publications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchPublications();
        showToast(`Status atualizado para: ${status}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePublication = async (id: string) => {
    try {
      const res = await fetch(`/api/publications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPublications(prev => prev.filter(p => p.id !== id));
        showToast('Publicação excluída.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConnectPlatform = async (id: string, credentials: any) => {
    try {
      const res = await fetch(`/api/connections/${id}/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (res.ok) {
        fetchConnections();
        showToast('Plataforma autenticada com sucesso!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisconnectPlatform = async (id: string) => {
    try {
      const res = await fetch(`/api/connections/${id}/disconnect`, { method: 'POST' });
      if (res.ok) {
        fetchConnections();
        showToast('Plataforma desconectada.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSyncPlatform = async (id: string) => {
    try {
      const res = await fetch(`/api/connections/${id}/sync`, { method: 'POST' });
      if (res.ok) {
        fetchConnections();
        showToast('Sincronização de métricas e catálogo concluída!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegisterReceipt = async (id: string, paymentDate: string, receiptNumber: string) => {
    try {
      const res = await fetch(`/api/commissions/${id}/receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentDate, receiptNumber }),
      });
      if (res.ok) {
        fetchCommissions();
        fetchDashboard();
        showToast('Comprovante de pagamento registrado! Comissão marcada como PAGA.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImportCsv = async (csvContent: string) => {
    try {
      const res = await fetch('/api/commissions/import-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvContent }),
      });
      const data = await res.json();
      if (data.success) {
        fetchCommissions();
        fetchDashboard();
        showToast(`${data.importedCount} registros de comissão importados e conciliados!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExecuteAutomation = async (productId: string, channels: string[], autoApprove: boolean) => {
    const res = await fetch('/api/automation/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, channels, autoApprove }),
    });
    if (res.ok) {
      reloadAll();
      showToast('Campanha 1-Clique gerada e distribuída com sucesso!');
    }
  };

  const handleResetDb = async () => {
    if (!confirm('Deseja restaurar o banco de dados para os dados padrão iniciais de demonstração?')) return;
    try {
      const res = await fetch('/api/db/reset', { method: 'POST' });
      if (res.ok) {
        reloadAll();
        showToast('Banco de dados restaurado com sucesso!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Font size class mapping
  const fontClass = fontSize === 'large' ? 'text-[1.05rem]' : fontSize === 'xl' ? 'text-[1.15rem]' : 'text-sm';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      highContrast ? 'bg-black text-white' : 'bg-slate-100 text-slate-800'
    } ${fontClass}`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-2xl border border-emerald-500/40 flex items-center space-x-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAutomation={() => {
          if (!selectedProduct && products.length > 0) setSelectedProduct(products[0]);
          setActiveTab('automation');
        }}
        onToggleAssistant={() => setIsAssistantOpen(!isAssistantOpen)}
        isAssistantOpen={isAssistantOpen}
        fontSize={fontSize}
        setFontSize={setFontSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        isAutonomyActive={autonomyConfig?.enabled ?? true}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          highContrast={highContrast}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              metrics={metrics}
              chartData={chartData}
              setActiveTab={setActiveTab}
              onOpenAutomation={() => setActiveTab('automation')}
              highContrast={highContrast}
            />
          )}

          {activeTab === 'autonomy' && (
            <AutonomyView
              config={autonomyConfig}
              tasks={autonomousTasks}
              alerts={interventionAlerts}
              latestReport={latestWeeklyReport}
              onToggleAutonomy={handleToggleAutonomy}
              onRunImmediateCycle={handleRunImmediateCycle}
              onUpdateConfig={handleUpdateAutonomyConfig}
              onResolveAlert={handleResolveAlert}
              setActiveTab={setActiveTab}
              highContrast={highContrast}
            />
          )}

          {activeTab === 'products' && (
            <ProductsView
              products={products}
              onToggleFavorite={handleToggleFavorite}
              onSelectForCampaign={handleSelectProductForCampaign}
              onRefreshProducts={fetchProducts}
              onAddNewProduct={handleAddNewProduct}
              onImportUrl={handleImportUrl}
              highContrast={highContrast}
            />
          )}

          {activeTab === 'smart-choice' && (
            <SmartChoiceView
              products={products}
              onSelectProduct={handleSelectProductForCampaign}
              onBatchLaunch={handleBatchLaunch}
              highContrast={highContrast}
            />
          )}

          {activeTab === 'automation' && (
            <AutomationView
              products={products}
              jobs={jobs}
              selectedProduct={selectedProduct}
              onSelectProduct={setSelectedProduct}
              onExecuteAutomation={handleExecuteAutomation}
              onViewPublications={() => setActiveTab('publications')}
              highContrast={highContrast}
            />
          )}

          {activeTab === 'content-studio' && (
            <ContentStudioView
              products={products}
              selectedProduct={selectedProduct}
              onSelectProduct={setSelectedProduct}
              onSchedulePost={handleSchedulePost}
              highContrast={highContrast}
            />
          )}

          {activeTab === 'links' && (
            <LinksManagerView
              links={links}
              products={products}
              onAddLink={handleAddLink}
              onDeleteLink={handleDeleteLink}
              onRefreshLinks={fetchLinks}
              highContrast={highContrast}
            />
          )}

          {activeTab === 'publications' && (
            <PublicationsView
              publications={publications}
              onPublishNow={handlePublishNow}
              onUpdateStatus={handleUpdatePublicationStatus}
              onDeletePublication={handleDeletePublication}
              highContrast={highContrast}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              publications={publications}
              products={products}
              onReschedule={() => {}}
              onOpenAutomation={() => setActiveTab('automation')}
              highContrast={highContrast}
            />
          )}

          {activeTab === 'financial' && (
            <FinancialView
              commissions={commissions}
              totals={commissionTotals}
              onRegisterReceipt={handleRegisterReceipt}
              onImportCsv={handleImportCsv}
              onAddCommission={() => {}}
              highContrast={highContrast}
            />
          )}

          {activeTab === 'connections' && (
            <ConnectionsView
              connections={connections}
              onConnect={handleConnectPlatform}
              onDisconnect={handleDisconnectPlatform}
              onSync={handleSyncPlatform}
              highContrast={highContrast}
            />
          )}

          {activeTab === 'assistant' && (
            <MasterAIAssistant
              isOpen={true}
              onClose={() => {}}
              setActiveTab={setActiveTab}
              onOpenAutomation={() => setActiveTab('automation')}
              products={products}
              highContrast={highContrast}
              isFullPageView={true}
            />
          )}

          {activeTab === 'audit-logs' && (
            <AuditLogsView
              logs={auditLogs}
              onRefreshLogs={fetchLogs}
              onResetDb={handleResetDb}
              highContrast={highContrast}
            />
          )}
        </main>
      </div>

      {/* Floating Drawer for Master AI Assistant when toggled */}
      <MasterAIAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        setActiveTab={setActiveTab}
        onOpenAutomation={() => {
          setIsAssistantOpen(false);
          setActiveTab('automation');
        }}
        products={products}
        highContrast={highContrast}
        isFullPageView={false}
      />

    </div>
  );
}
