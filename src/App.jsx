import { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Dropdown, Spin, theme } from 'antd';
import { FileText, LayoutGrid, Building2, FolderKanban, Users, LogOut, Shield, Sun, Moon, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import SignIn from './pages/SignIn';
import Companies from './pages/Companies';
import Projects from './pages/Projects';
import Report from './pages/Report';
import FeatureReport from './pages/FeatureReport';
import UserManagement from './pages/UserManagement';
import ReportProjectList from './pages/ReportProjectList';
import TenantSelector from './components/TenantSelector';

const { Sider, Content } = Layout;

function computeTier(user) {
  const domain = user.email?.split('@')[1];
  if (domain === 'gmail.com') return 'kompete';
  if (user.role === 'admin') return 'admin';
  return user.role || 'user';
}

function getTierLabel(tier) {
  if (tier === 'kompete') return 'Kompete Admin';
  if (tier === 'admin') return 'Company Admin';
  return 'User';
}

function getSidebarItems(user) {
  const items = [
    { key: '/reports', icon: <FileText size={16} />, label: 'Review Intelligence' },
    { key: '/feature-reports', icon: <LayoutGrid size={16} />, label: 'Feature Listing' },
  ];

  if (user?.tier === 'admin' || user?.tier === 'kompete') {
    items.push({ key: '/users', icon: <Users size={16} />, label: 'User Management' });
  }

  return items;
}

function getSelectedKeys(pathname) {
  if (/\/projects\/[^/]+\/report$/.test(pathname)) return ['/reports'];
  if (/\/projects\/[^/]+\/feature-report$/.test(pathname)) return ['/feature-reports'];
  return [pathname];
}

function AppLayout({ user, activeTenantId, onTenantChange, onLogout, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const { mode, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  const siderWidth = 260;
  const collapsedWidth = 72;
  const isReportPage = /\/projects\/[^/]+\/(report|feature-report)$/.test(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('activeTenantId');
    onLogout();
  };

  const currentWidth = collapsed ? collapsedWidth : siderWidth;
  const isAdminRoute = location.pathname.startsWith('/admin/');

  const settingsDropdownItems = {
    items: [
      {
        key: 'theme',
        icon: mode === 'dark' ? <Sun size={14} /> : <Moon size={14} />,
        label: mode === 'dark' ? 'Light Mode' : 'Dark Mode',
        onClick: toggleTheme,
      },
      { type: 'divider' },
      {
        key: 'logout',
        icon: <LogOut size={14} />,
        label: 'Logout',
        danger: true,
        onClick: handleLogout,
      },
    ],
  };

  const adminDropdownItems = {
    items: [
      {
        key: '/admin/companies',
        icon: <Building2 size={14} />,
        label: 'Companies',
        onClick: () => navigate('/admin/companies'),
      },
      {
        key: '/admin/projects',
        icon: <FolderKanban size={14} />,
        label: 'Projects',
        onClick: () => navigate('/admin/projects'),
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={siderWidth}
        collapsedWidth={collapsedWidth}
        collapsed={collapsed}
        trigger={null}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          height: '100vh',
          overflow: 'auto',
          background: token.colorBgContainer,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
          zIndex: 100,
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}>
          {/* Logo + collapse toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: collapsed ? '16px 0' : '16px 12px 16px 24px',
          }}>
            <span style={{ fontSize: collapsed ? 22 : 20, fontWeight: 700, color: token.colorText, letterSpacing: '-0.5px' }}>
              <span style={{ color: '#C9A84C' }}>KO</span>{!collapsed && 'MPETE'}
            </span>
            {!collapsed && (
              <div
                onClick={() => setCollapsed(true)}
                style={{
                  cursor: 'pointer',
                  color: token.colorTextQuaternary,
                  display: 'flex',
                  alignItems: 'center',
                  padding: 4,
                  borderRadius: 4,
                }}
                onMouseEnter={e => e.currentTarget.style.color = token.colorTextSecondary}
                onMouseLeave={e => e.currentTarget.style.color = token.colorTextQuaternary}
              >
                <ChevronLeft size={16} />
              </div>
            )}
          </div>

          {collapsed && (
            <div style={{ textAlign: 'center', marginBottom: 4 }}>
              <div
                onClick={() => setCollapsed(false)}
                style={{
                  cursor: 'pointer',
                  color: token.colorTextQuaternary,
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: 4,
                  borderRadius: 4,
                }}
                onMouseEnter={e => e.currentTarget.style.color = token.colorTextSecondary}
                onMouseLeave={e => e.currentTarget.style.color = token.colorTextQuaternary}
              >
                <ChevronRight size={16} />
              </div>
            </div>
          )}

          {/* Tenant selector for kompete users (expanded sidebar only) */}
          {user?.tier === 'kompete' && !collapsed && (
            <TenantSelector activeTenantId={activeTenantId} onTenantChange={onTenantChange} />
          )}

          {/* Main nav */}
          <Menu
            mode="inline"
            selectedKeys={getSelectedKeys(location.pathname)}
            onClick={({ key }) => navigate(key)}
            items={getSidebarItems(user)}
            style={{ background: 'transparent', borderRight: 'none', flex: 1 }}
          />

          {/* Admin Dashboard hover menu (kompete only) */}
          {user?.tier === 'kompete' && (
            <div style={{ padding: '0 8px 8px' }}>
              <Dropdown menu={adminDropdownItems} trigger={['hover']} placement="rightBottom">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 16px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  color: isAdminRoute ? token.colorPrimary : token.colorTextSecondary,
                  background: isAdminRoute ? token.colorPrimaryBg : 'transparent',
                  transition: 'all 0.2s',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  fontWeight: isAdminRoute ? 600 : 400,
                }}
                  onMouseEnter={e => {
                    if (!isAdminRoute) e.currentTarget.style.background = token.colorBgTextHover;
                  }}
                  onMouseLeave={e => {
                    if (!isAdminRoute) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Shield size={16} />
                  {!collapsed && <span style={{ fontSize: 14 }}>Admin Dashboard</span>}
                </div>
              </Dropdown>
            </div>
          )}

          {/* Bottom section: settings + user info */}
          <div style={{
            borderTop: `1px solid ${token.colorBorderSecondary}`,
            padding: collapsed ? '12px 8px' : '12px 16px',
          }}>
            {/* Settings dropdown */}
            <Dropdown menu={settingsDropdownItems} trigger={['hover']} placement="topRight">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 6,
                cursor: 'pointer',
                color: token.colorTextSecondary,
                transition: 'background 0.2s',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
                onMouseEnter={e => e.currentTarget.style.background = token.colorBgTextHover}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Settings size={16} />
                {!collapsed && <span style={{ fontSize: 13 }}>Settings</span>}
              </div>
            </Dropdown>

            {/* User info */}
            {!collapsed && (
              <div style={{ padding: '8px 12px 4px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: token.colorText, lineHeight: 1.4 }}>
                  {user.full_name || user.email.split('@')[0]}
                </div>
                <div style={{ fontSize: 11, color: token.colorTextSecondary, lineHeight: 1.4, marginTop: 1 }}>
                  {user.email}
                </div>
                <div style={{
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: user.tier === 'kompete' ? '#C9A84C' : token.colorTextTertiary,
                  marginTop: 3,
                  lineHeight: 1.4,
                }}>
                  {getTierLabel(user.tier)}
                </div>
              </div>
            )}
          </div>
        </div>
      </Sider>
      <Layout style={{ marginLeft: currentWidth, transition: 'margin-left 0.2s' }}>
        <Content style={{ padding: isReportPage ? 0 : 32, maxWidth: isReportPage ? '100%' : 1400, margin: '0 auto', width: '100%' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

function App() {
  const [user, setUser] = useState(null);
  const [activeTenantId, setActiveTenantId] = useState(null);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('lastActivity');
    localStorage.removeItem('activeTenantId');
    setUser(null);
    setActiveTenantId(null);
  }, []);

  // Inactivity auto-logout
  useEffect(() => {
    if (!user) return;

    const resetTimer = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(logout, INACTIVITY_TIMEOUT);
    };

    const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0');
    if (lastActivity && Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
      logout();
      return;
    }

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      clearTimeout(timerRef.current);
    };
  }, [user, logout]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0');
      if (lastActivity && Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
        localStorage.removeItem('user');
        localStorage.removeItem('lastActivity');
        localStorage.removeItem('activeTenantId');
      } else {
        const parsed = JSON.parse(savedUser);
        parsed.tier = computeTier(parsed);
        setUser(parsed);
        // Restore active tenant from localStorage, or default to user's tenant
        const raw = localStorage.getItem('activeTenantId');
        const savedTenantId = raw ? Number(raw) : parsed.tenant_id;
        setActiveTenantId(savedTenantId);
        if (savedTenantId) {
          localStorage.setItem('activeTenantId', savedTenantId);
        }
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    userData.tier = computeTier(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    // Set active tenant to user's own tenant on login
    const tenantId = userData.tenant_id;
    setActiveTenantId(tenantId);
    if (tenantId) {
      localStorage.setItem('activeTenantId', tenantId);
    }
    setUser(userData);
  };

  const handleTenantChange = (tenantId) => {
    setActiveTenantId(tenantId);
    localStorage.setItem('activeTenantId', tenantId);
    // Force re-render of data by navigating to current page
    window.location.reload();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <SignIn onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <AppLayout user={user} activeTenantId={activeTenantId} onTenantChange={handleTenantChange} onLogout={() => { setUser(null); setActiveTenantId(null); }}>
        <Routes>
          <Route path="/reports" element={<ReportProjectList reportType="review" />} />
          <Route path="/feature-reports" element={<ReportProjectList reportType="feature" />} />
          <Route path="/projects/:id/report" element={<Report />} />
          <Route path="/projects/:id/feature-report" element={<FeatureReport />} />
          {(user.tier === 'admin' || user.tier === 'kompete') && (
            <Route path="/users" element={<UserManagement />} />
          )}
          {user.tier === 'kompete' && (
            <>
              <Route path="/admin/companies" element={<Companies />} />
              <Route path="/admin/projects" element={<Projects />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/reports" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
