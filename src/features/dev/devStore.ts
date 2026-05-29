import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DevState {
  unlockAll: boolean
  toggle: () => void
}

export const useDevStore = create<DevState>()(
  persist(
    (set, get) => ({
      unlockAll: false,
      toggle: () => set({ unlockAll: !get().unlockAll }),
    }),
    { name: 'react-academy-dev' }
  )
)
