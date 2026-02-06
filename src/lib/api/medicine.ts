
const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

export async function getAllMedicines(){
    console.log("Fetching from:", `${API}/api/medicines`)
    const res = await fetch(`${API}/api/medicines`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
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
export async function incrementViewCount(id: string) {
  try {
    console.log("Attempting to increment view count for ID:", id)
    console.log("API URL:", `${API}/api/medicines/${id}/view`)
    
    const res = await fetch(`${API}/api/medicines/${id}/view`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
    
    console.log("Response status:", res.status)
    
    if (!res.ok) {
      console.error(
        ` Failed to increment view count: ${res.status} ${res.statusText}`
      )
      return false
    }
    
    const data = await res.json()
    console.log(" View count incremented successfully:", data)
    return true
  } catch (err) {
    console.error(" Error incrementing view count:", err)
    return false
  }
}