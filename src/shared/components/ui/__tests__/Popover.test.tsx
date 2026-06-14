import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Popover } from '../Popover';

beforeEach(() => {
  console.log('[test:Popover] setup');
});

describe('Popover', () => {
  describe('trigger interaction', () => {
    it('content is hidden initially', () => {
      render(<Popover trigger={<button>Open</button>} content={<span>menu</span>} />);
      expect(screen.queryByText('menu')).toBeNull();
    });

    it('shows content after clicking trigger', () => {
      render(<Popover trigger={<button>Open</button>} content={<span>menu</span>} />);
      fireEvent.click(screen.getByText('Open'));
      expect(screen.getByText('menu')).toBeInTheDocument();
    });

    it('hides content on second click (toggle)', () => {
      render(<Popover trigger={<button>Open</button>} content={<span>menu</span>} />);
      fireEvent.click(screen.getByText('Open'));
      expect(screen.getByText('menu')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Open'));
      expect(screen.queryByText('menu')).toBeNull();
    });
  });

  describe('click outside', () => {
    it('closes when clicking outside the popover', () => {
      render(
        <div>
          <Popover trigger={<button>Open</button>} content={<span>menu</span>} />
          <div data-testid="outside">outside</div>
        </div>,
      );
      fireEvent.click(screen.getByText('Open'));
      expect(screen.getByText('menu')).toBeInTheDocument();
      fireEvent.mouseDown(screen.getByTestId('outside'));
      expect(screen.queryByText('menu')).toBeNull();
    });

    it('stays open when clicking inside the popover', () => {
      render(<Popover trigger={<button>Open</button>} content={<span>menu</span>} />);
      fireEvent.click(screen.getByText('Open'));
      fireEvent.mouseDown(screen.getByText('menu'));
      expect(screen.getByText('menu')).toBeInTheDocument();
    });
  });

  describe('placement', () => {
    it.each(['top', 'bottom', 'left', 'right'] as const)(
      'applies placement class for "%s"',
      (placement) => {
        render(
          <Popover
            trigger={<button>Open</button>}
            content={<span>menu</span>}
            placement={placement}
          />,
        );
        fireEvent.click(screen.getByText('Open'));
        const content = screen.getByText('menu').parentElement!;
        const expected: Record<string, string> = {
          top: 'bottom-full',
          bottom: 'top-full',
          left: 'right-full',
          right: 'left-full',
        };
        expect(content.className).toContain(expected[placement]);
      },
    );

    it('defaults to bottom placement', () => {
      render(<Popover trigger={<button>Open</button>} content={<span>menu</span>} />);
      fireEvent.click(screen.getByText('Open'));
      const content = screen.getByText('menu').parentElement!;
      expect(content.className).toContain('top-full');
    });
  });

  describe('event listener cleanup', () => {
    it('removes mousedown listener on unmount', () => {
      const spy = vi.spyOn(document, 'removeEventListener');
      const { unmount } = render(
        <Popover trigger={<button>Open</button>} content={<span>menu</span>} />,
      );
      fireEvent.click(screen.getByText('Open'));
      unmount();
      expect(spy).toHaveBeenCalledWith('mousedown', expect.any(Function));
      spy.mockRestore();
    });
  });
});
