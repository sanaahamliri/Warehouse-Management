import { useState } from 'react';

type Stock = {
  id: number;
  name: string;
  quantity: number;
};

type Product = {
  id: number;
  name: string;
  type: string;
  price: number;
  supplier: string;
  image: string | null;
  stocks: Stock[];
};

const useProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const addProduct = (product: Product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  return {
    products,
    addProduct,
  };
};

export default useProduct;