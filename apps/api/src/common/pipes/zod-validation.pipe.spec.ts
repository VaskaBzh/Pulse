import { BadRequestException, Logger } from '@nestjs/common';
import { z } from 'zod/v4';
import { ZodValidationPipe } from './zod-validation.pipe';

describe('ZodValidationPipe', () => {
  const schema = z.object({
    page: z.coerce.number().int().min(1).default(1),
  });

  it('returns the parsed value when validation succeeds', () => {
    const pipe = new ZodValidationPipe(schema, 'TestSchema');

    const result = pipe.transform({ page: '2' });

    expect(result).toEqual({ page: 2 });
  });

  it('throws BadRequestException carrying the zod issues when validation fails', () => {
    const pipe = new ZodValidationPipe(schema, 'TestSchema');

    expect(() => pipe.transform({ page: 'not-a-number' })).toThrow(BadRequestException);

    try {
      pipe.transform({ page: 'not-a-number' });
      fail('expected transform to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      const response = (error as BadRequestException).getResponse() as { message: unknown };
      expect(Array.isArray(response.message)).toBe(true);
    }
  });

  it('logs a warning when validation fails', () => {
    const warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    const pipe = new ZodValidationPipe(schema, 'TestSchema');

    expect(() => pipe.transform({ page: 'not-a-number' })).toThrow(BadRequestException);

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('TestSchema'));
    warnSpy.mockRestore();
  });
});
