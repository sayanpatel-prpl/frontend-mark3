import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { theme } from 'antd';

const STORAGE_PREFIX = 'kompete-sidebar-sections-';

function getStoredSections(userId) {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${userId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredSections(userId, sections) {
  localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(sections));
}

function ComingSoonTag() {
  return (
    <span style={{
      fontSize: 9,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      background: '#FEE2E2',
      color: '#DC2626',
      padding: '1px 6px',
      borderRadius: 4,
      marginLeft: 'auto',
      flexShrink: 0,
      lineHeight: '16px',
    }}>
      Soon
    </span>
  );
}

function SidebarItem({ item, isActive, collapsed, onClick }) {
  const { token } = theme.useToken();
  const disabled = item.comingSoon;

  const style = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: collapsed ? '7px 0' : '7px 16px 7px 40px',
    margin: '1px 8px',
    borderRadius: 6,
    cursor: disabled ? 'default' : 'pointer',
    color: disabled ? token.colorTextQuaternary : isActive ? token.colorPrimary : token.colorTextSecondary,
    background: isActive && !disabled ? token.colorPrimaryBg : 'transparent',
    fontWeight: isActive ? 600 : 400,
    fontSize: 13,
    justifyContent: collapsed ? 'center' : 'flex-start',
    userSelect: 'none',
    opacity: disabled ? 0.6 : 1,
    transition: 'background 0.15s',
  };

  return (
    <div
      style={style}
      onClick={() => !disabled && onClick(item.key)}
      onMouseEnter={e => { if (!isActive && !disabled) e.currentTarget.style.background = token.colorBgTextHover; }}
      onMouseLeave={e => { if (!isActive && !disabled) e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{item.icon}</span>
      {!collapsed && (
        <>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
          {disabled && <ComingSoonTag />}
        </>
      )}
    </div>
  );
}

function SectionHeader({ label, collapsed, isOpen, onToggle }) {
  const { token } = theme.useToken();

  if (collapsed) return null;

  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '10px 16px 4px 16px',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', color: token.colorTextQuaternary }}>
        {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </span>
      <span style={{
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: token.colorTextTertiary,
      }}>
        {label}
      </span>
    </div>
  );
}

export default function SortableSidebar({ sections, pinnedItems = [], userId, collapsed, selectedKeys, onNavigate }) {
  const [openSections, setOpenSections] = useState(() => {
    const stored = getStoredSections(userId);
    if (stored) return stored;
    // Default all sections open
    const defaults = {};
    (sections || []).forEach(s => { defaults[s.key] = true; });
    return defaults;
  });

  const toggleSection = (sectionKey) => {
    setOpenSections(prev => {
      const next = { ...prev, [sectionKey]: !prev[sectionKey] };
      setStoredSections(userId, next);
      return next;
    });
  };

  return (
    <div style={{ flex: 1, paddingTop: 4, overflowY: 'auto' }}>
      {(sections || []).map((section) => {
        const isOpen = openSections[section.key] !== false;
        return (
          <div key={section.key}>
            <SectionHeader
              label={section.label}
              collapsed={collapsed}
              isOpen={isOpen}
              onToggle={() => toggleSection(section.key)}
            />
            {(isOpen || collapsed) && (section.items || []).map((item) => (
              <SidebarItem
                key={item.key}
                item={item}
                isActive={selectedKeys.includes(item.key)}
                collapsed={collapsed}
                onClick={onNavigate}
              />
            ))}
          </div>
        );
      })}

      {pinnedItems.map((item) => (
        <SidebarItem
          key={item.key}
          item={item}
          isActive={selectedKeys.includes(item.key)}
          collapsed={collapsed}
          onClick={onNavigate}
        />
      ))}
    </div>
  );
}
