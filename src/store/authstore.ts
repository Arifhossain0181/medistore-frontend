
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type User ={
    id: string;
    name:string;
    email:string;
    role:'ADMIN' | 'SELLER' |'CUSTOMER';
}

type AuthState = {
    user :User | null;
    isAuthenticated:boolean;
    setUser: (user:User | null) =>void;
    logout:()=> void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            setUser: (user) => {
                set({
                    user,
                    isAuthenticated: !!user,
                })
            },
            logout: () => {
                set({ user: null, isAuthenticated: false })
            }
        }),
        {
            name: 'medistore-auth',
            storage: createJSONStorage(() => localStorage),
        }
    )
)