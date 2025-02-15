const API_URL = "http://192.168.9.108:3001/warehousemans";

export const AuthService = {
  async login(secretKey: string) {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: { "Content-Type": "application/json" }
    });

    const warehousemans: { secretKey: string; name: string }[] = await response.json();
    return warehousemans.find((w) => w.secretKey === secretKey);
  }
};
