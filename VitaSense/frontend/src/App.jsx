import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard, Database, Activity,
  BarChart2, ScatterChart, FileText, Info, Leaf, Video
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Dataset from './pages/Dataset';
import SensorResponse from './pages/SensorResponse';
import FeatureAnalysis from './pages/FeatureAnalysis';
import PcaAnalysis from './pages/PcaAnalysis';
import Insights from './pages/Insights';
import AboutProject from './pages/AboutProject';
import FieldVisit from './pages/FieldVisit';

const API_BASE = 'http://localhost:8000/api';

/* ── Inline mango leaf SVG logo ───────────────────────────────────── */
function MangoLeafLogo({ size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Mango leaf logo"
    >
      {/* Main leaf shape */}
      <path
        d="M32 58 C18 48, 6 36, 8 20 C10 8, 22 4, 32 6 C42 4, 54 8, 56 20 C58 36, 46 48, 32 58Z"
        fill="#16a34a"
      />
      {/* Lighter overlay for depth */}
      <path
        d="M32 52 C22 43, 12 33, 14 20 C16 11, 24 8, 32 10 C40 8, 48 11, 50 20 C52 33, 42 43, 32 52Z"
        fill="#22c55e"
        opacity="0.45"
      />
      {/* Central vein */}
      <line x1="32" y1="8" x2="32" y2="56" stroke="#14532d" strokeWidth="1.5" strokeLinecap="round" />
      {/* Side veins - left */}
      <path d="M32 18 Q24 20 18 26" stroke="#14532d" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M32 26 Q22 28 16 34" stroke="#14532d" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M32 34 Q24 36 20 41" stroke="#14532d" strokeWidth="1" strokeLinecap="round" fill="none" />
      {/* Side veins - right */}
      <path d="M32 18 Q40 20 46 26" stroke="#14532d" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M32 26 Q42 28 48 34" stroke="#14532d" strokeWidth="1" strokeLinecap="round" fill="none" />
      <path d="M32 34 Q40 36 44 41" stroke="#14532d" strokeWidth="1" strokeLinecap="round" fill="none" />
      {/* Stem */}
      <path d="M32 6 Q33 2 34 1" stroke="#14532d" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* ── Sidebar ──────────────────────────────────────────────────────── */
function Sidebar() {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dataset', label: 'Dataset', icon: Database },
    { path: '/sensor-response', label: 'Sensor Response', icon: Activity },
    { path: '/feature-analysis', label: 'Feature Analysis', icon: BarChart2 },
    { path: '/pca', label: 'PCA Analysis', icon: ScatterChart },
    { path: '/insights', label: 'Results & Insights', icon: FileText },
    { path: '/fieldvisit', label: 'Field Visit & Setup', icon: Video },
    { path: '/about', label: 'About Project', icon: Info },
  ];

  return (
    <aside className="sidebar">
      {/* Header / Brand */}
      <div className="sidebar-header">
        <div className="sidebar-logo-row">
          <MangoLeafLogo size={34} />
          <h2>VitaSense</h2>
        </div>
        <p>Mango VOC Disease Detection</p>
      </div>

      {/* Navigation */}
      <span className="nav-section-label">Navigation</span>
      <nav className="nav-links">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <span className="icon-wrapper"><Icon size={17} /></span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-light)' }}>
          Pre-Symptomatic Detection<br />Mango VOC Fingerprints
        </p>
      </div>
    </aside>
  );
}

/* ── App Shell ────────────────────────────────────────────────────── */
function App() {
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    try {
      const res = await axios.get(`${API_BASE}/analysis-results`);
      setAppData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResults(); }, []);

  const handleDataUpdate = (data) => setAppData(data);

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard appData={appData} loading={loading} />} />
            <Route path="/dataset" element={<Dataset appData={appData} onUpdate={handleDataUpdate} apiBase={API_BASE} />} />
            <Route path="/sensor-response" element={<SensorResponse appData={appData} />} />
            <Route path="/feature-analysis" element={<FeatureAnalysis appData={appData} />} />
            <Route path="/pca" element={<PcaAnalysis appData={appData} />} />
            <Route path="/insights" element={<Insights appData={appData} />} />
            <Route path="/fieldvisit" element={<FieldVisit />} />
            <Route path="/about" element={<AboutProject />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
