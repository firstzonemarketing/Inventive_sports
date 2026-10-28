import React, { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Download,
  FileText,
  FolderKanban,
  Image as ImageIcon,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  Plus,
  RefreshCw,
  Save,
  ShoppingBag,
  Trash2,
  Trophy,
  Upload,
  Users,
} from 'lucide-react';
import {
  CmsDiscipline,
  CmsEvent,
  CmsGalleryItem,
  CmsMilestone,
  CmsProduct,
  CmsTeamMember,
} from '../content';
import { useCms } from '../lib/cms';

type AdminTab =
  | 'overview'
  | 'content'
  | 'team'
  | 'disciplines'
  | 'events'
  | 'gallery'
  | 'products'
  | 'leads'
  | 'media';

interface LeadRecord {
  id: number;
  name: string;
  email: string;
  phone: string;
  preferred_discipline: string;
  enquiry_type: string;
  message: string;
  source_page: string;
  status: string;
  created_at: string;
  notes?: { id: number; author_name: string; note: string; created_at: string }[];
}

interface MediaRecord {
  id: number;
  title: string;
  file_name: string;
  file_path: string;
  alt_text: string;
  folder: string;
  created_at: string;
}

export const AdminDashboard: React.FC = () => {
  const {
    settings: publicSettings,
    milestones: publicMilestones,
    leadership: publicLeadership,
    squad: publicSquad,
    disciplines: publicDisciplines,
    events: publicEvents,
    gallery: publicGallery,
    products: publicProducts,
    refreshPublicData,
    navigate,
  } = useCms();

  const [token, setToken] = useState<string>(
    () => localStorage.getItem('inv_admin_token') || ''
  );
  const [loginEmail, setLoginEmail] = useState('admin@inventivesports.co');
  const [loginPassword, setLoginPassword] = useState('InventiveAdmin2026!');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [toast, setToast] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Dashboard state from Laravel API
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [logs, setLogs] = useState<
    {
      id: number;
      actor_name: string;
      action: string;
      details: string;
      created_at: string;
    }[]
  >([]);
  const [settingsForm, setSettingsForm] =
    useState<Record<string, string>>(publicSettings);
  const [milestones, setMilestones] =
    useState<CmsMilestone[]>(publicMilestones);
  const [team, setTeam] = useState<CmsTeamMember[]>([
    ...publicLeadership,
    ...publicSquad,
  ]);
  const [disciplines, setDisciplines] =
    useState<CmsDiscipline[]>(publicDisciplines);
  const [events, setEvents] = useState<CmsEvent[]>(publicEvents);
  const [galleryItems, setGalleryItems] =
    useState<CmsGalleryItem[]>(publicGallery);
  const [products, setProducts] = useState<CmsProduct[]>(publicProducts);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [mediaList, setMediaList] = useState<MediaRecord[]>([]);

  // Active editor states
  const [editingMember, setEditingMember] =
    useState<Partial<CmsTeamMember> | null>(null);
  const [editingDiscipline, setEditingDiscipline] =
    useState<Partial<CmsDiscipline> | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<CmsEvent> | null>(
    null
  );
  const [editingGallery, setEditingGallery] =
    useState<Partial<CmsGalleryItem> | null>(null);
  const [editingProduct, setEditingProduct] =
    useState<Partial<CmsProduct> | null>(null);
  const [editingMilestone, setEditingMilestone] =
    useState<Partial<CmsMilestone> | null>(null);
  const [leadNoteDraft, setLeadNoteDraft] = useState<Record<number, string>>({});

  const showNotice = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 4000);
  };

  const apiFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers: Record<string, string> = {
        Accept: 'application/json',
        ...(options.headers as Record<string, string>),
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      if (!(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }
      const res = await fetch(url, { ...options, headers });
      if (res.status === 401) {
        localStorage.removeItem('inv_admin_token');
        setToken('');
        throw new Error('Unauthorized');
      }
      return res.json();
    },
    [token]
  );

  const loadAdminBundle = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const dash = await apiFetch('/api/v1/admin/dashboard');
      if (dash?.metrics) setMetrics(dash.metrics);
      if (dash?.activity_logs) setLogs(dash.activity_logs);
      if (dash?.settings) setSettingsForm(dash.settings);
      if (Array.isArray(dash?.milestones)) setMilestones(dash.milestones);
      if (Array.isArray(dash?.team)) setTeam(dash.team);
      if (Array.isArray(dash?.disciplines)) setDisciplines(dash.disciplines);
      if (Array.isArray(dash?.events)) setEvents(dash.events);
      if (Array.isArray(dash?.gallery)) setGalleryItems(dash.gallery);
      if (Array.isArray(dash?.products)) setProducts(dash.products);
      if (Array.isArray(dash?.leads)) setLeads(dash.leads);
      if (Array.isArray(dash?.media)) setMediaList(dash.media);
    } catch {
      // Fallback to current public state if offline
    } finally {
      setLoading(false);
    }
  }, [apiFetch, token]);

  useEffect(() => {
    if (token) {
      loadAdminBundle();
    }
  }, [token, loadAdminBundle]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/v1/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.token) {
        setLoginError(data.message || 'Invalid credentials.');
        return;
      }
      localStorage.setItem('inv_admin_token', data.token);
      setToken(data.token);
      showNotice('Signed in to Inventive Sports Laravel CMS.');
    } catch {
      setLoginError('Unable to reach Laravel API server.');
    }
  };

  const handleLogout = async () => {
    try {
      await apiFetch('/api/v1/admin/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    localStorage.removeItem('inv_admin_token');
    setToken('');
  };

  const handleFileUpload = async (
    file: File,
    folder: string,
    onUploaded: (url: string) => void
  ) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', folder);
    fd.append('title', file.name);
    try {
      const data = await apiFetch('/api/v1/admin/media/upload', {
        method: 'POST',
        body: fd,
      });
      if (data?.url) {
        onUploaded(data.url);
        showNotice(`Uploaded ${file.name} to ${data.url}`);
        await loadAdminBundle();
        await refreshPublicData();
      }
    } catch {
      showNotice('Upload failed.');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/api/v1/admin/settings', {
      method: 'POST',
      body: JSON.stringify({ settings: settingsForm }),
    });
    await refreshPublicData();
    await loadAdminBundle();
    showNotice('Website settings saved to Laravel database.');
  };

  const handleSaveMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone) return;
    const url = editingMilestone.id
      ? `/api/v1/admin/milestones/${editingMilestone.id}`
      : '/api/v1/admin/milestones';
    await apiFetch(url, {
      method: 'POST',
      body: JSON.stringify(editingMilestone),
    });
    setEditingMilestone(null);
    await refreshPublicData();
    await loadAdminBundle();
    showNotice('About timeline milestone saved.');
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    const url = editingMember.id
      ? `/api/v1/admin/team/${editingMember.id}`
      : '/api/v1/admin/team';
    await apiFetch(url, {
      method: 'POST',
      body: JSON.stringify(editingMember),
    });
    setEditingMember(null);
    await refreshPublicData();
    await loadAdminBundle();
    showNotice('Team profile saved.');
  };

  const handleDeleteMember = async (id: number) => {
    await apiFetch(`/api/v1/admin/team/${id}`, { method: 'DELETE' });
    await refreshPublicData();
    await loadAdminBundle();
    showNotice('Team member removed.');
  };

  const handleSaveDiscipline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDiscipline) return;
    const url = editingDiscipline.id
      ? `/api/v1/admin/disciplines/${editingDiscipline.id}`
      : '/api/v1/admin/disciplines';
    await apiFetch(url, {
      method: 'POST',
      body: JSON.stringify(editingDiscipline),
    });
    setEditingDiscipline(null);
    await refreshPublicData();
    await loadAdminBundle();
    showNotice('Discipline updated.');
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    const url = editingEvent.id
      ? `/api/v1/admin/events/${editingEvent.id}`
      : '/api/v1/admin/events';
    await apiFetch(url, {
      method: 'POST',
      body: JSON.stringify(editingEvent),
    });
    setEditingEvent(null);
    await refreshPublicData();
    await loadAdminBundle();
    showNotice('Event saved.');
  };

  const handleDeleteEvent = async (id: number) => {
    await apiFetch(`/api/v1/admin/events/${id}`, { method: 'DELETE' });
    await refreshPublicData();
    await loadAdminBundle();
    showNotice('Event deleted.');
  };

  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery) return;
    const url = editingGallery.id
      ? `/api/v1/admin/gallery/${editingGallery.id}`
      : '/api/v1/admin/gallery';
    await apiFetch(url, {
      method: 'POST',
      body: JSON.stringify(editingGallery),
    });
    setEditingGallery(null);
    await refreshPublicData();
    await loadAdminBundle();
    showNotice('Gallery item saved.');
  };

  const handleDeleteGalleryItem = async (id: number) => {
    await apiFetch(`/api/v1/admin/gallery/${id}`, { method: 'DELETE' });
    await refreshPublicData();
    await loadAdminBundle();
    showNotice('Gallery item deleted.');
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const url = editingProduct.id
      ? `/api/v1/admin/products/${editingProduct.id}`
      : '/api/v1/admin/products';
    await apiFetch(url, {
      method: 'POST',
      body: JSON.stringify(editingProduct),
    });
    setEditingProduct(null);
    await refreshPublicData();
    await loadAdminBundle();
    showNotice('Shop product saved.');
  };

  const handleDeleteProduct = async (id: number) => {
    await apiFetch(`/api/v1/admin/products/${id}`, { method: 'DELETE' });
    await refreshPublicData();
    await loadAdminBundle();
    showNotice('Product deleted.');
  };

  const handleUpdateLead = async (
    leadId: number,
    status: string,
    note?: string
  ) => {
    await apiFetch(`/api/v1/admin/leads/${leadId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, note }),
    });
    setLeadNoteDraft((prev) => ({ ...prev, [leadId]: '' }));
    await loadAdminBundle();
    showNotice('Lead updated.');
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#101010] text-[#FFFFFF] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#161616] border border-[#2A2A2A] p-8 sm:p-10 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <img
              src="/images/brand/inventive-sports-logo.png"
              alt="Inventive Sports"
              className="h-10 w-auto bg-[#FFFFFF] p-1"
            />
            <span className="font-tech-code text-[10px] text-[#D71920] border border-[#D71920]/40 px-2.5 py-1">
              LARAVEL 13 CMS
            </span>
          </div>

          <h1 className="font-display font-bold text-2xl text-[#FFFFFF]">
            Admin Control Panel
          </h1>
          <p className="mt-1 text-xs text-[#A0A0A0]">
            Sign in to manage website content, leadership photos, sports,
            events, gallery, shop products, and leads.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block font-mono-label text-[11px] text-[#D4D4D4] mb-1.5">
                ADMIN EMAIL
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#101010] border border-[#2A2A2A] text-sm text-[#FFFFFF]"
              />
            </div>

            <div>
              <label className="block font-mono-label text-[11px] text-[#D4D4D4] mb-1.5">
                PASSWORD
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#101010] border border-[#2A2A2A] text-sm text-[#FFFFFF]"
              />
            </div>

            {loginError && (
              <p className="text-xs text-[#D71920] font-medium">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs hover:bg-[#FFFFFF] hover:text-[#151515] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>SIGN IN TO ADMIN PANEL</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#2A2A2A] flex items-center justify-between text-xs text-[#8E8E8E]">
            <span>Default: admin@inventivesports.co</span>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-[#FFFFFF] hover:text-[#D71920] font-mono-label text-[10px] cursor-pointer"
            >
              ← PUBLIC WEBSITE
            </button>
          </div>
        </div>
      </div>
    );
  }

  const NAV_TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'overview',
      label: 'Dashboard Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'content',
      label: 'Content & Timeline',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'team',
      label: 'Leadership & Squad',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'disciplines',
      label: 'Sports & Arts (7)',
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      id: 'events',
      label: 'Events Manager',
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: 'gallery',
      label: 'Gallery Manager',
      icon: <ImageIcon className="w-4 h-4" />,
    },
    {
      id: 'products',
      label: 'Shop Products',
      icon: <ShoppingBag className="w-4 h-4" />,
    },
    {
      id: 'leads',
      label: `Leads (${leads.length})`,
      icon: <Mail className="w-4 h-4" />,
    },
    {
      id: 'media',
      label: 'Media & Uploads',
      icon: <FolderKanban className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#151515] flex flex-col">
      <header className="bg-[#101010] text-[#FFFFFF] border-b border-[#242424] px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src="/images/brand/inventive-sports-logo.png"
            alt="Inventive Sports"
            className="h-9 w-auto bg-[#FFFFFF] p-1"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm sm:text-base">
                INVENTIVE SPORTS CMS
              </span>
              <span className="px-2 py-0.5 bg-[#D71920] text-[#FFFFFF] font-tech-code text-[9px]">
                LARAVEL 13 API
              </span>
            </div>
            <p className="text-[11px] text-[#A0A0A0]">
              Live SQLite Database Management • Changes reflect immediately on
              public pages
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              loadAdminBundle();
              refreshPublicData();
              showNotice('Synced with Laravel database.');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1D1D1D] border border-[#333333] font-mono-label text-[10px] text-[#FFFFFF] hover:border-[#D71920] cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>SYNC</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FFFFFF] text-[#151515] font-mono-label text-[10px] hover:bg-[#D71920] hover:text-[#FFFFFF] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>VIEW LIVE WEBSITE</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#D71920] text-[#FFFFFF] font-mono-label text-[10px] cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>SIGN OUT</span>
          </button>
        </div>
      </header>

      {toast && (
        <div className="fixed bottom-5 right-5 z-[100] bg-[#151515] text-[#FFFFFF] border-l-4 border-[#D71920] px-5 py-3.5 shadow-xl flex items-center gap-2.5 text-xs">
          <CheckCircle2 className="w-4 h-4 text-[#D71920]" />
          <span>{toast}</span>
        </div>
      )}

      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 space-y-1.5">
          {NAV_TABS.map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 font-mono-label text-xs border text-left transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#151515] text-[#FFFFFF] border-[#151515]'
                    : 'bg-[#FFFFFF] text-[#151515] border-[#E7E7E7] hover:border-[#D71920]'
                }`}
              >
                <span className={active ? 'text-[#D71920]' : 'text-[#626262]'}>
                  {t.icon}
                </span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </aside>

        <div className="lg:col-span-9 space-y-8">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="bg-[#FFFFFF] border border-[#E7E7E7] p-6 sm:p-8">
                <span className="font-mono-label text-xs text-[#D71920]">
                  SYSTEM METRICS // LIVE LARAVEL DATABASE
                </span>
                <h2 className="mt-1 heading-scene text-[#151515]">
                  Academy Operations Overview
                </h2>

                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    {
                      label: 'TOTAL LEADS',
                      val: metrics.total_leads ?? leads.length,
                    },
                    {
                      label: 'NEW ENQUIRIES',
                      val:
                        metrics.new_enquiries ??
                        leads.filter((l) => l.status === 'New').length,
                    },
                    {
                      label: 'PUBLISHED EVENTS',
                      val: metrics.upcoming_events ?? events.length,
                    },
                    {
                      label: 'GALLERY PHOTOS',
                      val:
                        metrics.published_gallery_items ?? galleryItems.length,
                    },
                    {
                      label: 'SHOP PRODUCTS',
                      val: metrics.active_products ?? products.length,
                    },
                    {
                      label: 'DISCIPLINES',
                      val: disciplines.length,
                    },
                    {
                      label: 'LEADERS & SQUAD',
                      val: team.length,
                    },
                    {
                      label: 'MEDIA FILES',
                      val: mediaList.length,
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-4 bg-[#F5F5F5] border border-[#E7E7E7]"
                    >
                      <span className="font-tech-code text-[10px] text-[#626262]">
                        {stat.label}
                      </span>
                      <div className="mt-1 font-display font-extrabold text-2xl text-[#151515]">
                        {stat.val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E7E7E7] p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-[#D71920]" />
                  <h3 className="font-display font-bold text-lg">
                    Recent Admin &amp; Lead Activity Log
                  </h3>
                </div>
                <div className="divide-y divide-[#E7E7E7] text-xs">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <span className="font-tech-code text-[10px] text-[#D71920] font-bold mr-2">
                          [{log.actor_name}]
                        </span>
                        <span className="text-[#151515] font-medium">
                          {log.action}
                        </span>
                        {log.details && (
                          <span className="text-[#626262] ml-2">
                            — {log.details}
                          </span>
                        )}
                      </div>
                      <span className="font-tech-code text-[10px] text-[#626262]">
                        {log.created_at}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WEBSITE CONTENT & ABOUT TIMELINE */}
          {activeTab === 'content' && (
            <div className="space-y-8">
              <form
                onSubmit={handleSaveSettings}
                className="bg-[#FFFFFF] border border-[#E7E7E7] p-6 sm:p-8 space-y-5"
              >
                <div className="flex items-center justify-between border-b border-[#E7E7E7] pb-4">
                  <div>
                    <span className="font-mono-label text-xs text-[#D71920]">
                      MODULE A // GLOBAL CONTENT &amp; SETTINGS
                    </span>
                    <h2 className="font-display font-bold text-xl">
                      Hero, Mission, Vision &amp; Contact Settings
                    </h2>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs px-5 py-2.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE SETTINGS</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(settingsForm).map(([key, val]) => (
                    <div key={key} className="sm:col-span-1">
                      <label className="block font-mono-label text-[10px] text-[#626262] mb-1">
                        {key.toUpperCase()}
                      </label>
                      <input
                        type="text"
                        value={val || ''}
                        onChange={(e) =>
                          setSettingsForm((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        className="w-full px-3.5 py-2 bg-[#F5F5F5] border border-[#E7E7E7] text-xs text-[#151515]"
                      />
                    </div>
                  ))}
                </div>
              </form>

              <div className="bg-[#FFFFFF] border border-[#E7E7E7] p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono-label text-xs text-[#D71920]">
                      ABOUT US SCROLL TIMELINE
                    </span>
                    <h3 className="font-display font-bold text-xl">
                      Timeline Milestones (2018, Multidisciplinary, Facilities)
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingMilestone({
                        year: '2026',
                        eyebrow: 'NEW MILESTONE',
                        heading: '',
                        description: '',
                        image_url: '/images/about/founded.png',
                        display_order: milestones.length + 1,
                        is_published: true,
                      })
                    }
                    className="inline-flex items-center gap-1.5 bg-[#151515] text-[#FFFFFF] font-mono-label text-xs px-4 py-2.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ADD MILESTONE</span>
                  </button>
                </div>

                {editingMilestone && (
                  <form
                    onSubmit={handleSaveMilestone}
                    className="p-5 bg-[#F5F5F5] border border-[#151515] space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="Year / Badge"
                        value={editingMilestone.year || ''}
                        onChange={(e) =>
                          setEditingMilestone({
                            ...editingMilestone,
                            year: e.target.value,
                          })
                        }
                        className="px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Eyebrow (e.g. THE FOUNDATION)"
                        value={editingMilestone.eyebrow || ''}
                        onChange={(e) =>
                          setEditingMilestone({
                            ...editingMilestone,
                            eyebrow: e.target.value,
                          })
                        }
                        className="px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Heading"
                        value={editingMilestone.heading || ''}
                        onChange={(e) =>
                          setEditingMilestone({
                            ...editingMilestone,
                            heading: e.target.value,
                          })
                        }
                        className="px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                      />
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Milestone description"
                      value={editingMilestone.description || ''}
                      onChange={(e) =>
                        setEditingMilestone({
                          ...editingMilestone,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={editingMilestone.image_url || ''}
                        onChange={(e) =>
                          setEditingMilestone({
                            ...editingMilestone,
                            image_url: e.target.value,
                          })
                        }
                        className="flex-1 px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                      />
                      <label className="px-3.5 py-2 bg-[#151515] text-[#FFFFFF] font-mono-label text-[10px] cursor-pointer">
                        UPLOAD PHOTO
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              handleFileUpload(f, 'about', (url) =>
                                setEditingMilestone((prev) => ({
                                  ...prev,
                                  image_url: url,
                                }))
                              );
                            }
                          }}
                        />
                      </label>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs cursor-pointer"
                      >
                        SAVE MILESTONE
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {milestones.map((ms) => (
                    <div
                      key={ms.id}
                      className="border border-[#E7E7E7] p-4 bg-[#F5F5F5] flex flex-col justify-between"
                    >
                      <div>
                        <img
                          src={ms.image_url}
                          alt={ms.heading}
                          className="w-full h-36 object-cover border border-[#E7E7E7] mb-3"
                        />
                        <span className="font-tech-code text-[10px] text-[#D71920] font-bold">
                          {ms.eyebrow}
                        </span>
                        <h4 className="font-display font-bold text-base mt-1">
                          {ms.heading}
                        </h4>
                        <p className="text-xs text-[#626262] mt-1 line-clamp-3">
                          {ms.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingMilestone(ms)}
                        className="mt-4 w-full py-2 bg-[#FFFFFF] border border-[#151515] font-mono-label text-[10px] cursor-pointer"
                      >
                        EDIT / REPLACE PHOTO
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LEADERSHIP & SQUAD */}
          {activeTab === 'team' && (
            <div className="bg-[#FFFFFF] border border-[#E7E7E7] p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E7E7E7] pb-4">
                <div>
                  <span className="font-mono-label text-xs text-[#D71920]">
                    MODULE B // FOUNDERS, LEADERSHIP &amp; COACHING SQUAD
                  </span>
                  <h2 className="font-display font-bold text-xl">
                    Manage Leadership (4) &amp; Squad Coaches (9)
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingMember({
                      category: 'squad',
                      name: '',
                      designation: 'Sports Expert',
                      discipline: 'Football',
                      biography: '',
                      portrait_url: '/images/leadership/yuvaraj.png',
                      display_order: team.length + 1,
                      is_published: true,
                    })
                  }
                  className="inline-flex items-center gap-1.5 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs px-4 py-2.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD TEAM MEMBER</span>
                </button>
              </div>

              {editingMember && (
                <form
                  onSubmit={handleSaveMember}
                  className="p-5 bg-[#F5F5F5] border border-[#151515] space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <select
                      value={editingMember.category || 'leadership'}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          category: e.target.value as 'leadership' | 'squad',
                        })
                      }
                      className="px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    >
                      <option value="leadership">Leadership</option>
                      <option value="squad">Coaching Squad</option>
                    </select>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={editingMember.name || ''}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          name: e.target.value,
                        })
                      }
                      className="px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Designation (e.g. Founder & CEO)"
                      value={editingMember.designation || ''}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          designation: e.target.value,
                        })
                      }
                      className="px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Discipline"
                      value={editingMember.discipline || ''}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          discipline: e.target.value,
                        })
                      }
                      className="px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Biography"
                    value={editingMember.biography || ''}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        biography: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      placeholder="Portrait URL"
                      value={editingMember.portrait_url || ''}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          portrait_url: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    />
                    <label className="px-3.5 py-2 bg-[#151515] text-[#FFFFFF] font-mono-label text-[10px] cursor-pointer">
                      UPLOAD PORTRAIT
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            handleFileUpload(f, 'leadership', (url) =>
                              setEditingMember((prev) => ({
                                ...prev,
                                portrait_url: url,
                              }))
                            );
                          }
                        }}
                      />
                    </label>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs cursor-pointer"
                    >
                      SAVE MEMBER
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.map((member) => (
                  <div
                    key={member.id}
                    className="border border-[#E7E7E7] p-4 bg-[#F5F5F5] flex items-center gap-4"
                  >
                    <img
                      src={member.portrait_url}
                      alt={member.name}
                      className="w-16 h-16 object-cover object-top border border-[#E7E7E7] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-tech-code text-[9px] text-[#D71920] font-bold">
                        {member.category.toUpperCase()} //{' '}
                        {member.discipline.toUpperCase()}
                      </span>
                      <h4 className="font-display font-bold text-sm truncate">
                        {member.name}
                      </h4>
                      <p className="text-xs text-[#626262] truncate">
                        {member.designation}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingMember(member)}
                          className="px-2.5 py-1 bg-[#FFFFFF] border border-[#151515] font-mono-label text-[9px] cursor-pointer"
                        >
                          EDIT
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMember(member.id)}
                          className="p-1 text-[#626262] hover:text-[#D71920] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SPORTS & DISCIPLINES */}
          {activeTab === 'disciplines' && (
            <div className="bg-[#FFFFFF] border border-[#E7E7E7] p-6 sm:p-8 space-y-6">
              <div className="border-b border-[#E7E7E7] pb-4">
                <span className="font-mono-label text-xs text-[#D71920]">
                  MODULE C // SPORTS, GAMES &amp; PERFORMING ARTS
                </span>
                <h2 className="font-display font-bold text-xl">
                  Manage All 7 Academy Disciplines
                </h2>
              </div>

              {editingDiscipline && (
                <form
                  onSubmit={handleSaveDiscipline}
                  className="p-5 bg-[#F5F5F5] border border-[#151515] space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Discipline Name"
                      value={editingDiscipline.name || ''}
                      onChange={(e) =>
                        setEditingDiscipline({
                          ...editingDiscipline,
                          name: e.target.value,
                        })
                      }
                      className="px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Scene Heading (e.g. OWN THE FIELD.)"
                      value={editingDiscipline.scene_heading || ''}
                      onChange={(e) =>
                        setEditingDiscipline({
                          ...editingDiscipline,
                          scene_heading: e.target.value,
                        })
                      }
                      className="px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Tagline"
                      value={editingDiscipline.tagline || ''}
                      onChange={(e) =>
                        setEditingDiscipline({
                          ...editingDiscipline,
                          tagline: e.target.value,
                        })
                      }
                      className="px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Short Description"
                    value={editingDiscipline.short_description || ''}
                    onChange={(e) =>
                      setEditingDiscipline({
                        ...editingDiscipline,
                        short_description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      placeholder="Cover Image URL"
                      value={editingDiscipline.cover_image || ''}
                      onChange={(e) =>
                        setEditingDiscipline({
                          ...editingDiscipline,
                          cover_image: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    />
                    <label className="px-3.5 py-2 bg-[#151515] text-[#FFFFFF] font-mono-label text-[10px] cursor-pointer">
                      UPLOAD COVER
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            handleFileUpload(f, 'sports', (url) =>
                              setEditingDiscipline((prev) => ({
                                ...prev,
                                cover_image: url,
                              }))
                            );
                          }
                        }}
                      />
                    </label>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs cursor-pointer"
                    >
                      SAVE DISCIPLINE
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {disciplines.map((disc) => (
                  <div
                    key={disc.id}
                    className="border border-[#E7E7E7] p-4 bg-[#F5F5F5] flex items-center gap-4"
                  >
                    <img
                      src={disc.cover_image}
                      alt={disc.name}
                      className="w-24 h-16 object-cover border border-[#E7E7E7]"
                    />
                    <div className="flex-1">
                      <h4 className="font-display font-bold text-base">
                        {disc.name} — {disc.scene_heading}
                      </h4>
                      <p className="text-xs text-[#626262] line-clamp-1">
                        {disc.short_description}
                      </p>
                      <button
                        type="button"
                        onClick={() => setEditingDiscipline(disc)}
                        className="mt-2 px-3 py-1 bg-[#FFFFFF] border border-[#151515] font-mono-label text-[10px] cursor-pointer"
                      >
                        EDIT SPORT
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: EVENTS MANAGER */}
          {activeTab === 'events' && (
            <div className="bg-[#FFFFFF] border border-[#E7E7E7] p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#E7E7E7] pb-4">
                <div>
                  <span className="font-mono-label text-xs text-[#D71920]">
                    MODULE D // EVENTS MANAGEMENT
                  </span>
                  <h2 className="font-display font-bold text-xl">
                    Academy Tournaments &amp; Showcases
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingEvent({
                      title: '',
                      discipline: 'Football',
                      short_description: '',
                      description: '',
                      cover_image: '/images/sports/football-main.jpg',
                      start_date: '2026-12-20',
                      start_time: '09:00 AM',
                      end_time: '02:00 PM',
                      venue: 'Kammanahalli Center, Bangalore',
                      is_featured: true,
                      status: 'published',
                    })
                  }
                  className="inline-flex items-center gap-1.5 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs px-4 py-2.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>CREATE EVENT</span>
                </button>
              </div>

              {editingEvent && (
                <form
                  onSubmit={handleSaveEvent}
                  className="p-5 bg-[#F5F5F5] border border-[#151515] space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Event Title"
                      value={editingEvent.title || ''}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          title: e.target.value,
                        })
                      }
                      className="px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Discipline (e.g. Chess, Football)"
                      value={editingEvent.discipline || ''}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          discipline: e.target.value,
                        })
                      }
                      className="px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    />
                    <input
                      type="date"
                      value={editingEvent.start_date || ''}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          start_date: e.target.value,
                        })
                      }
                      className="px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Venue"
                      value={editingEvent.venue || ''}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          venue: e.target.value,
                        })
                      }
                      className="px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Start Time"
                      value={editingEvent.start_time || ''}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          start_time: e.target.value,
                        })
                      }
                      className="px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    />
                    <select
                      value={editingEvent.status || 'published'}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          status: e.target.value as 'published' | 'draft',
                        })
                      }
                      className="px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Short Description"
                    value={editingEvent.short_description || ''}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        short_description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs cursor-pointer"
                    >
                      SAVE EVENT
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingEvent(null)}
                      className="px-4 py-2 bg-[#FFFFFF] border border-[#E7E7E7] font-mono-label text-xs cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 bg-[#F5F5F5] border border-[#E7E7E7] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <span className="font-tech-code text-[10px] text-[#D71920] font-bold">
                        {ev.status.toUpperCase()} // {ev.start_date} //{' '}
                        {ev.discipline}
                      </span>
                      <h4 className="font-display font-bold text-base">
                        {ev.title}
                      </h4>
                      <p className="text-xs text-[#626262]">{ev.venue}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingEvent(ev)}
                        className="px-3 py-1.5 bg-[#FFFFFF] border border-[#151515] font-mono-label text-[10px] cursor-pointer"
                      >
                        EDIT
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="px-3 py-1.5 bg-[#FFFFFF] border border-[#E7E7E7] text-[#D71920] font-mono-label text-[10px] cursor-pointer"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: GALLERY MANAGER */}
          {activeTab === 'gallery' && (
            <div className="bg-[#FFFFFF] border border-[#E7E7E7] p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#E7E7E7] pb-4">
                <div>
                  <span className="font-mono-label text-xs text-[#D71920]">
                    MODULE E // GALLERY MANAGEMENT
                  </span>
                  <h2 className="font-display font-bold text-xl">
                    Academy Photos &amp; Media Items
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingGallery({
                      title: '',
                      caption: '',
                      category: 'Training Sessions',
                      discipline: 'Football',
                      media_url: '/images/sports/football-main.jpg',
                      is_featured: true,
                      is_published: true,
                    })
                  }
                  className="inline-flex items-center gap-1.5 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs px-4 py-2.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD GALLERY PHOTO</span>
                </button>
              </div>

              {editingGallery && (
                <form
                  onSubmit={handleSaveGalleryItem}
                  className="p-5 bg-[#F5F5F5] border border-[#151515] space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Photo Title"
                      value={editingGallery.title || ''}
                      onChange={(e) =>
                        setEditingGallery({
                          ...editingGallery,
                          title: e.target.value,
                        })
                      }
                      className="px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Category (Training Sessions, Competitions...)"
                      value={editingGallery.category || ''}
                      onChange={(e) =>
                        setEditingGallery({
                          ...editingGallery,
                          category: e.target.value,
                        })
                      }
                      className="px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Discipline"
                      value={editingGallery.discipline || ''}
                      onChange={(e) =>
                        setEditingGallery({
                          ...editingGallery,
                          discipline: e.target.value,
                        })
                      }
                      className="px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      placeholder="Media URL"
                      value={editingGallery.media_url || ''}
                      onChange={(e) =>
                        setEditingGallery({
                          ...editingGallery,
                          media_url: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    />
                    <label className="px-3.5 py-2 bg-[#151515] text-[#FFFFFF] font-mono-label text-[10px] cursor-pointer">
                      UPLOAD IMAGE
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            handleFileUpload(f, 'gallery', (url) =>
                              setEditingGallery((prev) => ({
                                ...prev,
                                media_url: url,
                              }))
                            );
                          }
                        }}
                      />
                    </label>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs cursor-pointer"
                    >
                      SAVE PHOTO
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-[#E7E7E7] p-3 bg-[#F5F5F5] flex flex-col justify-between"
                  >
                    <div>
                      <img
                        src={item.media_url}
                        alt={item.title}
                        className="w-full h-32 object-cover border border-[#E7E7E7]"
                      />
                      <div className="mt-2 font-tech-code text-[9px] text-[#D71920]">
                        {item.discipline} // {item.category}
                      </div>
                      <h4 className="font-display font-bold text-xs mt-0.5">
                        {item.title}
                      </h4>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setEditingGallery(item)}
                        className="px-2.5 py-1 bg-[#FFFFFF] border border-[#151515] font-mono-label text-[9px] cursor-pointer"
                      >
                        EDIT
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteGalleryItem(item.id)}
                        className="p-1 text-[#626262] hover:text-[#D71920] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SHOP PRODUCTS */}
          {activeTab === 'products' && (
            <div className="bg-[#FFFFFF] border border-[#E7E7E7] p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#E7E7E7] pb-4">
                <div>
                  <span className="font-mono-label text-xs text-[#D71920]">
                    MODULE F // SHOP &amp; MERCHANDISE MANAGEMENT
                  </span>
                  <h2 className="font-display font-bold text-xl">
                    Academy Apparel &amp; Sports Equipment
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingProduct({
                      name: '',
                      category_name: 'Academy Apparel',
                      sku: `INV-PRD-00${products.length + 1}`,
                      description: '',
                      price: 1499,
                      sale_price: null,
                      stock_quantity: 25,
                      image_url: '/images/athletics/athletics-main.jpg',
                      is_featured: true,
                      is_published: true,
                    })
                  }
                  className="inline-flex items-center gap-1.5 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs px-4 py-2.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD PRODUCT</span>
                </button>
              </div>

              {editingProduct && (
                <form
                  onSubmit={handleSaveProduct}
                  className="p-5 bg-[#F5F5F5] border border-[#151515] space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Product Name"
                      value={editingProduct.name || ''}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          name: e.target.value,
                        })
                      }
                      className="px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    />
                    <input
                      type="text"
                      placeholder="SKU"
                      value={editingProduct.sku || ''}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          sku: e.target.value,
                        })
                      }
                      className="px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Price (₹)"
                      value={editingProduct.price || 0}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: Number(e.target.value),
                        })
                      }
                      className="px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Stock Quantity"
                      value={editingProduct.stock_quantity || 0}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          stock_quantity: Number(e.target.value),
                        })
                      }
                      className="px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Product Description"
                    value={editingProduct.description || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      placeholder="Product Image URL"
                      value={editingProduct.image_url || ''}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          image_url: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs cursor-pointer"
                    >
                      SAVE PRODUCT
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 bg-[#F5F5F5] border border-[#E7E7E7] flex items-center gap-4"
                  >
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      className="w-20 h-20 object-cover border border-[#E7E7E7]"
                    />
                    <div className="flex-1">
                      <span className="font-tech-code text-[10px] text-[#D71920]">
                        {prod.sku} // ₹{prod.sale_price ?? prod.price} (
                        {prod.stock_quantity} IN STOCK)
                      </span>
                      <h4 className="font-display font-bold text-sm">
                        {prod.name}
                      </h4>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(prod)}
                          className="px-2.5 py-1 bg-[#FFFFFF] border border-[#151515] font-mono-label text-[9px] cursor-pointer"
                        >
                          EDIT
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1 text-[#626262] hover:text-[#D71920] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: LEADS & ENQUIRIES */}
          {activeTab === 'leads' && (
            <div className="bg-[#FFFFFF] border border-[#E7E7E7] p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E7E7E7] pb-4">
                <div>
                  <span className="font-mono-label text-xs text-[#D71920]">
                    MODULE G // LEADS &amp; ENQUIRIES CRM
                  </span>
                  <h2 className="font-display font-bold text-xl">
                    Website Enquiries &amp; Event Registrations
                  </h2>
                </div>
                <a
                  href={`/api/v1/admin/leads/export/csv?api_token=${token}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#151515] text-[#FFFFFF] font-mono-label text-xs px-4 py-2.5"
                >
                  <Download className="w-4 h-4" />
                  <span>EXPORT CSV</span>
                </a>
              </div>

              <div className="space-y-4">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-5 bg-[#F5F5F5] border border-[#E7E7E7] space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="font-tech-code text-[10px] text-[#D71920] font-bold">
                          #{lead.id} //{' '}
                          {(lead.preferred_discipline || 'General').toUpperCase()}{' '}
                          // {lead.enquiry_type}
                        </span>
                        <h4 className="font-display font-bold text-base">
                          {lead.name} ({lead.email} • {lead.phone})
                        </h4>
                      </div>

                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleUpdateLead(lead.id, e.target.value)
                        }
                        className="px-3 py-1.5 bg-[#FFFFFF] border border-[#151515] font-mono-label text-[10px]"
                      >
                        <option value="New">STATUS: NEW</option>
                        <option value="Contacted">STATUS: CONTACTED</option>
                        <option value="Follow-up">STATUS: FOLLOW-UP</option>
                        <option value="Converted">STATUS: CONVERTED</option>
                        <option value="Closed">STATUS: CLOSED</option>
                      </select>
                    </div>

                    <p className="text-xs text-[#151515] bg-[#FFFFFF] p-3 border border-[#E7E7E7]">
                      {lead.message}
                    </p>

                    {lead.notes && lead.notes.length > 0 && (
                      <div className="space-y-1 pl-3 border-l-2 border-[#D71920]">
                        {lead.notes.map((n) => (
                          <div key={n.id} className="text-[11px] text-[#626262]">
                            <strong>{n.author_name}:</strong> {n.note}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add follow-up note..."
                        value={leadNoteDraft[lead.id] || ''}
                        onChange={(e) =>
                          setLeadNoteDraft((prev) => ({
                            ...prev,
                            [lead.id]: e.target.value,
                          }))
                        }
                        className="flex-1 px-3 py-1.5 bg-[#FFFFFF] border border-[#E7E7E7] text-xs"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateLead(
                            lead.id,
                            lead.status,
                            leadNoteDraft[lead.id]
                          )
                        }
                        className="px-3.5 py-1.5 bg-[#151515] text-[#FFFFFF] font-mono-label text-[10px] cursor-pointer"
                      >
                        ADD NOTE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: MEDIA LIBRARY & UPLOADS */}
          {activeTab === 'media' && (
            <div className="bg-[#FFFFFF] border border-[#E7E7E7] p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E7E7E7] pb-4">
                <div>
                  <span className="font-mono-label text-xs text-[#D71920]">
                    MODULE H // CENTRAL MEDIA LIBRARY
                  </span>
                  <h2 className="font-display font-bold text-xl">
                    Upload &amp; Replace Website Photographs
                  </h2>
                </div>
                <label className="inline-flex items-center gap-2 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs px-5 py-2.5 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>UPLOAD NEW IMAGE</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        handleFileUpload(f, 'uploads', () => {});
                      }
                    }}
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaList.map((med) => (
                  <div
                    key={med.id}
                    className="border border-[#E7E7E7] p-2.5 bg-[#F5F5F5] flex flex-col justify-between"
                  >
                    <div>
                      <img
                        src={med.file_path}
                        alt={med.alt_text || med.title}
                        className="w-full h-32 object-cover border border-[#E7E7E7]"
                      />
                      <div className="mt-2 font-display font-bold text-xs truncate">
                        {med.title}
                      </div>
                      <code className="block mt-1 text-[10px] text-[#626262] truncate">
                        {med.file_path}
                      </code>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(med.file_path);
                        showNotice(`Copied path: ${med.file_path}`);
                      }}
                      className="mt-2 w-full py-1.5 bg-[#FFFFFF] border border-[#151515] font-mono-label text-[9px] cursor-pointer"
                    >
                      COPY PATH
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
