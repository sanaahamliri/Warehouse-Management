const API_BASE_URL = "http://192.168.9.108:3001";

export const fetchFromAPI = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`Erreur lors de l'appel à l'API : ${response.statusText}`);
  }
  return await response.json();
};
