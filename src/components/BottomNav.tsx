import type { Screen } from '../App.js'

const NAV_ITEMS: Array<{ screen: Screen; label: string; icon: string }> = [
  { screen: 'home', label: '首页', icon: '⌂' },
  { screen: 'inventory', label: '库存', icon: '□' },
  { screen: 'form', label: '录入', icon: '+' },
  { screen: 'settings', label: '设置', icon: '⚙' },
]

export function BottomNav({
  current,
  onChange,
}: {
  current: Screen
  onChange: (screen: Screen) => void
}) {
  return (
    <nav className="bottom-nav" aria-label="主导航">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.screen}
          className={item.screen === current ? 'active' : ''}
          type="button"
          onClick={() => onChange(item.screen)}
        >
          <span aria-hidden="true">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  )
}
