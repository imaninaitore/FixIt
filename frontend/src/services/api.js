export const API_URL = "http://127.0.0.1:8000/api";

export async function getProviders() {//creates a function that React can use whenever it needs providers.

    const response = await fetch(`${API_URL}/providers/`); //make a request to your existing Django endpoint
    if (!response.ok) {
        throw new Error("Failed to fetch providers");
    }

    return response.json();
}