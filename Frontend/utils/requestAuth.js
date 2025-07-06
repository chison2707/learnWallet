const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;

export const getAuth = async (path, token) => {
    const response = await fetch(API_DOMAIN + path, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const result = await response.json();
    return result;
};

export const patchAuth = async (path, data, token) => {
    const response = await fetch(API_DOMAIN + path, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    return result;
}

export const postAuth = async (path, data, token) => {
    const response = await fetch(API_DOMAIN + path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    return result;
};