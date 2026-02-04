
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
    return res.json();
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
    return res.json();
}