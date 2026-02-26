import { useState, useCallback, useMemo } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { theme } from 'antd';

const STORAGE_PREFIX = 'kompete-sidebar-order-';

function getStoredOrder(userId) {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${userId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredOrder(userId, order) {
  localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(order));
}

function reconcileOrder(storedOrder, items) {
  const itemKeys = items.map((i) => i.key);
  const filtered = storedOrder.filter((k) => itemKeys.includes(k));
  const missing = itemKeys.filter((k) => !filtered.includes(k));
  return [...filtered, ...missing];
}

function SortableItem({ item, isActive, collapsed, onClick }) {
  const { token } = theme.useToken();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: collapsed ? '10px 0' : '10px 16px',
    margin: collapsed ? '2px 8px' : '2px 8px',
    borderRadius: 6,
    cursor: 'pointer',
    color: isActive ? token.colorPrimary : token.colorTextSecondary,
    background: isActive ? token.colorPrimaryBg : 'transparent',
    fontWeight: isActive ? 600 : 400,
    fontSize: 14,
    justifyContent: collapsed ? 'center' : 'flex-start',
    userSelect: 'none',
  };

  return (
    <div ref={setNodeRef} style={style} onClick={() => onClick(item.key)}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = token.colorBgTextHover; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
    >
      {!collapsed && (
        <span
          {...attributes}
          {...listeners}
          style={{ cursor: 'grab', display: 'flex', alignItems: 'center', color: token.colorTextQuaternary, flexShrink: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical size={14} />
        </span>
      )}
      <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{item.icon}</span>
      {!collapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
    </div>
  );
}

function PinnedItem({ item, isActive, collapsed, onClick }) {
  const { token } = theme.useToken();

  const style = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: collapsed ? '10px 0' : '10px 16px',
    margin: collapsed ? '2px 8px' : '2px 8px',
    borderRadius: 6,
    cursor: 'pointer',
    color: isActive ? token.colorPrimary : token.colorTextSecondary,
    background: isActive ? token.colorPrimaryBg : 'transparent',
    fontWeight: isActive ? 600 : 400,
    fontSize: 14,
    justifyContent: collapsed ? 'center' : 'flex-start',
  };

  return (
    <div style={style} onClick={() => onClick(item.key)}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = token.colorBgTextHover; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
    >
      {!collapsed && <span style={{ width: 14, flexShrink: 0 }} />}
      <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{item.icon}</span>
      {!collapsed && <span>{item.label}</span>}
    </div>
  );
}

export default function SortableSidebar({ items, pinnedItems = [], userId, collapsed, selectedKeys, onNavigate }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const sortableKeys = useMemo(() => items.map((i) => i.key), [items]);

  const [order, setOrder] = useState(() => {
    const stored = getStoredOrder(userId);
    if (stored) return reconcileOrder(stored, items);
    return sortableKeys;
  });

  const orderedItems = useMemo(() => {
    const reconciled = reconcileOrder(order, items);
    const itemMap = Object.fromEntries(items.map((i) => [i.key, i]));
    return reconciled.map((k) => itemMap[k]).filter(Boolean);
  }, [order, items]);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOrder((prev) => {
      const oldIndex = prev.indexOf(active.id);
      const newIndex = prev.indexOf(over.id);
      const next = arrayMove(prev, oldIndex, newIndex);
      setStoredOrder(userId, next);
      return next;
    });
  }, [userId]);

  return (
    <div style={{ flex: 1, paddingTop: 4 }}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={orderedItems.map((i) => i.key)} strategy={verticalListSortingStrategy}>
          {orderedItems.map((item) => (
            <SortableItem
              key={item.key}
              item={item}
              isActive={selectedKeys.includes(item.key)}
              collapsed={collapsed}
              onClick={onNavigate}
            />
          ))}
        </SortableContext>
      </DndContext>
      {pinnedItems.map((item) => (
        <PinnedItem
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
