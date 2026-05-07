import { useState } from 'react'

import './App.css'
import { BottomNav } from './components/BottomNav.js'
import type { InventoryItem } from './domain/inventory.js'
import { useInventory } from './features/inventory/useInventory.js'
import { EntryPage } from './pages/EntryPage.js'
import { HomePage } from './pages/HomePage.js'
import { InventoryPage } from './pages/InventoryPage.js'
import { SettingsPage } from './pages/SettingsPage.js'

export type Screen = 'home' | 'inventory' | 'form' | 'settings'

function App() {
  const inventory = useInventory()
  const [screen, setScreen] = useState<Screen>('home')
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>()

  function editItem(item: InventoryItem) {
    setEditingItem(item)
    setScreen('form')
  }

  return (
    <div className="app-shell">
      {screen === 'home' ? (
        <HomePage items={inventory.items} onEdit={editItem} onDelete={inventory.deleteItem} />
      ) : null}

      {screen === 'inventory' ? (
        <InventoryPage items={inventory.items} onEdit={editItem} onDelete={inventory.deleteItem} />
      ) : null}

      {screen === 'form' ? (
        <EntryPage
          editingItem={editingItem}
          onCancelEdit={() => setEditingItem(undefined)}
          onSave={(draft) => {
            if (editingItem) {
              inventory.updateItem(editingItem.id, draft)
              setEditingItem(undefined)
            } else {
              inventory.addItem(draft)
            }
            setScreen('inventory')
          }}
          onBulkImport={(drafts) => {
            inventory.addItems(drafts)
            setScreen('inventory')
          }}
        />
      ) : null}

      {screen === 'settings' ? (
        <SettingsPage
          total={inventory.items.length}
          onExport={inventory.exportJson}
          onImport={inventory.importJson}
          onClear={inventory.clearItems}
        />
      ) : null}

      <BottomNav
        current={screen}
        onChange={(next) => {
          if (next !== 'form') setEditingItem(undefined)
          setScreen(next)
        }}
      />
    </div>
  )
}

export default App
