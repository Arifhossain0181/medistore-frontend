import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CartItem ={
    id: string;
    name: string;
    price: number;
    quantity: number;
    manufacturer: string;
    imageUrl?: string;
    stock?: number;
    viewCount?: number;
    description?: string;
}

type CartState ={
    items: CartItem[];
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