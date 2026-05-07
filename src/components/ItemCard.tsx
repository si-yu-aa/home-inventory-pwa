import { getExpiryStatus } from '../domain/expiry.js'
import type { InventoryItem } from '../domain/inventory.js'
import { ExpandableNote } from './ExpandableNote.js'

export function ItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: InventoryItem
  onEdit: () => void
  onDelete: () => void
}) {
  const status = getExpiryStatus(item)
  const noteText = [item.brand, item.notes].filter(Boolean).join(' · ')

  return (
    <article className="item-card">
      {item.photoDataUrl ? <img src={item.photoDataUrl} alt="" className="item-photo" /> : <div className="photo-fallback" />}
      <div className="item-main">
        <div className="item-title-row">
          <h3>{item.name}</h3>
          <span className={`status-pill ${status.kind}`}>{status.label}</span>
        </div>
        <p className="muted">
          {item.category} · 数量 {item.quantity} {item.unit}
          {item.location ? ` · ${item.location}` : ''}
        </p>
        {noteText ? <ExpandableNote text={noteText} /> : null}
        <div className="row-actions">
          <button type="button" onClick={onEdit}>
            编辑
          </button>
          <button type="button" className="ghost danger" onClick={onDelete}>
            删除
          </button>
        </div>
      </div>
    </article>
  )
}
