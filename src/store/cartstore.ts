import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CartItem ={
    id: string;
    name: string;
    price: number;
    quantity: number;
    manufacturer: string;
    imageUrl?: string;
    viewCount?: number;
    description?: string;
}

type CartState ={
    items: CartItem[];
    userId: string | null;
    userCarts: Record<string, CartItem[]>; // Store separate cart for each user
    setUserId: (userId: string | null) => void;
    addToCart:(item:Omit<CartItem, 'quantity'>) => void;
    removeFromCart:(id:string) => void;
    incrementQuantity:(id:string) => void;
    decrementQuantity:(id:string) => void;
    updateQuantity:(id:string, quantity:number) => void;
    clearCart:() => void;
    getTotalItems:() => number;
    getTotalPrice:() => number;
    getItemQuantity:(id:string) => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set ,get) => ({
    items:[],
    userId: null,
    userCarts: {}, // Initialize empty object to store each user's cart

    setUserId: (userId) => {
        const currentUserId = get().userId;
        
        // Save current cart to the current user before switching
        if (currentUserId) {
            const currentItems = get().items;
            set((state) => ({
                userCarts: {
                    ...state.userCarts,
                    [currentUserId]: currentItems
                }
            }));
        }
        
        // Load cart for the new user
        // If userId is null (logout), keep current items visible
        // If userId is different, load that user's cart
        if (userId === null) {
            set({ userId: null }); // Just update userId, keep items
        } else if (currentUserId !== userId) {
            const newUserCart = get().userCarts[userId] || [];
            set({ userId, items: newUserCart });
        } else {
            set({ userId });
        }
    },

    addToCart: (item) => {
        const existing = get().items.find((i)=>i.id === item.id);
        if(existing){
            set({
                items:get().items.map((i) =>i.id === item.id ? {...i,quantity: i.quantity + 1} : i)
            })
        }
        else{
            set({items:[...get().items,{...item,quantity:1}]})
        }
    },
    incrementQuantity:(id)=>{
        set({
            items:get().items.map((i)=>i.id === id?{
                ...i ,quantity: i.quantity +1
            } : i)
        })
    },
    decrementQuantity:(id) =>{
        set({
            items:get().items.map((i) => 
            i.id === id ?{
                ...i ,quantity: i.quantity -1
            } : i).filter((i) => i.quantity > 0)
        })
    },
    updateQuantity:(id, quantity) =>{
        if (quantity <= 0) {
            get().removeFromCart(id);
            return;
        }
        set({
            items:get().items.map((i) => 
                i.id === id ? {...i, quantity} : i
            )
        })
    },
    removeFromCart:(id) =>{
        set({
            items:get().items.filter((i) =>
            i.id !== id)
        })
    },
    clearCart:() =>{
        set({items:[]})
    },
    getTotalItems:() =>{
        return get().items.reduce((total, item) => total + item.quantity, 0);
    },
    getTotalPrice:() =>{
        return get().items.reduce((total, item) => total + ((item.price || 0) * item.quantity), 0);
    },
    getItemQuantity:(id) =>{
        const item = get().items.find((i) => i.id === id);
        return item ? item.quantity : 0;
    }

}),
        {
            name: 'medistore-cart',
            storage: createJSONStorage(() => localStorage),
        }
    )
)