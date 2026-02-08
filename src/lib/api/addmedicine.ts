import { env } from  "../../env";

const API_BASE_URL = env.API_BASE_URL;

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
        const res = await fetch(`${API_BASE_URL}/api/medicines`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(med),
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        return await res.json();
    } catch (error) {
        console.error("Error in addmedicine:", error);
        throw error;
    }
}

