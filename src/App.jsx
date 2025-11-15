import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";

// Single-file demo React app for Defence Supply Hub
// - Full dashboards for Manufacturer and Customer with editable UI
// - Login + registration, role-based dashboard routing
// - LocalStorage persistence for demo purposes
// - Tailwind CSS classes used for styling (ensure Tailwind is enabled in your project)

// ---------- Utilities ----------
const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
};
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// ---------- Sample images (Unsplash) ----------
const IMAGES = {
  home: 'https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?auto=format&fit=crop&w=1400&q=60',
  manufHero: 'https://images.unsplash.com/photo-1581091215367-59ab6a6140b1?auto=format&fit=crop&w=1400&q=60',
  customerHero: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=1400&q=60',
  uploads: 'https://images.unsplash.com/photo-1581092334504-5c6c1a44a474?auto=format&fit=crop&w=1400&q=60',
  rfq: 'https://images.unsplash.com/photo-1531497865143-1f229e1bbf41?auto=format&fit=crop&w=1400&q=60',
  orders: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=60',
};

// ---------- App ----------
export default function App() {
  const [manufacturers, setManufacturers] = useState(() => load('dsh_manufacturers', []));
  const [customers, setCustomers] = useState(() => load('dsh_customers', []));
  const [rfqs, setRfqs] = useState(() => load('dsh_rfqs', []));
  const [auth, setAuth] = useState(() => load('dsh_auth', null));

  useEffect(() => save('dsh_manufacturers', manufacturers), [manufacturers]);
  useEffect(() => save('dsh_customers', customers), [customers]);
  useEffect(() => save('dsh_rfqs', rfqs), [rfqs]);
  useEffect(() => save('dsh_auth', auth), [auth]);

  // quick sample data if empty
  useEffect(() => {
    if (manufacturers.length === 0 && customers.length === 0) {
      const m = {
        id: 'm_demo', company: 'Nordic Defence Components Oy', email: 'm@nordic.demo', country: 'Finland', ncage: 'NDCO1', status: 'Approved', products: [ { id: 'p1', name: 'Precision CNC Gear A2', qty: 500, lead: 14, price: 12.5 } ], profile: 'Precision mechanical components for defence.'
      };
      const c = { id: 'c_demo', company: 'ArmaTech Solutions', email: 'c@armatech.demo', country: 'Sweden', status: 'Approved', notes: '', rfqs: [] };
      setManufacturers([m]); setCustomers([c]); setRfqs([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // registration
  function registerManufacturer(data) { setManufacturers(s => [data, ...s]); }
  function registerCustomer(data) { setCustomers(s => [data, ...s]); }

  // approvals (admin simulation)
  function approveManufacturer(id) { setManufacturers(s => s.map(m => m.id === id ? { ...m, status: 'Approved' } : m)); }
  function approveCustomer(id) { setCustomers(s => s.map(c => c.id === id ? { ...c, status: 'Approved' } : c)); }

  // RFQs
  function createRFQ(rfq) { setRfqs(s => [rfq, ...s]); }

  function logout() { setAuth(null); }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Topbar auth={auth} onLogout={logout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setAuth={setAuth} manufacturers={manufacturers} customers={customers} />} />

          <Route path="/manufacturer/register" element={<ManufacturerRegister onRegister={registerManufacturer} />} />
          <Route path="/customer/register" element={<CustomerRegister onRegister={registerCustomer} />} />

          <Route path="/dashboard" element={<DashboardRoot auth={auth} manufacturers={manufacturers} customers={customers} rfqs={rfqs} approveManufacturer={approveManufacturer} approveCustomer={approveCustomer} createRFQ={createRFQ} setManufacturers={setManufacturers} setCustomers={setCustomers} setRfqs={setRfqs} setAuth={setAuth} />} />

          <Route path="/news" element={<News />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/support" element={<Support />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

// ---------- Topbar ----------
function Topbar({ auth, onLogout }) {
  return (
    <div className="bg-black text-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <div className="text-xl font-bold">Defence Supply Hub</div>
        <nav className="flex gap-4 items-center">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/manufacturer/register" className="hover:underline">Manufacturer</Link>
          <Link to="/customer/register" className="hover:underline">Customers</Link>
          <Link to="/news" className="hover:underline">News</Link>
          <Link to="/partners" className="hover:underline">Partners</Link>
          <Link to="/support" className="hover:underline">Support</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
          {!auth ? <Link to="/login" className="ml-4 px-3 py-1 bg-indigo-600 rounded">Login</Link> : <div className="flex items-center gap-3">
            <div className="text-sm">{auth.name} • {auth.role}</div>
            <button onClick={onLogout} className="px-3 py-1 bg-red-600 rounded">Logout</button>
          </div>}
        </nav>
      </div>
    </div>
  );
}

// ---------- Pages: Home, News, Partners, Support, Contact ----------
function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundImage: `linear-gradient(180deg, rgba(2,6,23,0.75), rgba(2,6,23,0.55)), url(${IMAGES.home})`, backgroundSize: 'cover' }}>
      <div className="max-w-6xl mx-auto p-12 text-white">
        <h1 className="text-4xl font-bold mb-4">About Defence Supply Hub</h1>
        <p className="leading-relaxed mb-6">Defence Supply Hub (DSH) is a secure, EU-compliant B2B marketplace developed by Eurocore Global Oy, a Finnish-owned company based entirely within the European Union and the United Kingdom. The platform connects European and Ukrainian defence technology manufacturers, distributors, integrators, and prime contractors in one audited and transparent ecosystem. Designed to strengthen Europe’s defence industrial base, DSH provides a regulated digital environment for trading components, subcontracting services, and technologies — ensuring all operations meet EU and NATO export control, cybersecurity, and auditing standards. The platform’s business model is built on corporate memberships, transaction-based service fees, and data and auditing services, enabling both SMEs and large enterprises to participate equally in compliant defence trade.</p>

        <section className="bg-black/40 p-6 rounded mb-6">
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p>To build a trusted and transparent European defence marketplace that enhances supply security, industrial cooperation, and strategic autonomy — while enabling fair access for small and medium-sized enterprises across the EU and Ukraine.</p>
        </section>

        <section className="bg-black/40 p-6 rounded mb-6">
          <h2 className="text-2xl font-semibold">Key Advantages</h2>
          <ul className="list-disc ml-6">
            <li>First European marketplace focused on audited component-level defence trade.</li>
            <li>EU and NATO compliant.</li>
            <li>Supports Ukraine’s integration into Europe’s defence industrial base.</li>
            <li>Pilot project (2026): Drone and counter-drone component marketplace.</li>
          </ul>
        </section>

        <section className="bg-black/40 p-6 rounded">
          <h2 className="text-2xl font-semibold">Founders</h2>
          <p className="font-semibold">Lotta Riekki — Founder & CEO</p>
          <p className="mb-2">Lotta Riekki has over a decade of experience in international business development, consortium operations, and defence-sector sales.</p>
          <p className="font-semibold">Ajay Chaudhari — Co-Founder & Supply Chain Specialist</p>
          <p>Ajay Chaudhari is an engineer and procurement expert with extensive experience in supplier management, auditing, and production optimization.</p>
        </section>
      </div>
    </main>
  );
}

function News() {
  return (
    <main className="min-h-screen p-10 bg-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">News & Insights</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <ArticleCard title="EU Defence Readiness Roadmap 2030 Announced" img={IMAGES.rfq} />
          <ArticleCard title="Finland and Ukraine Industrial Cooperation Deepens" img={IMAGES.home} />
          <ArticleCard title="Drone Components Standardization in Progress" img={IMAGES.manufHero} />
        </div>
      </div>
    </main>
  );
}
function ArticleCard({ title, img }) {
  return (
    <div className="border rounded shadow overflow-hidden bg-white">
      <img src={img} alt="article" className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600">Demo summary content for the article. Click to read more in a real build.</p>
      </div>
    </div>
  );
}

function Partners() {
  return (
    <main className="min-h-screen p-10" style={{ background: 'linear-gradient(180deg,#08306b,#1a4f9c)' }}>
      <div className="max-w-6xl mx-auto text-white">
        <h1 className="text-3xl font-bold mb-6">Partners / Collaborations</h1>
        <p className="mb-6">A scalable, long-term ecosystem for industrial cooperation — contact: Lotta@eurocoreglobal.com</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['EU', 'NATO', 'Finnish Cluster', 'Ukrainian Industry'].map((t) => (
            <div key={t} className="bg-white/10 p-6 rounded text-center">{t}</div>
          ))}
        </div>
      </div>
    </main>
  );
}

function Support() {
  return (
    <main className="min-h-screen p-10 bg-[#e5ddc1]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Support</h1>
        <h3 className="font-semibold">FAQs</h3>
        <ul className="list-disc ml-6 mb-6">
          <li>How do I register as a manufacturer?</li>
          <li>How are export-controls handled?</li>
          <li>How to submit an RFQ?</li>
        </ul>
        <h3 className="font-semibold mb-2">Raise a Ticket</h3>
        <TicketForm />
      </div>
    </main>
  );
}

function Contact() {
  return (
    <main className="min-h-screen p-10 bg-[#d7d7d7]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <div className="mb-6">
          <p>Defence Supply Hub – Eurocore Global Oy<br/>Helsinki, Finland<br/>Email: sales@eurocoreglobal.com<br/>Phone: +358-408500302</p>
        </div>
        <ContactForm />
      </div>
    </main>
  );
}

function TicketForm() {
  const [form, setForm] = useState({ name: '', email: '', issue: '' });
  return (
    <form className="bg-white p-4 rounded shadow grid gap-3" onSubmit={(e) => { e.preventDefault(); alert('Ticket submitted (demo)'); setForm({ name: '', email: '', issue: '' }); }}>
      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="p-2 border rounded" />
      <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="p-2 border rounded" />
      <textarea value={form.issue} onChange={(e) => setForm({ ...form, issue: e.target.value })} placeholder="Describe your issue" className="p-2 border rounded h-28" />
      <div className="flex gap-2"><button className="px-4 py-2 bg-black text-white rounded">Submit</button></div>
    </form>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  return (
    <form className="bg-white p-4 rounded shadow grid gap-3" onSubmit={(e) => { e.preventDefault(); alert('Message sent (demo)'); setForm({ name: '', email: '', message: '' }); }}>
      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="p-2 border rounded" />
      <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="p-2 border rounded" />
      <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Message" className="p-2 border rounded h-28" />
      <div className="flex gap-2"><button className="px-4 py-2 bg-black text-white rounded">Send</button></div>
    </form>
  );
}

// ---------- Authentication & Registration Pages ----------
function Login({ setAuth, manufacturers, customers }) {
  const [role, setRole] = useState('manufacturer');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    if (role === 'manufacturer') {
      const m = manufacturers.find(x => x.email === email);
      if (!m) return alert('Manufacturer not found — register first or use demo email m@nordic.demo');
      setAuth({ role: 'manufacturer', id: m.id, name: m.company });
      navigate('/dashboard');
    } else {
      const c = customers.find(x => x.email === email);
      if (!c) return alert('Customer not found — register first or use demo email c@armatech.demo');
      setAuth({ role: 'customer', id: c.id, name: c.company });
      navigate('/dashboard');
    }
  }

  return (
    <main className="min-h-screen p-10">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Login (demo)</h2>
        <form onSubmit={submit} className="grid gap-3">
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="p-2 border rounded">
            <option value="manufacturer">Manufacturer</option>
            <option value="customer">Customer</option>
          </select>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="demo emails: m@nordic.demo or c@armatech.demo" className="p-2 border rounded" />
          <div className="flex gap-2"><button className="px-4 py-2 bg-indigo-600 text-white rounded">Login</button></div>
        </form>
      </div>
    </main>
  );
}

function ManufacturerRegister({ onRegister }) {
  const [form, setForm] = useState({ company: '', country: '', regNo: '', contact: '', email: '', phone: '', ncage: '', membership: 'Basic', profile: '', products: [], status: 'Application Submitted' });
  const navigate = useNavigate();
  function submit(e) {
    e.preventDefault();
    const id = `m_${Date.now()}`;
    onRegister({ ...form, id });
    alert('Manufacturer registered (demo). Admin must approve to activate.');
    navigate('/login');
  }
  return (
    <main className="min-h-screen p-10 bg-white">
      <div className="max-w-4xl mx-auto bg-slate-50 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Manufacturer Registration</h2>
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" className="p-2 border rounded" required />
          <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Country" className="p-2 border rounded" required />
          <input value={form.regNo} onChange={(e) => setForm({ ...form, regNo: e.target.value })} placeholder="Registration number" className="p-2 border rounded" />
          <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Contact person" className="p-2 border rounded" />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="p-2 border rounded" required />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="p-2 border rounded" />
          <input value={form.ncage} onChange={(e) => setForm({ ...form, ncage: e.target.value })} placeholder="NCAGE" className="p-2 border rounded" />
          <select value={form.membership} onChange={(e) => setForm({ ...form, membership: e.target.value })} className="p-2 border rounded">
            <option>Basic</option>
            <option>Moderate</option>
            <option>Advanced</option>
          </select>

          <textarea value={form.profile} onChange={(e) => setForm({ ...form, profile: e.target.value })} placeholder="Short company profile" className="col-span-2 p-2 border rounded" />

          <div className="col-span-2 flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded">Submit Registration</button>
            <button type="button" onClick={() => setForm({ company: '', country: '', regNo: '', contact: '', email: '', phone: '', ncage: '', membership: 'Basic', profile: '', products: [], status: 'Application Submitted' })} className="px-4 py-2 bg-gray-200 rounded">Clear</button>
          </div>
        </form>
      </div>
    </main>
  );
}

function CustomerRegister({ onRegister }) {
  const [form, setForm] = useState({ company: '', country: '', regNo: '', contact: '', email: '', phone: '', status: 'Application Submitted' });
  const navigate = useNavigate();
  function submit(e) { e.preventDefault(); onRegister({ ...form, id: `c_${Date.now()}` }); alert('Customer registered (demo). Admin must approve.'); navigate('/login'); }
  return (
    <main className="min-h-screen p-10 bg-white">
      <div className="max-w-4xl mx-auto bg-slate-50 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Customer / Buyer Registration</h2>
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" className="p-2 border rounded" required />
          <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Country" className="p-2 border rounded" required />
          <input value={form.regNo} onChange={(e) => setForm({ ...form, regNo: e.target.value })} placeholder="Registration number" className="p-2 border rounded" />
          <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Contact person" className="p-2 border rounded" />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="p-2 border rounded" required />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="p-2 border rounded" />

          <div className="col-span-2 flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded">Submit Registration</button>
            <button type="button" onClick={() => setForm({ company: '', country: '', regNo: '', contact: '', email: '', phone: '', status: 'Application Submitted' })} className="px-4 py-2 bg-gray-200 rounded">Clear</button>
          </div>
        </form>
      </div>
    </main>
  );
}

// ---------- Dashboard root (route-protected) ----------
function DashboardRoot({ auth, manufacturers, customers, rfqs, approveManufacturer, approveCustomer, createRFQ, setManufacturers, setCustomers, setRfqs, setAuth }) {
  if (!auth) return <Navigate to="/login" replace />;
  // admin view
  if (auth.role === 'admin') return <AdminDashboard manufacturers={manufacturers} customers={customers} rfqs={rfqs} approveManufacturer={approveManufacturer} approveCustomer={approveCustomer} setAuth={setAuth} />;
  // manufacturer view
  if (auth.role === 'manufacturer') return <ManufacturerDashboardFull user={auth} manufacturers={manufacturers} setManufacturers={setManufacturers} rfqs={rfqs} setRfqs={setRfqs} />;
  // customer view
  if (auth.role === 'customer') return <CustomerDashboardFull user={auth} customers={customers} setCustomers={setCustomers} rfqs={rfqs} createRFQ={createRFQ} />;
  return null;
}

// ---------- Admin Dashboard (simple) ----------
function AdminDashboard({ manufacturers, customers, rfqs, approveManufacturer, approveCustomer }) {
  return (
    <main className="min-h-screen p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">Manufacturers</h3>
            <ul>
              {manufacturers.map(m => (
                <li key={m.id} className="mb-2">{m.company} — {m.status} {m.status !== 'Approved' && <button onClick={() => approveManufacturer(m.id)} className="ml-2 text-green-600">Approve</button>}</li>
              ))}
            </ul>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">Customers</h3>
            <ul>
              {customers.map(c => <li key={c.id} className="mb-2">{c.company} — {c.status} {c.status !== 'Approved' && <button onClick={() => approveCustomer(c.id)} className="ml-2 text-green-600">Approve</button>}</li>)}
            </ul>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">RFQs</h3>
            <ul>{rfqs.map(r => <li key={r.id} className="mb-2">{r.part} — {r.status}</li>)}</ul>
          </div>
        </div>
      </div>
    </main>
  );
}

// ---------- Manufacturer Full Dashboard (detailed tabs) ----------
function ManufacturerDashboardFull({ user, manufacturers, setManufacturers, rfqs, setRfqs }) {
  const me = manufacturers.find(m => m.id === user.id) || null;
  const [tab, setTab] = useState('profile');
  const [edit, setEdit] = useState(false);
  const [local, setLocal] = useState(me || {});

  useEffect(() => setLocal(me || {}), [me]);

  function saveProfile() {
    setManufacturers(s => s.map(m => m.id === me.id ? { ...m, ...local } : m));
    setEdit(false);
    alert('Profile saved (demo)');
  }

  function addProduct(p) {
    const prod = { ...p, id: `p_${Date.now()}` };
    setManufacturers(s => s.map(m => m.id === me.id ? { ...m, products: [ ...(m.products||[]), prod ] } : m));
  }

  return (
    <main className="min-h-screen p-10 bg-slate-50">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Manufacturer Dashboard — {me?.company}</h1>
          <div className="text-sm">Status: <strong>{me?.status}</strong></div>
        </div>

        <div className="flex gap-2 mb-6">
          {['profile','summary','uploads','rfq','orders'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-3 py-1 rounded ${tab===t ? 'bg-black text-white' : 'bg-gray-200'}`}>{t.toUpperCase()}</button>
          ))}
        </div>

        {tab === 'profile' && (
          <div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Profile</h3>
                {edit ? (
                  <div className="grid gap-2">
                    <input value={local.company} onChange={e => setLocal({...local, company: e.target.value})} className="p-2 border rounded" />
                    <input value={local.country} onChange={e => setLocal({...local, country: e.target.value})} className="p-2 border rounded" />
                    <input value={local.ncage} onChange={e => setLocal({...local, ncage: e.target.value})} className="p-2 border rounded" />
                    <textarea value={local.profile} onChange={e => setLocal({...local, profile: e.target.value})} className="p-2 border rounded" />
                    <div className="flex gap-2"><button onClick={saveProfile} className="px-3 py-1 bg-green-600 text-white rounded">Save</button><button onClick={() => setEdit(false)} className="px-3 py-1 bg-gray-200 rounded">Cancel</button></div>
                  </div>
                ) : (
                  <div>
                    <p><strong>{me?.company}</strong></p>
                    <p>{me?.country}</p>
                    <p>NCAGE: {me?.ncage}</p>
                    <p className="mt-2">{me?.profile}</p>
                    <div className="mt-3"><button onClick={() => setEdit(true)} className="px-3 py-1 bg-black text-white rounded">Edit profile</button></div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Contact</h3>
                <p>Email: {me?.email}</p>
                <p>Phone: {me?.phone}</p>
                <h3 className="mt-4 font-semibold">Membership</h3>
                <p>{me?.membership || 'Basic'}</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'summary' && (
          <div>
            <h3 className="font-semibold mb-3">Summary</h3>
            <img src={IMAGES.manufHero} alt="hero" className="w-full h-48 object-cover rounded mb-4" />
            <p>Products listed: <strong>{me?.products?.length || 0}</strong></p>
            <p>Orders: <strong>0</strong> (demo)</p>
          </div>
        )}

        {tab === 'uploads' && (
          <div>
            <h3 className="font-semibold mb-3">Uploads</h3>
            <img src={IMAGES.uploads} alt="uploads" className="w-full h-48 object-cover rounded mb-4" />
            <input type="file" onChange={(e) => alert(`Selected local file: ${e.target.files?.[0]?.name || 'none'} (demo)`)} />
            <p className="mt-3 text-sm text-gray-600">Upload ISO certificates, drawings or datasheets. Files are not uploaded in this demo.</p>
          </div>
        )}

        {tab === 'rfq' && (
          <div>
            <h3 className="font-semibold mb-3">RFQs</h3>
            <img src={IMAGES.rfq} alt="rfq" className="w-full h-48 object-cover rounded mb-4" />
            <p>No RFQs assigned (demo).</p>
          </div>
        )}

        {tab === 'orders' && (
          <div>
            <h3 className="font-semibold mb-3">Orders</h3>
            <img src={IMAGES.orders} alt="orders" className="w-full h-48 object-cover rounded mb-4" />
            <p>No orders yet (demo).</p>
          </div>
        )}

        <div className="mt-6">
          <h3 className="font-semibold">Add product</h3>
          <AddProductForm onAdd={addProduct} />
        </div>
      </div>
    </main>
  );
}

function AddProductForm({ onAdd }) {
  const [p, setP] = useState({ name: '', qty: '', lead: '', price: '' });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onAdd(p); setP({ name: '', qty: '', lead: '', price: '' }); alert('Product added (demo)'); }} className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-2">
      <input value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} placeholder="Name" className="p-2 border rounded" required />
      <input value={p.qty} onChange={(e) => setP({ ...p, qty: e.target.value })} placeholder="Qty" className="p-2 border rounded" required />
      <input value={p.lead} onChange={(e) => setP({ ...p, lead: e.target.value })} placeholder="Lead time (days)" className="p-2 border rounded" />
      <input value={p.price} onChange={(e) => setP({ ...p, price: e.target.value })} placeholder="Price (€)" className="p-2 border rounded" />
      <div className="md:col-span-4"><button className="px-4 py-2 bg-black text-white rounded mt-2">Add Product</button></div>
    </form>
  );
}

// ---------- Customer Full Dashboard ----------
function CustomerDashboardFull({ user, customers, setCustomers, rfqs, createRFQ }) {
  const me = customers.find(c => c.id === user.id) || null;
  const [tab, setTab] = useState('profile');
  const [edit, setEdit] = useState(false);
  const [local, setLocal] = useState(me || {});

  useEffect(() => setLocal(me || {}), [me]);

  function saveProfile() { setCustomers(s => s.map(c => c.id === me.id ? { ...c, ...local } : c)); setEdit(false); alert('Profile saved (demo)'); }

  function submitRFQ(r) { createRFQ(r); alert('RFQ submitted (demo)'); }

  return (
    <main className="min-h-screen p-10 bg-slate-50">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Customer Dashboard — {me?.company}</h1>
          <div className="text-sm">Status: <strong>{me?.status}</strong></div>
        </div>
        <div className="flex gap-2 mb-6">
          {['profile','summary','rfq','orders'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-3 py-1 rounded ${tab===t ? 'bg-black text-white' : 'bg-gray-200'}`}>{t.toUpperCase()}</button>
          ))}
        </div>

        {tab === 'profile' && (
          <div>
            {edit ? (
              <div className="grid md:grid-cols-2 gap-3">
                <input value={local.company} onChange={e => setLocal({...local, company: e.target.value})} className="p-2 border rounded" />
                <input value={local.country} onChange={e => setLocal({...local, country: e.target.value})} className="p-2 border rounded" />
                <input value={local.contact} onChange={e => setLocal({...local, contact: e.target.value})} className="p-2 border rounded" />
                <input value={local.email} onChange={e => setLocal({...local, email: e.target.value})} className="p-2 border rounded" />
                <div className="md:col-span-2 flex gap-2"><button onClick={saveProfile} className="px-3 py-1 bg-green-600 text-white rounded">Save</button><button onClick={() => setEdit(false)} className="px-3 py-1 bg-gray-200 rounded">Cancel</button></div>
              </div>
            ) : (
              <div>
                <p><strong>{me?.company}</strong></p>
                <p>{me?.country}</p>
                <p>{me?.contact}</p>
                <div className="mt-3"><button onClick={() => setEdit(true)} className="px-3 py-1 bg-black text-white rounded">Edit profile</button></div>
              </div>
            )}
          </div>
        )}

        {tab === 'summary' && (
          <div>
            <h3 className="font-semibold mb-3">Summary</h3>
            <img src={IMAGES.customerHero} alt="hero" className="w-full h-48 object-cover rounded mb-4" />
            <p>RFQs submitted: <strong>{rfqs.filter(r => r.customerId === me?.id).length}</strong></p>
          </div>
        )}

        {tab === 'rfq' && (
          <div>
            <h3 className="font-semibold mb-3">Create RFQ</h3>
            <RFQForm customerId={me?.id} onSubmit={submitRFQ} />
            <h3 className="font-semibold mt-6 mb-3">My RFQs</h3>
            <ul>{rfqs.filter(r => r.customerId === me?.id).map(r => <li key={r.id}>{r.part} — {r.qty} — {r.status}</li>)}</ul>
          </div>
        )}

        {tab === 'orders' && (
          <div>
            <h3 className="font-semibold mb-3">Orders</h3>
            <p>No orders yet (demo).</p>
          </div>
        )}
      </div>
    </main>
  );
}

function RFQForm({ customerId, onSubmit }) {
  const [f, setF] = useState({ part: '', qty: '', delivery: '', notes: '' });
  function submit(e) { e.preventDefault(); const id = `r_${Date.now()}`; onSubmit({ ...f, id, customerId, status: 'New', quotes: []}); setF({ part: '', qty: '', delivery: '', notes: '' }); }
  return (
    <form onSubmit={submit} className="grid md:grid-cols-2 gap-3">
      <input value={f.part} onChange={(e) => setF({...f, part: e.target.value})} placeholder="Part name / description" className="p-2 border rounded" required />
      <input value={f.qty} onChange={(e) => setF({...f, qty: e.target.value})} placeholder="Quantity" className="p-2 border rounded" required />
      <input value={f.delivery} onChange={(e) => setF({...f, delivery: e.target.value})} placeholder="Desired delivery date" className="p-2 border rounded" />
      <textarea value={f.notes} onChange={(e) => setF({...f, notes: e.target.value})} placeholder="Notes / drawing link" className="p-2 border rounded" />
      <div className="md:col-span-2"><button className="px-4 py-2 bg-black text-white rounded">Submit RFQ</button></div>
    </form>
  );
}

// ---------- Export note ----------
// Save this file as src/App.jsx (replace your existing file). Ensure your project has react-router-dom and Tailwind CSS configured.
// Run locally with: npm install && npm run dev
