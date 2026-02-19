import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Spin } from 'antd';
import { Building2, FolderKanban, Globe, Users, LogOut } from 'lucide-react';
import SignIn from './pages/SignIn';
import Tenants from './pages/Tenants';
import Companies from './pages/Companies';
import Projects from './pages/Projects';
import WebsiteAnalysis from './pages/WebsiteAnalysis';
import Report from './pages/Report';
import FeatureReport from './pages/FeatureReport';

const { Header, Content } = Layout;

const NAV_ITEMS = [
  { key: '/tenants', icon: <Users size={16} />, label: 'Tenants' },
  { key: '/companies', icon: <Building2 size={16} />, label: 'Companies' },
  { key: '/projects', icon: <FolderKanban size={16} />, label: 'Projects' },
  { key: '/website-analysis', icon: <Globe size={16} />, label: 'Website Intel' },
];

function AppLayout({ user, onLogout, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    onLogout();
  };

  // Hide sidebar on report pages for full-width
  const isReportPage = location.pathname.includes('/report') || location.pathname.includes('/feature-report');

  if (isReportPage) {
    return (
      <div className="report-root">{children}</div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 24px', background: '#1a1a1a', borderBottom: '1px solid #333',
        height: 56, lineHeight: '56px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
            <span style={{ color: '#4A9EFF' }}>K</span>ompete
          </span>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            onClick={({ key }) => navigate(key)}
            items={NAV_ITEMS}
            style={{ background: 'transparent', borderBottom: 'none', flex: 1 }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>{user.email}</span>
          <Button
            type="text"
            danger
            icon={<LogOut size={14} />}
            onClick={handleLogout}
            size="small"
          >
            Logout
          </Button>
        </div>
      </Header>
      <Content style={{ padding: 32, maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        {children}
      </Content>
    </Layout>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <SignIn onLogin={setUser} />;
  }

  return (
    <BrowserRouter>
      <AppLayout user={user} onLogout={() => setUser(null)}>
        <Routes>
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id/report" element={<Report />} />
          <Route path="/projects/:id/feature-report" element={<FeatureReport />} />
          <Route path="/website-analysis" element={<WebsiteAnalysis />} />
          <Route path="*" element={<Navigate to="/projects" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
