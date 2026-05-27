import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Service, ServiceItem } from '@/types'

interface ServiceState {
  service: Service | null
  items: ServiceItem[]
  activeItemId: string | null

  setService: (service: Service) => void
  setItems: (items: ServiceItem[]) => void
  addItem: (item: Partial<ServiceItem>) => void
  removeItem: (id: string) => void
  updateItem: (id: string, updates: Partial<ServiceItem>) => void
  setActiveItem: (id: string | null) => void
  reorderItems: (items: ServiceItem[]) => void
}

export const useServiceStore = create<ServiceState>()(
  devtools(
    (set) => ({
      service: null,
      items: [],
      activeItemId: null,

      setService: (service) => set({ service }),
      setItems: (items) => set({ items }),
      addItem: (item) => set(s => ({
        items: [...s.items, {
          id: `si-${Date.now()}`,
          service_id: s.service?.id ?? 'local',
          type: 'song',
          label: 'New Item',
          item_order: s.items.length + 1,
          metadata: {},
          ...item,
        } as ServiceItem]
      })),
      removeItem: (id) => set(s => ({ items: s.items.filter(i => i.id !== id) })),
      updateItem: (id, updates) => set(s => ({
        items: s.items.map(i => i.id === id ? { ...i, ...updates } : i)
      })),
      setActiveItem: (id) => set({ activeItemId: id }),
      reorderItems: (items) => set({ items }),
    }),
    { name: 'service' }
  )
)
