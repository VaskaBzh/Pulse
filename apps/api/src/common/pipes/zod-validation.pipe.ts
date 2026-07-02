import { BadRequestException, Injectable, Logger, PipeTransform } from '@nestjs/common';
import type { ZodType } from 'zod/v4';

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform {
  private readonly logger = new Logger(ZodValidationPipe.name);

  private readonly schemaName: string;

  constructor(
    private readonly schema: ZodType<T>,
    schemaName?: string,
  ) {
    this.schemaName = schemaName ?? schema.constructor.name;
  }

  transform(value: unknown): T {
    const parsed = this.schema.safeParse(value);

    if (!parsed.success) {
      this.logger.warn(
        `Validation failed for ${this.schemaName}: ${JSON.stringify(parsed.error.issues)}`,
      );
      throw new BadRequestException(parsed.error.issues);
    }

    this.logger.debug(
      `Validation passed for ${this.schemaName}: fields=${Object.keys(parsed.data as object).join(',')}`,
    );
    return parsed.data;
  }
}
