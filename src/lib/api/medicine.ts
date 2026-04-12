import axios from 'axios';

export type MedicineReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    name?: string;
  };
};

export async function getAllMedicines(){
    console.log("Fetching from:", `/api/medicines`)
    const res = await fetch(`/api/medicines`, {
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
    console.log("Fetching from:", `/api/medicines/${id}`)
    const res = await fetch(`/api/medicines/${id}`, {
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

  export async function incrementMedicineView(id: string) {
    const url = `/api/medicines/${id}/view`;

    try {
      if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        const beaconOk = navigator.sendBeacon(url);
        if (beaconOk) {
          return;
        }
      }

      await fetch(url, {
        method: 'POST',
        credentials: 'include',
        keepalive: true,
      });
    } catch (error) {
      console.error("Failed to increment medicine view:", error);
    }
  }

  export async function getMedicineReviews(medicineId: string): Promise<MedicineReview[]> {
    const res = await fetch(`/api/reviews/medicine/${medicineId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch reviews: ${res.status} ${res.statusText}`);
    }

    const response = await res.json();
    return response.data || [];
  }

  export async function createMedicineReview(payload: {
    medicineId: string;
    rating: number;
    comment: string;
  }): Promise<MedicineReview> {
    const res = await fetch(`/api/reviews`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const response = await res.json().catch(() => ({}));

    if (!res.ok || response?.success === false) {
      throw new Error(response?.message || `Failed to create review: ${res.status} ${res.statusText}`);
    }

    return response.data;
  }

export const fetchCategories = {
  getAllCategories: async function() {
    try {
      const res = await fetch(`/api/categories`, {
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
    console.log("Fetching categories from:", `/api/categories`);
    
    const res = await fetch(`/api/categories`, {
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
    console.log("Categories fetched successfully:", response);
    return response.data || response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function createCategory(name: string) {
  try {
    const res = await axios.post(
      `/api/categories`,
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
      `/api/categories/${id}`,
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
      `/api/categories/${id}`,
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
        const res = await fetch(`/api/medicines`, {
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
            `/api/admin/users`,
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
        const url = `/api/medicines/${id}`;
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
        const res = await axios.delete(
            `/api/medicines/${id}`,
            { withCredentials: true }
        );
        return res.data.data || res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error deleting medicine:", error.response?.data || error.message);
        } else {
            console.error("Error deleting medicine:", error);
        }
        throw error;
    }
}

export async function banUser(userId: string) {
    try {
        const res = await axios.patch(
      `/api/admin/users/${userId}/ban`,
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
      `/api/admin/users/${userId}/ban`,
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

export async function updateUserRole(
  userId: string,
  role: "CUSTOMER" | "SELLER" | "ADMIN" | "DELIVERY_MAN",
) {
    try {
        const res = await axios.patch(
      `/api/admin/users/${userId}/role`,
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

    export type DeliveryManApplication = {
      id: string;
      status: "PENDING" | "APPROVED" | "REJECTED";
      phone: string;
      nidNumber: string;
      licenseNumber: string;
      vehicleType: string;
      vehicleRegistrationNo: string;
      deliveryArea: string;
      currentAddress: string;
      emergencyContactName: string;
      emergencyContactPhone: string;
      rejectionReason?: string | null;
      reviewedAt?: string | null;
      createdAt: string;
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
        status?: string | null;
      };
    };

    export async function getDeliveryManApplications() {
      try {
        const res = await axios.get(`/api/admin/delivery-man-applications`, { withCredentials: true });
        return (res.data.data || res.data) as DeliveryManApplication[];
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching delivery man applications:", error.response?.data || error.message);
        } else {
          console.error("Error fetching delivery man applications:", error);
        }
        throw error;
      }
    }

    export async function reviewDeliveryManApplication(
      applicationId: string,
      action: "APPROVE" | "REJECT",
      rejectionReason?: string,
    ) {
      try {
        const res = await axios.patch(
          `/api/admin/delivery-man-applications/${applicationId}/review`,
          { action, rejectionReason },
          { withCredentials: true },
        );
        return res.data.data || res.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error reviewing delivery man application:", error.response?.data || error.message);
        } else {
          console.error("Error reviewing delivery man application:", error);
        }
        throw error;
      }
    }



