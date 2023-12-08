import { create } from 'zustand'
import { FriendsTabEnum } from '../rediscord-lib/types/friend-tab-prop'

interface FriendsTabState {
  currentTab: FriendsTabEnum
  setCurrentTab: (tab: FriendsTabEnum) => void
}

export const useFriendsTabStore = create<FriendsTabState>()((set) => ({
  currentTab: FriendsTabEnum.Available,
  setCurrentTab: (tab) => set({ currentTab: tab }),
}))
