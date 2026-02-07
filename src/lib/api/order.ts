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

  }
}