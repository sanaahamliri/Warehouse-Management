import { fetchProducts, addProduct } from '../services/productService';
// import { describe, it, expect } from '@jest/globals';

describe('ProductService', () => {
  it('should fetch products successfully', async () => {
    const products = await fetchProducts();
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
  });

  it('should add a product successfully', async () => {
    const productData = { name: 'New Product', type: 'Type A', barcode: '123456', price: 100, supplier: 'Supplier A', image: 'image_url', stocks: [] };
    const response = await addProduct(productData);
    expect(response).toBeDefined();
    expect(response.id).toBeDefined();
  });
});
