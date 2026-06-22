import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { MetricsModule } from './metrics/metrics.module';
import { TrafficModule } from './traffic/traffic.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    PrismaModule,
    MetricsModule,
    TrafficModule,
    OrdersModule,
    ProductsModule,
    CustomersModule,
    AnalyticsModule,
    HealthModule,
  ],
})
export class AppModule {}
