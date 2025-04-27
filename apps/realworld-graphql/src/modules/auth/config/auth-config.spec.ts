import authConfig from './auth.config';

describe('AuthConfig', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Reset process.env to its original state before each test
    process.env = { ...originalEnv };
  });

  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'info').mockImplementation();
  });

  describe.skip('secret', () => {
    it('should return the value of AUTH_JWT_SECRET', async () => {
      process.env.AUTH_JWT_SECRET = 'secret';
      const config = await authConfig();
      expect(config.secret).toBe('secret');
    });

    it('should throw an error when AUTH_JWT_SECRET is an empty', async () => {
      process.env.AUTH_JWT_SECRET = '';
      await expect(async () => await authConfig()).rejects.toThrow(Error);
    });

    it('should throw an error when AUTH_JWT_SECRET is not set', async () => {
      delete process.env.AUTH_JWT_SECRET;
      await expect(async () => await authConfig()).rejects.toThrow(Error);
    });
  });

  describe.skip('expires', () => {
    it('should return the value of AUTH_JWT_TOKEN_EXPIRES_IN', async () => {
      process.env.AUTH_JWT_TOKEN_EXPIRES_IN = '1d';
      const config = await authConfig();
      expect(config.expires).toBe('1d');
    });

    it('should throw an error when AUTH_JWT_TOKEN_EXPIRES_IN is an empty', async () => {
      process.env.AUTH_JWT_TOKEN_EXPIRES_IN = '';
      await expect(async () => await authConfig()).rejects.toThrow(Error);
    });

    it('should throw an error when AUTH_JWT_TOKEN_EXPIRES_IN is not set', async () => {
      delete process.env.AUTH_JWT_TOKEN_EXPIRES_IN;
      await expect(async () => await authConfig()).rejects.toThrow(Error);
    });

    it('should throw an error when AUTH_JWT_TOKEN_EXPIRES_IN is not a valid ms', async () => {
      process.env.AUTH_JWT_TOKEN_EXPIRES_IN = 'invalid';
      await expect(async () => await authConfig()).rejects.toThrow(Error);
    });
  });
});
