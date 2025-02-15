import { AuthService } from '../services/AuthService';

describe('AuthService', () => {
  it('should login successfully with valid secretKey', async () => {
    const secretKey = '0';
    const warehouseman = await AuthService.login(secretKey);
    expect(warehouseman).toBeDefined();
    if (warehouseman) {
        expect(warehouseman.secretKey).toBe(secretKey);
    }
  });

  it('should return undefined for invalid secretKey', async () => {
    const secretKey = 'invalidSecretKey';
    const warehouseman = await AuthService.login(secretKey);
    expect(warehouseman).toBeUndefined();
  });
});