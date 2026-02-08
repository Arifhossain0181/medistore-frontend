import { env } from  "../../env";

const API_BASE_URL = env.API_BASE_URL;

export const fetchOrders = {
  getOrders: async function(){
    try{
      const res = await fetch(`${API_BASE_URL}/api/orders/admin/all`,{
        credentials: "include",
        cache: "no-cache"
      })
      const data = await res.json();
      return {data: data ,error:null}      
    }catch(error){
      return {data:null,error:error}
    }

  },
  
  getSellerOrders: async function(){
    try{
      const res = await fetch(`${API_BASE_URL}/api/orders/seller/orders`,{
        credentials: "include",
        cache: "no-cache"
      })
      const data = await res.json();
      return {data: data ,error:null}      
    }catch(error){
      return {data:null,error:error}
    }
  }
}

// Create order
export async function createOrder(orderData: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(orderData),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to create order");
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

// Get customer orders (my orders)
export async function getMyOrders() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      credentials: "include",
      cache: "no-cache"
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch orders: ${res.status}`);
    }
    
    const data = await res.json();
    return data?.data || data || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

// Get single order details
export async function getSingleOrder(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
      credentials: "include",
      cache: "no-cache"
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch order: ${res.status}`);
    }
    
    const data = await res.json();
    return data?.data || data;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
}

