import { fetchFromAPI } from './api';

type Stock = {
  id: number;
  name: string;
  quantity: number;
  city: string;
  latitude: string;
  longitude: string;
};

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

export const updateStock = async (productId: string, stockId: number, quantity: number) => {
  const product = await fetchProductById(productId);
  const updatedStocks = product.stocks.map((stock: Stock) =>
    stock.id === stockId ? { ...stock, quantity: stock.quantity + quantity } : stock,
  );
  return await fetchFromAPI(`/products/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...product, stocks: updatedStocks }),
  });
};
