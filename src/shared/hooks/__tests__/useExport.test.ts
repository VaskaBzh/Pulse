import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { type DailyMetric } from '../../types';
import { useExport } from '../useExport';

const mockMetrics: DailyMetric[] = [
  {
    date: '2024-01-01',
    revenue: 500,
    profit: 200,
    orders: 10,
    users: 8,
    sessions: 20,
    conversionRate: 3.2,
    avgOrderValue: 50,
  },
  {
    date: '2024-01-02',
    revenue: 700,
    profit: 300,
    orders: 14,
    users: 12,
    sessions: 28,
    conversionRate: 4.1,
    avgOrderValue: 55,
  },
];

vi.mock('../../store/dashboardStore', () => ({
  useDashboardStore: vi.fn(
    (selector: (s: { filteredMetrics: DailyMetric[]; dateRange: string }) => unknown) =>
      selector({ filteredMetrics: mockMetrics, dateRange: '7d' }),
  ),
}));

let mockAnchor: { href: string; download: string; click: ReturnType<typeof vi.fn> };

beforeEach(() => {
  mockAnchor = { href: '', download: '', click: vi.fn() };
  const originalCreateElement = document.createElement.bind(document);
  vi.spyOn(document, 'createElement').mockImplementation((tag) => {
    if (tag === 'a') return mockAnchor as unknown as HTMLElement;
    return originalCreateElement(tag);
  });

  vi.stubGlobal('URL', {
    createObjectURL: vi.fn(() => 'blob:mock-url'),
    revokeObjectURL: vi.fn(),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('useExport', () => {
  describe('exportToCSV', () => {
    it('calls URL.createObjectURL with a Blob', () => {
      const { result } = renderHook(() => useExport());
      result.current.exportToCSV();
      expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    });

    it('sets anchor href and download then calls click', () => {
      const { result } = renderHook(() => useExport());
      result.current.exportToCSV();
      expect(mockAnchor.href).toBe('blob:mock-url');
      expect(mockAnchor.click).toHaveBeenCalledOnce();
    });

    it('filename contains dateRange and today date', () => {
      const today = new Date().toISOString().slice(0, 10);
      const { result } = renderHook(() => useExport());
      result.current.exportToCSV();
      expect(mockAnchor.download).toContain('7d');
      expect(mockAnchor.download).toContain(today);
      expect(mockAnchor.download).toMatch(/\.csv$/);
    });

    it('CSV headers include Date, Revenue, Orders columns', async () => {
      let capturedBlob: Blob | undefined;
      vi.mocked(URL.createObjectURL).mockImplementation((blob) => {
        capturedBlob = blob as Blob;
        return 'blob:mock-url';
      });

      const { result } = renderHook(() => useExport());
      result.current.exportToCSV();

      const text = await capturedBlob!.text();
      const firstLine = text.split('\n')[0];
      expect(firstLine).toContain('Date');
      expect(firstLine).toContain('Revenue');
      expect(firstLine).toContain('Orders');
    });

    it('calls URL.revokeObjectURL after click', () => {
      const { result } = renderHook(() => useExport());
      result.current.exportToCSV();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });
  });

  describe('exportData — JSON format', () => {
    it('calls URL.createObjectURL with application/json Blob', () => {
      const data = [{ id: '1', name: 'Alice' }];
      const { result } = renderHook(() => useExport());
      result.current.exportData('orders', 'json', data);
      expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    });

    it('filename ends with .json', () => {
      const { result } = renderHook(() => useExport());
      result.current.exportData('customers', 'json', [{ id: '1' }]);
      expect(mockAnchor.download).toMatch(/\.json$/);
    });

    it('filename contains type, dateRange, and today date', () => {
      const today = new Date().toISOString().slice(0, 10);
      const { result } = renderHook(() => useExport());
      result.current.exportData('products', 'json', [{ id: '1' }]);
      expect(mockAnchor.download).toContain('products');
      expect(mockAnchor.download).toContain('7d');
      expect(mockAnchor.download).toContain(today);
    });

    it('JSON content is valid and matches input data', async () => {
      const data = [{ id: '1', value: 42 }];
      let capturedBlob: Blob | undefined;
      vi.mocked(URL.createObjectURL).mockImplementation((blob) => {
        capturedBlob = blob as Blob;
        return 'blob:mock-url';
      });

      const { result } = renderHook(() => useExport());
      result.current.exportData('orders', 'json', data);

      const text = await capturedBlob!.text();
      expect(JSON.parse(text)).toEqual(data);
    });

    it('handles empty array without error', () => {
      const { result } = renderHook(() => useExport());
      expect(() => result.current.exportData('orders', 'json', [])).not.toThrow();
    });
  });

  describe('exportData — CSV format', () => {
    it('uses object keys as CSV headers', async () => {
      const data = [{ id: '1', name: 'Bob', amount: 100 }];
      let capturedBlob: Blob | undefined;
      vi.mocked(URL.createObjectURL).mockImplementation((blob) => {
        capturedBlob = blob as Blob;
        return 'blob:mock-url';
      });

      const { result } = renderHook(() => useExport());
      result.current.exportData('orders', 'csv', data);

      const text = await capturedBlob!.text();
      expect(text.split('\n')[0]).toBe('id,name,amount');
    });

    it('does not trigger download when data array is empty', () => {
      const { result } = renderHook(() => useExport());
      result.current.exportData('orders', 'csv', []);
      expect(URL.createObjectURL).not.toHaveBeenCalled();
      expect(mockAnchor.click).not.toHaveBeenCalled();
    });
  });
});
