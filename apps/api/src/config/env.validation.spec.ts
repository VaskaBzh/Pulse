import { Logger } from '@nestjs/common';
import { validateEnv } from './env.validation';

describe('validateEnv', () => {
  it('returns validated config with defaults applied', () => {
    const result = validateEnv({
      DATABASE_URL: 'postgresql://pulse:pulse@localhost:5432/pulse',
    });

    expect(result).toEqual({
      DATABASE_URL: 'postgresql://pulse:pulse@localhost:5432/pulse',
      PORT: 3000,
      CORS_ORIGIN: 'http://localhost:5173',
    });
  });

  it('honors explicit PORT and CORS_ORIGIN overrides', () => {
    const result = validateEnv({
      DATABASE_URL: 'postgresql://pulse:pulse@localhost:5432/pulse',
      PORT: '4000',
      CORS_ORIGIN: 'https://pulse.example.com',
    });

    expect(result.PORT).toBe(4000);
    expect(result.CORS_ORIGIN).toBe('https://pulse.example.com');
  });

  it('throws a descriptive error and logs when DATABASE_URL is missing', () => {
    const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

    expect(() => validateEnv({})).toThrow(/DATABASE_URL/);
    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
