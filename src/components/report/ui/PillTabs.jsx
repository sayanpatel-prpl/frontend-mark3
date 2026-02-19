export default function PillTabs({ tabs, activeKey, onChange }) {
  return (
    <div className="nav-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`nav-tab${tab.key === activeKey ? ' active' : ''}${tab.mainCompany ? ' main-company-tab' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
