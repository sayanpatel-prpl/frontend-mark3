import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { theme } from 'antd';

const STORAGE_PREFIX = 'kompete-sidebar-sections-';
const EXPLORE_STORAGE_KEY = 'kompete-sidebar-explore-open';

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

function PreviewTag() {
  return (
    <span className="preview-tag">
      Preview
    </span>
  );
}

function SidebarItem({ item, isActive, collapsed, onClick }) {
  const { token } = theme.useToken();
  const isPreview = item.preview;

  const style = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: collapsed ? '7px 0' : '7px 16px 7px 40px',
    margin: '1px 8px',
    borderRadius: 6,
    cursor: 'pointer',
    color: isPreview
      ? (isActive ? token.colorPrimary : token.colorTextTertiary)
      : (isActive ? token.colorPrimary : token.colorTextSecondary),
    background: isActive ? token.colorPrimaryBg : 'transparent',
    fontWeight: isActive ? 600 : 400,
    fontSize: 13,
    justifyContent: collapsed ? 'center' : 'flex-start',
    userSelect: 'none',
    transition: 'background 0.15s',
  };

  return (
    <div
      style={style}
      onClick={() => onClick(item.key)}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = token.colorBgTextHover; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{item.icon}</span>
      {!collapsed && (
        <>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
          {isPreview && <PreviewTag />}
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

function SectionDivider({ collapsed }) {
  if (collapsed) return null;
  return <hr className="preview-section-divider" />;
}

export default function SortableSidebar({ sections, exploreSections = [], pinnedItems = [], userId, collapsed, selectedKeys, onNavigate }) {
  const [openSections, setOpenSections] = useState(() => {
    const stored = getStoredSections(userId);
    if (stored) return stored;
    // Default all sections collapsed
    const defaults = {};
    (sections || []).forEach(s => { defaults[s.key] = false; });
    (exploreSections || []).forEach(s => { defaults[s.key] = false; });
    return defaults;
  });

  const [exploreOpen, setExploreOpen] = useState(() => {
    try {
      return localStorage.getItem(EXPLORE_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const toggleSection = (sectionKey) => {
    setOpenSections(prev => {
      const next = { ...prev, [sectionKey]: !prev[sectionKey] };
      setStoredSections(userId, next);
      return next;
    });
  };

  const toggleExplore = () => {
    setExploreOpen(prev => {
      const next = !prev;
      localStorage.setItem(EXPLORE_STORAGE_KEY, String(next));
      return next;
    });
  };

  // Count total explore items
  const exploreItemCount = (exploreSections || []).reduce((sum, s) => sum + (s.items || []).length, 0);

  const { token } = theme.useToken();

  return (
    <div style={{ flex: 1, paddingTop: 4, overflowY: 'auto' }}>
      {/* Primary sections (have at least 1 live item) */}
      {(sections || []).map((section) => {
        const isOpen = openSections[section.key] !== false;
        const liveItems = (section.items || []).filter(i => !i.preview);
        const previewItems = (section.items || []).filter(i => i.preview);
        const hasBoth = liveItems.length > 0 && previewItems.length > 0;

        return (
          <div key={section.key}>
            <SectionHeader
              label={section.label}
              collapsed={collapsed}
              isOpen={isOpen}
              onToggle={() => toggleSection(section.key)}
            />
            {(isOpen || collapsed) && (
              <>
                {liveItems.map((item) => (
                  <SidebarItem
                    key={item.key}
                    item={item}
                    isActive={selectedKeys.includes(item.key)}
                    collapsed={collapsed}
                    onClick={onNavigate}
                  />
                ))}
                {hasBoth && <SectionDivider collapsed={collapsed} />}
                {previewItems.map((item) => (
                  <SidebarItem
                    key={item.key}
                    item={item}
                    isActive={selectedKeys.includes(item.key)}
                    collapsed={collapsed}
                    onClick={onNavigate}
                  />
                ))}
              </>
            )}
          </div>
        );
      })}

      {/* Pinned items */}
      {pinnedItems.map((item) => (
        <SidebarItem
          key={item.key}
          item={item}
          isActive={selectedKeys.includes(item.key)}
          collapsed={collapsed}
          onClick={onNavigate}
        />
      ))}

      {/* Explore Upcoming meta-section */}
      {exploreSections.length > 0 && !collapsed && (
        <>
          <hr className="explore-upcoming-separator" />
          <div
            className="explore-upcoming-header"
            onClick={toggleExplore}
          >
            <span style={{ display: 'flex', alignItems: 'center', color: '#C9A84C' }}>
              {exploreOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </span>
            <span className="explore-upcoming-label">Explore Upcoming</span>
            <span className="explore-upcoming-count">({exploreItemCount})</span>
          </div>

          {exploreOpen && (
            <>
              {(exploreSections || []).map((section) => {
                const isOpen = openSections[section.key] !== false;
                return (
                  <div key={section.key}>
                    <SectionHeader
                      label={section.label}
                      collapsed={collapsed}
                      isOpen={isOpen}
                      onToggle={() => toggleSection(section.key)}
                    />
                    {isOpen && (section.items || []).map((item) => (
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
            </>
          )}
        </>
      )}

      {/* Collapsed: show explore items inline */}
      {exploreSections.length > 0 && collapsed && (
        <>
          {(exploreSections || []).flatMap(s => s.items || []).map((item) => (
            <SidebarItem
              key={item.key}
              item={item}
              isActive={selectedKeys.includes(item.key)}
              collapsed={collapsed}
              onClick={onNavigate}
            />
          ))}
        </>
      )}
    </div>
  );
}
