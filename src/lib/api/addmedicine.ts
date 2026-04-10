import axios from 'axios';

// Simple interface for medicine data
export interface MedicineData {
    name: string;
    description: string;
    price: number;
    stock: number;
    manufacturer: string;
    categoryId: string;
    imageUrl: string;
}

// Simple async function to add medicine
export async function addmedicine(med: MedicineData) {
    try {
        const res = await axios.post(
            `/api/medicines`,
            med,
            { withCredentials: true }
        );
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data?.message || error.message;
            
            if (status === 401) {
                throw new Error("Unauthorized: You must be logged in as a SELLER. If you were just promoted, please logout and login again.");
            }
            throw new Error(message);
        }
        throw error;
    }
}

