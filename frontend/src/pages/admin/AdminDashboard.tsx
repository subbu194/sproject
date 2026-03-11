import { useState, useEffect, type ReactNode } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../../api/client';
import { setAdminToken } from '../../api/client';

/* ─── Types ─── */
interface TimelineEntry { _id: string; year: string; title: string; description: string; }
interface LogItem { _id: string; date: string; title: string; body: string; tags: string[]; published: boolean; }
interface Thought { _id: string; topic: string; title: string; summary: string; published: boolean; }
interface PressItem { _id: string; outlet: string; title: string; year: string; url: string; }
interface Achievement { _id: string; icon: string; title: string; description: string; year: string; }
interface SocialLinks { whatsapp: string; instagram: string; linkedin: string; twitter: string; email: string; }
interface ContactEntry { _id: string; name: string; email: string; message: string; read: boolean; submittedAt: string; }

/* ─── Sidebar sections ─── */
const SECTIONS = [
  'Story / Timeline', 'Daily Log', 'Thoughts', 'Press',
  'Achievements', 'Connect', 'Contact Submissions',
] as const;

type Section = (typeof SECTIONS)[number];

/* ─── Reusable sub-components ─── */
function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--brown)]/8 bg-[var(--card-bg)] p-6">
      <h3 className="font-['Playfair_Display'] text-lg font-bold text-[var(--brown)]">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function FormInput({ label, value, onChange, type = 'text', placeholder = '' }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">{label}</span>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="h-10 rounded-lg border border-[var(--brown)]/10 bg-[var(--warm-white)] px-3 text-sm text-[var(--brown)] outline-none transition focus:border-[var(--gold)]"
      />
    </label>
  );
}

function FormTextarea({ label, value, onChange, rows = 3, placeholder = '' }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">{label}</span>
      <textarea
        value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder}
        className="rounded-lg border border-[var(--brown)]/10 bg-[var(--warm-white)] px-3 py-2 text-sm text-[var(--brown)] outline-none transition focus:border-[var(--gold)]"
      />
    </label>
  );
}

function Btn({ onClick, children, variant = 'primary', disabled = false }: {
  onClick: () => void; children: ReactNode; variant?: 'primary' | 'danger' | 'secondary'; disabled?: boolean;
}) {
  const base = 'rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50';
  const styles = {
    primary: 'bg-[var(--gold)] text-white hover:bg-[var(--gold-light)]',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    secondary: 'border border-[var(--brown)]/10 bg-[var(--warm-white)] text-[var(--brown)] hover:bg-[var(--cream)]',
  };
  return <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]}`}>{children}</button>;
}

/* helper to extract data from { success, data } envelope */
function extractData(res: any, fallback: any = []) {
  return res.data?.data ?? res.data ?? fallback;
}

/* ═══════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════ */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read active section from URL or default to first section
  const sectionFromUrl = searchParams.get('section') || '';
  const activeSection: Section = (SECTIONS as readonly string[]).includes(sectionFromUrl)
    ? (sectionFromUrl as Section)
    : SECTIONS[0];

  const setActiveSection = (s: Section) => {
    setSearchParams({ section: s });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(undefined);
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-[var(--warm-white)]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 flex h-full w-60 flex-col border-r border-[var(--brown)]/8 bg-[var(--card-bg)]">
        <div className="p-5">
          <div className="font-['Playfair_Display'] text-lg font-bold text-[var(--brown)]">Admin</div>
          <div className="mt-0.5 text-xs text-[var(--muted)]">Dashboard</div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3">
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition
                ${activeSection === s
                  ? 'bg-[var(--gold)]/10 text-[var(--gold)]'
                  : 'text-[var(--muted)] hover:bg-[var(--cream)] hover:text-[var(--brown)]'
                }`}
            >
              {s}
            </button>
          ))}
        </nav>
        <div className="border-t border-[var(--brown)]/8 p-4 space-y-2">
          <NavLink to="/" className="block text-xs text-[var(--muted)] hover:text-[var(--brown)] transition">
            ← Back to site
          </NavLink>
          <button onClick={handleLogout} className="text-xs font-semibold text-red-500 hover:text-red-600 transition">
            Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-60 flex-1 p-8">
        <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[var(--brown)]">{activeSection}</h2>
        <div className="mt-6">
          {activeSection === 'Story / Timeline' && <TimelineManager />}
          {activeSection === 'Daily Log' && <DailyLogManager />}
          {activeSection === 'Thoughts' && <ThoughtsManager />}
          {activeSection === 'Press' && <PressManager />}
          {activeSection === 'Achievements' && <AchievementsManager />}
          {activeSection === 'Connect' && <ConnectManager />}
          {activeSection === 'Contact Submissions' && <ContactsViewer />}
        </div>
      </main>
    </div>
  );
}

/* ─── TIMELINE MANAGER ─── */
function TimelineManager() {
  const [items, setItems] = useState<TimelineEntry[]>([]);
  const [form, setForm] = useState({ year: '', title: '', description: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    apiClient.get('/story/timeline').then((r) => setItems(extractData(r))).catch(() => {});
  }, []);

  const addItem = async () => {
    if (!form.year || !form.title || !form.description) return;
    try {
      const r = await apiClient.post('/story/timeline', form);
      setItems([...items, extractData(r, form)]);
      setForm({ year: '', title: '', description: '' }); setMsg('Added!');
    } catch { setMsg('Error.'); }
  };

  const removeItem = async (id: string) => {
    try { await apiClient.delete(`/story/timeline/${id}`); setItems(items.filter((i) => i._id !== id)); } catch {}
  };

  return (
    <SectionCard title="Timeline Entries">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className="flex items-start justify-between rounded-lg border border-[var(--brown)]/8 bg-white p-3">
            <div>
              <span className="text-xs font-bold text-[var(--gold)]">{item.year}</span>
              <div className="text-sm font-semibold text-[var(--brown)]">{item.title}</div>
              <div className="text-xs text-[var(--muted)]">{item.description}</div>
            </div>
            <Btn onClick={() => removeItem(item._id)} variant="danger">Delete</Btn>
          </div>
        ))}
        <div className="grid gap-3 sm:grid-cols-3">
          <FormInput label="Year" value={form.year} onChange={(v) => setForm({ ...form, year: v })} placeholder="2024" />
          <FormInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <FormInput label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
        </div>
        <div className="flex items-center gap-3">
          <Btn onClick={addItem}>Add Entry</Btn>
          {msg && <span className="text-sm text-[var(--gold)]">{msg}</span>}
        </div>
      </div>
    </SectionCard>
  );
}

/* ─── DAILY LOG MANAGER ─── */
function DailyLogManager() {
  const [items, setItems] = useState<LogItem[]>([]);
  const [form, setForm] = useState({ date: '', title: '', body: '', tags: '', published: true });

  useEffect(() => { apiClient.get('/log/all').then((r) => setItems(extractData(r))).catch(() => {}); }, []);

  const add = async () => {
    if (!form.title || !form.body) return;
    const payload = { ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) };
    try { const r = await apiClient.post('/log', payload); setItems([extractData(r, payload), ...items]); setForm({ date: '', title: '', body: '', tags: '', published: true }); } catch {}
  };

  const togglePublish = async (id: string) => {
    try {
      const r = await apiClient.patch(`/log/${id}/publish`, {});
      const updated = extractData(r);
      setItems(items.map((i) => i._id === id ? updated : i));
    } catch {}
  };

  const remove = async (id: string) => {
    try { await apiClient.delete(`/log/${id}`); setItems(items.filter((i) => i._id !== id)); } catch {}
  };

  return (
    <SectionCard title="Manage Daily Log">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className="flex items-start justify-between rounded-lg border border-[var(--brown)]/8 bg-white p-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-[var(--brown)]">{item.title}</div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${item.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {item.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="text-xs text-[var(--muted)]">{item.date ? new Date(item.date).toLocaleDateString() : ''} · {item.tags?.join(', ')}</div>
            </div>
            <div className="flex items-center gap-2">
              <Btn onClick={() => togglePublish(item._id)} variant="secondary">{item.published ? 'Unpublish' : 'Publish'}</Btn>
              <Btn onClick={() => remove(item._id)} variant="danger">Delete</Btn>
            </div>
          </div>
        ))}
        <div className="grid gap-3 sm:grid-cols-2">
          <FormInput label="Date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} type="date" />
          <FormInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        </div>
        <FormTextarea label="Body" value={form.body} onChange={(v) => setForm({ ...form, body: v })} />
        <FormInput label="Tags (comma-separated)" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} placeholder="Leadership, Impact" />
        <Btn onClick={add}>Add Entry</Btn>
      </div>
    </SectionCard>
  );
}

/* ─── THOUGHTS MANAGER ─── */
function ThoughtsManager() {
  const [items, setItems] = useState<Thought[]>([]);
  const [form, setForm] = useState({ topic: '', title: '', summary: '' });

  useEffect(() => { apiClient.get('/thoughts/all').then((r) => setItems(extractData(r))).catch(() => {}); }, []);

  const add = async () => {
    if (!form.title || !form.topic || !form.summary) return;
    try { const r = await apiClient.post('/thoughts', { ...form, published: true }); setItems([...items, extractData(r, form)]); setForm({ topic: '', title: '', summary: '' }); } catch {}
  };

  const togglePublish = async (id: string) => {
    try {
      const r = await apiClient.patch(`/thoughts/${id}/publish`, {});
      const updated = extractData(r);
      setItems(items.map((i) => i._id === id ? updated : i));
    } catch {}
  };

  const remove = async (id: string) => {
    try { await apiClient.delete(`/thoughts/${id}`); setItems(items.filter((i) => i._id !== id)); } catch {}
  };

  return (
    <SectionCard title="Manage Thoughts">
      <div className="space-y-3">
        {items.map((t) => (
          <div key={t._id} className="flex items-start justify-between rounded-lg border border-[var(--brown)]/8 bg-white p-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="text-xs font-bold text-[var(--gold)]">{t.topic}</div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${t.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {t.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="text-sm font-semibold text-[var(--brown)]">{t.title}</div>
            </div>
            <div className="flex items-center gap-2">
              <Btn onClick={() => togglePublish(t._id)} variant="secondary">{t.published ? 'Unpublish' : 'Publish'}</Btn>
              <Btn onClick={() => remove(t._id)} variant="danger">Delete</Btn>
            </div>
          </div>
        ))}
        <div className="grid gap-3 sm:grid-cols-2">
          <FormInput label="Topic" value={form.topic} onChange={(v) => setForm({ ...form, topic: v })} placeholder="Philanthropy" />
          <FormInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        </div>
        <FormTextarea label="Summary" value={form.summary} onChange={(v) => setForm({ ...form, summary: v })} />
        <Btn onClick={add}>Add Thought</Btn>
      </div>
    </SectionCard>
  );
}

/* ─── PRESS MANAGER ─── */
function PressManager() {
  const [items, setItems] = useState<PressItem[]>([]);
  const [form, setForm] = useState({ outlet: '', title: '', year: '', url: '' });

  useEffect(() => { apiClient.get('/press').then((r) => setItems(extractData(r))).catch(() => {}); }, []);

  const add = async () => {
    if (!form.title || !form.outlet || !form.year) return;
    try { const r = await apiClient.post('/press', form); setItems([...items, extractData(r, form)]); setForm({ outlet: '', title: '', year: '', url: '' }); } catch {}
  };

  const remove = async (id: string) => {
    try { await apiClient.delete(`/press/${id}`); setItems(items.filter((i) => i._id !== id)); } catch {}
  };

  return (
    <SectionCard title="Manage Press">
      <div className="space-y-3">
        {items.map((p) => (
          <div key={p._id} className="flex items-start justify-between rounded-lg border border-[var(--brown)]/8 bg-white p-3">
            <div>
              <div className="text-xs font-bold text-[var(--gold)]">{p.outlet}</div>
              <div className="text-sm font-semibold text-[var(--brown)]">{p.title} ({p.year})</div>
            </div>
            <Btn onClick={() => remove(p._id)} variant="danger">Delete</Btn>
          </div>
        ))}
        <div className="grid gap-3 sm:grid-cols-2">
          <FormInput label="Outlet" value={form.outlet} onChange={(v) => setForm({ ...form, outlet: v })} placeholder="News Outlet" />
          <FormInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <FormInput label="Year" value={form.year} onChange={(v) => setForm({ ...form, year: v })} placeholder="2025" />
          <FormInput label="Link" value={form.url} onChange={(v) => setForm({ ...form, url: v })} placeholder="https://..." />
        </div>
        <Btn onClick={add}>Add Press</Btn>
      </div>
    </SectionCard>
  );
}

/* ─── ACHIEVEMENTS MANAGER ─── */
function AchievementsManager() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [form, setForm] = useState({ icon: '', title: '', description: '', year: '' });

  useEffect(() => { apiClient.get('/achievements').then((r) => setItems(extractData(r))).catch(() => {}); }, []);

  const add = async () => {
    if (!form.title || !form.description || !form.year) return;
    try { const r = await apiClient.post('/achievements', form); setItems([...items, extractData(r, form)]); setForm({ icon: '', title: '', description: '', year: '' }); } catch {}
  };

  const remove = async (id: string) => {
    try { await apiClient.delete(`/achievements/${id}`); setItems(items.filter((i) => i._id !== id)); } catch {}
  };

  return (
    <SectionCard title="Manage Achievements">
      <div className="space-y-3">
        {items.map((a) => (
          <div key={a._id} className="flex items-start justify-between rounded-lg border border-[var(--brown)]/8 bg-white p-3">
            <div>
              <div className="text-sm font-semibold text-[var(--brown)]">{a.icon} {a.title}</div>
              <div className="text-xs text-[var(--gold)]">{a.year}</div>
            </div>
            <Btn onClick={() => remove(a._id)} variant="danger">Delete</Btn>
          </div>
        ))}
        <div className="grid gap-3 sm:grid-cols-2">
          <FormInput label="Icon (emoji)" value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} placeholder="🏆" />
          <FormInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <FormInput label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
          <FormInput label="Year" value={form.year} onChange={(v) => setForm({ ...form, year: v })} placeholder="2025" />
        </div>
        <Btn onClick={add}>Add Achievement</Btn>
      </div>
    </SectionCard>
  );
}

/* ─── CONNECT MANAGER ─── */
function ConnectManager() {
  const [data, setData] = useState<SocialLinks>({ whatsapp: '', instagram: '', linkedin: '', twitter: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { apiClient.get('/connect').then((r) => setData(extractData(r, data))).catch(() => {}); }, []);

  const save = async () => {
    setSaving(true); setMsg('');
    try { await apiClient.put('/connect', data); setMsg('Saved!'); }
    catch { setMsg('Error.'); }
    finally { setSaving(false); }
  };

  return (
    <SectionCard title="Social Links">
      <div className="space-y-3">
        <FormInput label="WhatsApp URL" value={data.whatsapp} onChange={(v) => setData({ ...data, whatsapp: v })} />
        <FormInput label="Instagram URL" value={data.instagram} onChange={(v) => setData({ ...data, instagram: v })} />
        <FormInput label="LinkedIn URL" value={data.linkedin} onChange={(v) => setData({ ...data, linkedin: v })} />
        <FormInput label="Twitter URL" value={data.twitter} onChange={(v) => setData({ ...data, twitter: v })} />
        <FormInput label="Email" value={data.email} onChange={(v) => setData({ ...data, email: v })} />
        <div className="flex items-center gap-3">
          <Btn onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Btn>
          {msg && <span className="text-sm text-[var(--gold)]">{msg}</span>}
        </div>
      </div>
    </SectionCard>
  );
}

/* ─── CONTACTS VIEWER ─── */
function ContactsViewer() {
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/contact').then((r) => setContacts(extractData(r))).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const markRead = async (id: string) => {
    try {
      await apiClient.patch(`/contact/${id}/read`, {});
      setContacts(contacts.map((c) => c._id === id ? { ...c, read: true } : c));
    } catch {}
  };

  const remove = async (id: string) => {
    try { await apiClient.delete(`/contact/${id}`); setContacts(contacts.filter((c) => c._id !== id)); } catch {}
  };

  return (
    <SectionCard title="Contact Submissions">
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-20 w-full" />)}
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-sm text-[var(--muted)]">No submissions yet.</div>
      ) : (
        <div className="space-y-3">
          <div className="text-xs text-[var(--muted)]">{contacts.length} submission{contacts.length !== 1 ? 's' : ''}</div>
          {contacts.map((c) => (
            <div key={c._id} className={`rounded-lg border p-4 ${c.read ? 'border-[var(--brown)]/8 bg-white' : 'border-[var(--gold)]/30 bg-[var(--cream)]'}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-[var(--brown)]">{c.name} {!c.read && <span className="text-[10px] font-bold uppercase text-[var(--gold)]">New</span>}</div>
                  <div className="text-xs text-[var(--gold)]">{c.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  {!c.read && <Btn onClick={() => markRead(c._id)} variant="secondary">Mark Read</Btn>}
                  <Btn onClick={() => remove(c._id)} variant="danger">Delete</Btn>
                  <div className="text-xs text-[var(--muted)]">{new Date(c.submittedAt).toLocaleString()}</div>
                </div>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--muted)]">{c.message}</p>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
