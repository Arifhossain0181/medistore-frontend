
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type User ={
    id: string;
    name:string;
    email:string;
    role:'ADMIN' | 'SELLER' | 'CUSTOMER' | 'SUPER_ADMIN' | 'DELIVERY_MAN';
    image?:string;
}

type AuthState = {
    user :User | null;
    isAuthenticated:boolean;
    hasHydrated: boolean;
    setUser: (user:User | null) =>void;
    setHasHydrated: (value: boolean) => void;
    logout:()=> void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            hasHydrated: false,
            setUser: (user) => {
                set({
                    user,
                    isAuthenticated: !!user,
                })
            },
            setHasHydrated: (value) => {
                set({ hasHydrated: value })
            },
            logout: () => {
                set({ user: null, isAuthenticated: false })
            }
        }),
        {
            name: 'medistore-auth',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
)