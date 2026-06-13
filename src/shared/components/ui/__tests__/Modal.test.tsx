import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Modal } from '../Modal';

const noop = vi.fn();

beforeEach(() => {
  console.log('[test:Modal] setup');
  document.body.style.overflow = '';
  noop.mockReset();
});

describe('Modal', () => {
  describe('isOpen=false', () => {
    it('renders nothing when closed', () => {
      render(<Modal isOpen={false} onClose={noop} title="Test" children={<p>content</p>} />);
      expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('does not set body overflow when closed', () => {
      render(<Modal isOpen={false} onClose={noop} title="Test" children={<p>content</p>} />);
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('isOpen=true', () => {
    it('renders the dialog and title', () => {
      render(<Modal isOpen={true} onClose={noop} title="Order Details" children={<p>body</p>} />);
      expect(screen.getByRole('dialog')).toBeDefined();
      expect(screen.getByText('Order Details')).toBeDefined();
    });

    it('renders children content', () => {
      render(<Modal isOpen={true} onClose={noop} title="X" children={<p>inner content</p>} />);
      expect(screen.getByText('inner content')).toBeDefined();
    });

    it('sets body overflow to hidden', () => {
      render(<Modal isOpen={true} onClose={noop} title="X" children={null} />);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('aria-labelledby points to modal-title', () => {
      render(<Modal isOpen={true} onClose={noop} title="Labelled" children={null} />);
      const dialog = screen.getByRole('dialog');
      expect(dialog.getAttribute('aria-labelledby')).toBe('modal-title');
    });
  });

  describe('Escape key', () => {
    it('calls onClose when Escape is pressed', () => {
      render(<Modal isOpen={true} onClose={noop} title="X" children={null} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(noop).toHaveBeenCalledOnce();
    });

    it('does not call onClose for other keys', () => {
      render(<Modal isOpen={true} onClose={noop} title="X" children={null} />);
      fireEvent.keyDown(document, { key: 'Enter' });
      fireEvent.keyDown(document, { key: 'Tab' });
      expect(noop).not.toHaveBeenCalled();
    });
  });

  describe('body overflow cleanup', () => {
    it('restores overflow to empty string on unmount', () => {
      const { unmount } = render(<Modal isOpen={true} onClose={noop} title="X" children={null} />);
      expect(document.body.style.overflow).toBe('hidden');
      unmount();
      expect(document.body.style.overflow).toBe('');
    });

    it('restores overflow when isOpen changes to false', () => {
      const { rerender } = render(<Modal isOpen={true} onClose={noop} title="X" children={null} />);
      expect(document.body.style.overflow).toBe('hidden');
      rerender(<Modal isOpen={false} onClose={noop} title="X" children={null} />);
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('event listener cleanup', () => {
    it('removes keydown listener on unmount', () => {
      const spy = vi.spyOn(document, 'removeEventListener');
      const { unmount } = render(<Modal isOpen={true} onClose={noop} title="X" children={null} />);
      unmount();
      expect(spy).toHaveBeenCalledWith('keydown', expect.any(Function));
      spy.mockRestore();
    });
  });
});
