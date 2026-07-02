import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/filters/http-exception.filter';

describe('Pulse API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ── Health ─────────────────────────────────────────────────────────────────

  describe('GET /api/health', () => {
    it('returns 200 with status ok', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('uptime');
        });
    });
  });

  // ── Metrics ────────────────────────────────────────────────────────────────

  describe('GET /api/metrics', () => {
    it('returns 200 with default range (30d)', () => {
      return request(app.getHttpServer())
        .get('/api/metrics')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('returns filtered metrics for range=7d', () => {
      return request(app.getHttpServer())
        .get('/api/metrics?range=7d')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeLessThanOrEqual(7);
        });
    });

    it('returns 400 for invalid range', () => {
      return request(app.getHttpServer()).get('/api/metrics?range=invalid').expect(400);
    });
  });

  // ── Traffic Sources ────────────────────────────────────────────────────────

  describe('GET /api/traffic-sources', () => {
    it('returns 200 with array', () => {
      return request(app.getHttpServer())
        .get('/api/traffic-sources')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  // ── Orders ─────────────────────────────────────────────────────────────────

  describe('GET /api/orders', () => {
    it('returns 200 with paginated response', () => {
      return request(app.getHttpServer())
        .get('/api/orders')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('meta');
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.meta).toHaveProperty('page');
          expect(res.body.meta).toHaveProperty('limit');
          expect(res.body.meta).toHaveProperty('total');
          expect(res.body.meta).toHaveProperty('totalPages');
        });
    });

    it('filters by status=completed', () => {
      return request(app.getHttpServer())
        .get('/api/orders?status=completed')
        .expect(200)
        .expect((res) => {
          for (const order of res.body.data) {
            expect(order.status).toBe('completed');
          }
        });
    });

    it('paginates with page and limit', () => {
      return request(app.getHttpServer())
        .get('/api/orders?page=1&limit=5')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.length).toBeLessThanOrEqual(5);
          expect(res.body.meta.page).toBe(1);
          expect(res.body.meta.limit).toBe(5);
        });
    });
  });

  // ── Products ───────────────────────────────────────────────────────────────

  describe('GET /api/products', () => {
    it('returns 200 with array', () => {
      return request(app.getHttpServer())
        .get('/api/products')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  // ── Customers ──────────────────────────────────────────────────────────────

  describe('GET /api/customers', () => {
    it('returns 200 with array', () => {
      return request(app.getHttpServer())
        .get('/api/customers')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  // ── Analytics ──────────────────────────────────────────────────────────────

  describe('GET /api/analytics/funnel', () => {
    it('returns 200 with array', () => {
      return request(app.getHttpServer())
        .get('/api/analytics/funnel')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('GET /api/analytics/retention', () => {
    it('returns 200 with array', () => {
      return request(app.getHttpServer())
        .get('/api/analytics/retention')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
});
