// src/services/apiService.js
const basePath = "https://techsavy-api-6c5y.onrender.com/api/TechSavy/";


async function handleResponse(response) {
    // 1. If it's a 200 OK success, just return the data normally
    if (response.ok) {
        return response.json();
    }

    // 2. If it's an error (400, 401, 500), extract the exact message
    let extractedMessage = "An unexpected error occurred.";
    
    try {
        const errorData = await response.json();
        
        // This looks for your standard backend response: { success: false, message: "..." }
        // Or your Global Middleware response: { title: "..." }
        extractedMessage = errorData.message || errorData.title || extractedMessage;
        
    } catch (e) {
        // If the backend didn't send JSON (like a total server crash), fallback to text
        extractedMessage = await response.text();
    }

    // 3. Throw a standard JS Error containing ONLY your clean text
    throw new Error(extractedMessage);
}
export async function getData(path, queryObject = null) {
    let url = `${basePath}${path}`;
    const token = sessionStorage.getItem("token");
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    if (queryObject) {
        url += "?" + new URLSearchParams(queryObject).toString();
    }

    try {
        const response = await fetch(url, { headers });
        return await handleResponse(response);
    } catch (err) {
        console.error(`Error fetching data from ${path}:`, err);
        throw err;
    }
}


export async function postData(path, data) {
    const token = sessionStorage.getItem("token");
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    try {
        const response = await fetch(`${basePath}${path}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error posting data to ${path}:`, error);
        throw error;
    }
}

// export async function uploadFile(path, formData) {
//     const token = sessionStorage.getItem("jwtToken");
//     const headers = {};
//     if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//     }
//     try {
//         const response = await fetch(`${basePath}${path}`, {
//             method: 'POST',
//             headers,
//             body: formData,
//         });
//         return await handleResponse(response);
//     } catch (error) {
//         console.error(`Error uploading file to ${path}:`, error);
//         throw error;
//     }
// }