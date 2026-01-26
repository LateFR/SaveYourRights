import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage";

type AppState = {
    firstLaunch: boolean,
    setFirstLaunch: (firstLaunch: boolean) => void,
    _hasHydrated: boolean,
    setHasHydrated: (state: boolean) => void
}


export const useAppStore = create(
    persist<AppState>(
        (set)=>({
            firstLaunch: true,
            setFirstLaunch: (firstLaunch: boolean) => set({firstLaunch}),
            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state})
        }), {
            name: "app-storage",
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true)
            }
        }
    )
)