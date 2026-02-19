import { useState, useEffect } from 'react';
import { useCollapsibleSignals } from './CollapsibleContext';

export default function Collapsible({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const { expandSignal, collapseSignal } = useCollapsibleSignals();

  useEffect(() => {
    if (expandSignal > 0) setOpen(true);
  }, [expandSignal]);

  useEffect(() => {
    if (collapseSignal > 0) setOpen(false);
  }, [collapseSignal]);

  return (
    <div className={`collapsible${open ? ' open' : ''}`}>
      <div className="collapsible-header" onClick={() => setOpen((v) => !v)}>
        <span className="collapsible-title">{title}</span>
        <span className="collapsible-icon">&#9660;</span>
      </div>
      <div className="collapsible-content">
        <div className="collapsible-body">{children}</div>
      </div>
    </div>
  );
}
