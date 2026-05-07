import { useState } from 'react'

const COLLAPSE_THRESHOLD = 34

export function ExpandableNote({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false)
  const canExpand = text.length > COLLAPSE_THRESHOLD

  return (
    <div className="item-note-row">
      <p className={`item-note ${expanded ? 'expanded' : 'collapsed'}`}>{text}</p>
      {canExpand ? (
        <button
          type="button"
          className="note-toggle"
          aria-label={expanded ? '收起备注' : '展开完整备注'}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? '收起' : '...'}
        </button>
      ) : null}
    </div>
  )
}
