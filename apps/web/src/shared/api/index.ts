// Domain fetchers now live in entities/*/api.ts (FSD entities layer).
// Re-exported here for backward compatibility — prefer importing from entities/*.
export { fetchMetrics } from '../../entities/metric';
export { fetchTrafficSources } from '../../entities/traffic-source';
export { fetchOrders } from '../../entities/order';
export { fetchCustomers } from '../../entities/customer';
export { fetchProducts, fetchFunnelData, fetchRetentionData } from '../../entities/product';
