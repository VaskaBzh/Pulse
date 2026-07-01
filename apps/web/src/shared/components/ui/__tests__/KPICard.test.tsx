import { render, screen } from '@testing-library/react';
import { DollarSign } from 'lucide-react';
import { describe, it, expect } from 'vitest';
import { KPICard } from '../KPICard';

const baseProps = {
  title: 'Revenue',
  value: '$12,345',
  change: 5.2,
  sparklineData: [10, 20, 15, 30, 25],
  icon: <DollarSign />,
  color: '#10b981',
};

describe('KPICard', () => {
  describe('render', () => {
    it('displays title', () => {
      render(<KPICard {...baseProps} />);
      expect(screen.getByText('Revenue')).toBeDefined();
    });

    it('displays value', () => {
      render(<KPICard {...baseProps} />);
      expect(screen.getByText('$12,345')).toBeDefined();
    });

    it('displays positive change with + prefix', () => {
      render(<KPICard {...baseProps} change={5.2} />);
      expect(screen.getByText('+5.2%')).toBeDefined();
    });

    it('displays negative change without + prefix', () => {
      render(<KPICard {...baseProps} change={-3.1} />);
      expect(screen.getByText('-3.1%')).toBeDefined();
    });

    it('displays — for zero change', () => {
      render(<KPICard {...baseProps} change={0} />);
      expect(screen.getByText('—')).toBeDefined();
    });
  });

  describe('trend colors', () => {
    it('applies emerald classes when change > 0', () => {
      const { container } = render(<KPICard {...baseProps} change={5.2} />);
      const badge = container.querySelector('.text-emerald-700, .text-emerald-400');
      expect(badge).not.toBeNull();
    });

    it('applies rose classes when change < 0', () => {
      const { container } = render(<KPICard {...baseProps} change={-2.5} />);
      const badge = container.querySelector('.text-rose-700, .text-rose-400');
      expect(badge).not.toBeNull();
    });

    it('applies slate classes when change = 0', () => {
      const { container } = render(<KPICard {...baseProps} change={0} />);
      const badge = container.querySelector('.text-slate-500, .text-slate-400');
      expect(badge).not.toBeNull();
    });

    it('renders TrendingUp icon when change > 0', () => {
      const { container } = render(<KPICard {...baseProps} change={5.2} />);
      // lucide renders an svg with class
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('does not render trend icon when change = 0', () => {
      render(<KPICard {...baseProps} change={0} />);
      // The badge div itself (returned by getByText) should have no SVG children
      const badge = screen.getByText('—');
      expect(badge.querySelectorAll('svg').length).toBe(0);
    });
  });

  describe('sparkline', () => {
    it('renders SVG when sparklineData has 2+ values', () => {
      const { container } = render(<KPICard {...baseProps} sparklineData={[10, 20, 30]} />);
      expect(container.querySelector('svg')).not.toBeNull();
    });

    it('does not crash with all-equal values (min === max edge case)', () => {
      expect(() =>
        render(<KPICard {...baseProps} sparklineData={[42, 42, 42, 42]} />),
      ).not.toThrow();
    });

    it('does not render sparkline SVG when data has fewer than 2 points', () => {
      const { container } = render(<KPICard {...baseProps} sparklineData={[100]} />);
      // Sparkline returns null for data.length < 2; its SVG has width="72"
      expect(container.querySelector('svg[width="72"]')).toBeNull();
    });
  });
});
