import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MenuItemModal } from '../components/MenuItemModal';
import { MENU_ITEMS } from '../utils/constants';

describe('MenuItemModal Component', () => {
  const sampleItem = MENU_ITEMS[0];

  it('renders nothing when item is null', () => {
    const { container } = render(<MenuItemModal item={null} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders item details when item is provided', () => {
    render(<MenuItemModal item={sampleItem} onClose={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(document.body.contains(screen.getByRole('dialog'))).toBe(true);
    expect(screen.getByText(sampleItem.name)).toBeInTheDocument();
    expect(screen.getByText(sampleItem.price)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<MenuItemModal item={sampleItem} onClose={handleClose} />);
    const closeBtn = screen.getByLabelText('Zatvori detalje');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  it('calls onBookTable when reservation button is clicked', () => {
    const handleBook = vi.fn();
    render(<MenuItemModal item={sampleItem} onClose={vi.fn()} onBookTable={handleBook} />);
    const bookBtn = screen.getByText('Zakaži ovu uslugu');
    fireEvent.click(bookBtn);
    expect(handleBook).toHaveBeenCalled();
  });
});

