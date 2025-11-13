import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Sample data
const SAMPLE_MANUFACTURERS = [
  { id: 'm1', name: 'Nordic Defence Components', status: 'Approved' },
  { id: 'm2', name: 'EuroTech Supplies', status: 'Under Review' }
];

const SAMPLE_CUSTOMERS = [
  { id: 'c1', name: 'ArmaTech', status: 'Approved' },
  { id: 'c2', name: 'Defence Solutions Ltd', status: 'Pending' }
];

const SAMPLE_RFQS = [
  { id: 'r1', part: 'Drone Motor', customer: 'ArmaTech', status: 'Quote Waiting' },
  { id: 'r2', part: 'Optical Sensor', customer: 'Defence Solutions Ltd', status: 'Awaiting Payment' }
];

// --- Pages ---
function HomePage() {
  return (
    <div className="p-6 bg-gray-800 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Defence Supply Hub (DSH)</h1>
      <p className="mb-2">A secure, EU-compliant B2B marketplace connecting European and Ukrainian defence technology manufacturers and customers.</p>
      <p className="mb-2">Mission: Build a trusted and transparent European defence marketplace enhancing supply security and strategic autonomy.</p>
      <p>Key Advantages: EU/NATO compliant, audited marketplace, data-driven membership model, supporting SMEs and large enterprises.</p>
    </div>
  );
}

function LoginPage({ onLogin }) {
  return (
    <div className="p-6 bg-blue-100 min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <div className="flex gap-4">
        <button onClick={() => onLogin('admin','admin','Platform Admin')} className="px-4 py-2 bg-indigo-600 text-white rounded">Login as Admin</button>
        <button onClick={() => onLogin('manufacturer','m1','Nordic Defence Components')} className="px-4 py-2 bg-emerald-600 text-white rounded">Login as Manufacturer</button>
        <button onClick={() => onLogin('customer','c1','ArmaTech')} className="px-4 py-2 bg-amber-600 text-white rounded">Login as Customer</button>
      </div>
    </div>
  );
}

function ApplyPage() {
  return (
    <div className="p-6 bg-olive-100 min-h-screen">
      <h2 className="text-xl font-semibold mb-2">Apply / Dashboard</h2>
      <p>Role-specific application, membership, and parts upload simulation.</p>
    </div>
  );
}

function PartnersPage() {
  return (
    <div className="p-6 bg-blue-200 min-h-screen">
      <h2 className="text-xl font-semibold mb-2">Partners / Collaborations</h2>
      <p>Demo logos and collaboration highlights.</p>
    </div>
  );
}

function NewsPage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-semibold mb-2">News & Insights</h2>
      <p>Sample news updates about defence industry and marketplace.</p>
    </div>
  );
}

function SupportPage() {
  return (
    <div className="p-6 bg-yellow-100 min-h-screen">
      <h2 className="text-xl font-semibold mb-2">Support</h2>
      <p>FAQs, helpdesk, and ticket form simulation.</p>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
      <p>Eurocore Global Oy Headquarters, Finland</p>
      <form className="flex flex-col gap-2 max-w-md">
        <input type="text" placeholder="Name" className="p-2 border rounded" />
        <input type="email" placeholder="Email" className="p-2 border rounded" />
        <textarea placeholder="Message" className="p-2 border rounded"></textarea>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Send</button>
      </form>
    </div>
  );
}

function ManufacturerPage({ auth, manufacturers }) {
  return (
    <div className="p-6 bg-green-100 min-h-screen">
      <h2 className="text-xl font-semibold mb-2">Manufacturer Dashboard</h2>
      <p>Welcome {auth?.name || 'Manufacturer'}</p>
      <ul>
        {manufacturers.map(m => <li key={m.id}>{m.name} - Status: {m.status}</li>)}
      </ul>
    </div>
  );
}

function CustomerPage({ auth, customers, rfqs }) {
  return (
    <div className="p-6 bg-amber-100 min-h-screen">
      <h2 className="text-xl font-semibold mb-2">Customer Dashboard</h2>
      <p>Welcome {auth?.name || 'Customer'}</p>
      <ul>
        {rfqs.map(r => <li key={r.id}>{r.part} - Status: {r.status}</li>)}
      </ul>
    </div>
  );
}

function AdminPage({ auth, manufacturers, customers, rfqs }) {
  return (
    <div className="p-6 bg-gray-400 min-h-screen">
      <h2 className="text-xl font-semibold mb-2">Admin Dashboard</h2>
      <p>Welcome {auth?.name || 'Admin'}</p>
      <div>
        <h3>Manufacturers</h3>
        <ul>{manufacturers.map(m => <li key={m.id}>{m.name} - {m.status}</li>)}</ul>
        <h3>Customers</h3>
        <ul>{customers.map(c => <li key={c.id}>{c.name} - {c.status}</li>)}</ul>
        <h3>RFQs</h3>
        <ul>{rfqs.map(r => <li key={r.id}>{r.part} - {r.status}</li>)}</ul>
      </div>
    </div>
  );
}

function AppShell({ children, auth, onLogout }) {
  return (
    <div>
      <nav className="flex gap-4 p-4 bg-gray-900 text-white">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/apply">Apply</Link>
        <Link to="/partners">Partners</Link>
        <Link to="/news">News</Link>
        <Link to="/support">Support</Link>
        <Link to="/contact">Contact Us</Link>
        {auth && <button onClick={onLogout} className="ml-auto px-2 py-1 bg-red-600 rounded">Logout</button>}
      </nav>
      <main>{children}</main>
    </div>
  );
}

export default function RouterApp() {
  const [auth, setAuth] = useState(null);

  function loginAs(role, id, name) {
    setAuth({ role, id, name });
  }
  function logout() { setAuth(null); }

  return (
    <Router>
      <AppShell auth={auth} onLogout={logout}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage onLogin={loginAs} />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/manufacturer" element={<ManufacturerPage auth={auth} manufacturers={SAMPLE_MANUFACTURERS} />} />
          <Route path="/customer" element={<CustomerPage auth={auth} customers={SAMPLE_CUSTOMERS} rfqs={SAMPLE_RFQS} />} />
          <Route path="/admin" element={<AdminPage auth={auth} manufacturers={SAMPLE_MANUFACTURERS} customers={SAMPLE_CUSTOMERS} rfqs={SAMPLE_RFQS} />} />
        </Routes>
      </AppShell>
    </Router>
  );
}
