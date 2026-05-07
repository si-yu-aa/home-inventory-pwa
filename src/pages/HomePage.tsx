import { summarizeExpiry } from '../domain/expiry.js'
import type { InventoryItem } from '../domain/inventory.js'
import { ItemCard } from '../components/ItemCard.js'

export function HomePage({
  items,
  onEdit,
  onDelete,
}: {
  items: InventoryItem[]
  onEdit: (item: InventoryItem) => void
  onDelete: (id: string) => void
}) {
  const summary = summarizeExpiry(items)
  const priorityItems = [...summary.expired, ...summary.soon].slice(0, 5)

  return (
    <main className="screen">
      <header className="screen-header">
        <p className="eyebrow">家庭库存</p>
        <h1>先看看哪些东西该用掉</h1>
      </header>

      <section className="stats-grid" aria-label="库存概览">
        <div className="stat danger">
          <span>{summary.expired.length}</span>
          已过期
        </div>
        <div className="stat warning">
          <span>{summary.soon.length}</span>
          30 天内到期
        </div>
        <div className="stat quiet">
          <span>{summary.missing.length}</span>
          未设到期日
        </div>
        <div className="stat fresh">
          <span>{items.length}</span>
          总库存
        </div>
      </section>

      <section className="section-block">
        <div className="section-title">
          <h2>优先处理</h2>
          <p>只展示强提醒，未设置到期日保持低优先级。</p>
        </div>
        {priorityItems.length > 0 ? (
          <div className="item-list">
            {priorityItems.map((item) => (
              <ItemCard key={item.id} item={item} onEdit={() => onEdit(item)} onDelete={() => onDelete(item.id)} />
            ))}
          </div>
        ) : (
          <p className="empty-state">目前没有已过期或即将到期的物品。</p>
        )}
      </section>
    </main>
  )
}

