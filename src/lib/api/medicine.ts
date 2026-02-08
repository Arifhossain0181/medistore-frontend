import axios from 'axios';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

export async function getAllMedicines(){
    console.log("Fetching from:", `${API}/api/medicines`)
    const res = await fetch(`${API}/api/medicines`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })

    if(!res.ok){
        throw new Error (`Failed to fetch medicines: ${res.status} ${res.statusText}`)
    }
    
    const response = await res.json();
    console.log("API Response:", response)
    
    // Backend may return { success: true, data: medicines[] } or direct array
    // Handle both formats
    return response.data || response;
}

export async function getSingleMedicine(id: string){
    console.log("Fetching from:", `${API}/api/medicines/${id}`)
    const res = await fetch(`${API}/api/medicines/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if(!res.ok){
        throw new Error (`Failed to fetch medicine: ${res.status} ${res.statusText}`)
    }
    
    const response = await res.json();
    console.log("API Response:", response)
    
    // Backend returns { success: true, data: medicine }
    // Extract the actual medicine data
    return response.data || response;
}

export const fetchCategories = {
  getAllCategories: async function() {
    try {
      const res = await fetch(`${API}/api/categories`, {
        credentials: "include",
        cache: "no-cache"
      });
      const data = await res.json();
      return { data: data, error: null };
    } catch (error) {
      return { data: null, error: error };
    }
  }
};

export async function getAllCategories() {
  try {
    const res = await fetch(`${API}/api/categories`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
    }

    const response = await res.json();
    return response.data || response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function createCategory(name: string) {
  try {
    const res = await axios.post(
      `${API}/api/categories`,
      { name },
      { withCredentials: true }
    );
    return res.data.data || res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating category:", error.response?.data || error.message);
    } else {
      console.error("Error creating category:", error);
    }
    throw error;
  }
}

export async function updateCategory(id: string, name: string) {
  try {
    const res = await axios.patch(
      `${API}/api/categories/${id}`,
      { name },
      { withCredentials: true }
    );
    return res.data.data || res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error updating category:", error.response?.data || error.message);
    } else {
      console.error("Error updating category:", error);
    }
    throw error;
  }
}

export async function deleteCategory(id: string) {
  try {
    const res = await axios.delete(
      `${API}/api/categories/${id}`,
      { withCredentials: true }
    );
    return res.data.data || res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting category:", error.response?.data || error.message);
    } else {
      console.error("Error deleting category:", error);
    }
    throw error;
  }
}
export async function getAllmedicines(){
    try{
        const res = await fetch(`${API}/api/medicines`, {
            method: 'GET',
            credentials: 'include'
        });
        if(!res.ok){
            throw new Error(`Failed to fetch medicines: ${res.status} ${res.statusText}`);
        }
        const response = await res.json();
        return response.data || response;
    } catch (error) {
        console.error("Error fetching medicines:", error);
        throw error;
    }
}
export async function getAlluser(){
    try {
        const res = await axios.get(
            `${API}/api/admin/users`,
            { withCredentials: true }
        );
        return res.data.data || res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching users:", error.response?.data || error.message);
        } else {
            console.error("Error fetching users:", error);
        }
        throw error;
    }
}

// Update medicine
export async function updateMedicine(id: string, data:string | number | object) {
    try {
        const url = `${API}/api/medicines/${id}`;
        console.log('Updating medicine:', { url, id, data });
        
        const res = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        
        console.log('Update response status:', res.status);
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Update failed:', errorText);
            throw new Error(`Failed to update medicine: ${res.status} ${res.statusText}`);
        }
        return await res.json();
    } catch (error) {
        console.error("Error updating medicine:", error);
        throw error;
    }
}

// Delete medicine
export async function deleteMedicine(id: string) {
    try {
        const url = `${API}/api/medicines/${id}`;
        console.log('Deleting medicine:', { url, id });
        
        const res = await fetch(url, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        console.log('Delete response status:', res.status);
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Delete failed:', errorText);
            throw new Error(`Failed to delete medicine: ${res.status} ${res.statusText}`);
        }
        return await res.json();
    } catch (error) {
        console.error("Error deleting medicine:", error);
        throw error;
    }
}

export async function banUser(userId: string) {
    try {
        const res = await axios.patch(
            `${API}/api/admin/users/${userId}`,
            { isBanned: true },
            { withCredentials: true }
        );
        return res.data.data || res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error banning user:", error.response?.data || error.message);
        } else {
            console.error("Error banning user:", error);
        }
        throw error;
    }
}

export async function unbanUser(userId: string) {
    try {
        const res = await axios.patch(
            `${API}/api/admin/users/${userId}`,
            { isBanned: false },
            { withCredentials: true }
        );
        return res.data.data || res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error unbanning user:", error.response?.data || error.message);
        } else {
            console.error("Error unbanning user:", error);
        }
        throw error;
    }
}

export async function updateUserRole(userId: string, role: "CUSTOMER" | "SELLER" | "ADMIN") {
    try {
        const res = await axios.patch(
            `${API}/api/admin/users/${userId}/role`,
            { role },
            { withCredentials: true }
        );
        return res.data.data || res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error updating user role:", error.response?.data || error.message);
        } else {
            console.error("Error updating user role:", error);
        }
        throw error;
    }
}



