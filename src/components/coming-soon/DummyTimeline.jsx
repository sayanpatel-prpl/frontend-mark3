/**
 * Vertical timeline with colored dots for preview pages.
 * @param {{ items: Array<{ date: string, title: string, desc?: string, color?: string, tag?: string, tagColor?: string }> }} props
 */
export default function DummyTimeline({ items }) {
  return (
    <div className="dummy-timeline">
      {items.map((item, i) => (
        <div className="dummy-timeline-item" key={i}>
          <div
            className="dummy-timeline-dot"
            style={{ background: item.color || '#C9A84C' }}
          />
          <div className="dummy-timeline-date">{item.date}</div>
          <div className="dummy-timeline-title">{item.title}</div>
          {item.desc && <div className="dummy-timeline-desc">{item.desc}</div>}
          {item.tag && (
            <span
              className="dummy-timeline-tag"
              style={{
                background: (item.tagColor || '#C9A84C') + '20',
                color: item.tagColor || '#C9A84C',
              }}
            >
              {item.tag}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
