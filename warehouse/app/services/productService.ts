import { fetchFromAPI } from './api';
import * as Print from 'expo-print';

type Stock = {
  id: number;
  name: string;
  quantity: number;
  city: string;
  latitude: string;
  longitude: string;
};

type Product = {
  id: number;
  name: string;
  type: string;
  barcode: string;
  price: number;
  solde?: number;
  supplier: string;
  image: string;
  stocks: Stock[];
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

export const exportProductReport = async (product: Product) => {
  const html = `
    <html>
      <body>
        <h1>${product.name}</h1>
        <p>Type: ${product.type}</p>
        <p>Price: ${product.price} MAD</p>
        <h2>Stocks</h2>
        <ul>
          ${product.stocks.map(stock => `
            <li>${stock.name}: ${stock.quantity} unités - Ville: ${stock.city}</li>
          `).join('')}
        </ul>
      </body>
    </html>
  `;
  await Print.printAsync({ html });
};

export const fetchStockStatistics = async () => {
  const products = await fetchProducts();
  const totalProducts = products.length;
  const cities = new Set(products.flatMap((product: Product) => product.stocks.map(stock => stock.city)));
  const totalCities = cities.size;
  const outOfStockProducts = products.filter((product: Product) => product.stocks.every((stock: Stock) => stock.quantity === 0)).length;
  const totalStockValue = products.reduce((total: number, product: Product) => {
    const productStockValue = product.stocks.reduce((sum: number, stock: Stock) => sum + (stock.quantity * product.price), 0);
    return total + productStockValue;
  }, 0);

  return {
    totalProducts,
    totalCities,
    outOfStockProducts,
    totalStockValue,
  };
};