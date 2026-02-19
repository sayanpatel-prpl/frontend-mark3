const CLASSES = { HIGH: 'threat-high', MEDIUM: 'threat-medium', LOW: 'threat-low' };

export default function ThreatBadge({ level }) {
  if (!level) return null;
  return <span className={`threat-badge ${CLASSES[level] || ''}`}>{level}</span>;
}
