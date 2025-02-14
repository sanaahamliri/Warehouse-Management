import { fetchFromAPI } from './api';

export const fetchProducts = async () => {
  return await fetchFromAPI("/products");
};

export const fetchProductById = async (id: string) => {
  return await fetchFromAPI(`/products/${id}`);
};

export const addProduct = async (productData: any) => {
  const response = await fetchFromAPI("/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  return response;
};
