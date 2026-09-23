import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Menu } from '../components/Menu';

describe('Menu Component', () => {
  it('renders service categories and the price heading', () => {
    render(<Menu />);
    expect(screen.getByText('Usluge i cene')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Nokti/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Trepavice/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Paketi/i }).length).toBeGreaterThan(0);
  });

  it('filters services when search input is used with XSS protection', () => {
    render(<Menu />);
    const searchInput = screen.getByPlaceholderText(/Pretraži usluge/i);

    fireEvent.change(searchInput, { target: { value: '<script>French</script>' } });
    expect(screen.getByText('French manicure')).toBeInTheDocument();

    expect(screen.queryByText('Gel nadogradnja')).not.toBeInTheDocument();
  });

  it('switches category when the lashes button is clicked', () => {
    render(<Menu />);
    const lashesBtn = screen.getByRole('button', { name: /^Trepavice$/i });
    fireEvent.click(lashesBtn);

    expect(screen.getByText('Klasične trepavice')).toBeInTheDocument();
    expect(screen.queryByText('French manicure')).not.toBeInTheDocument();
  });

  it('opens item modal when an item card is clicked', () => {
    render(<Menu />);
    const itemCard = screen.getByText('French manicure');
    fireEvent.click(itemCard);

    // Modal should now be open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveTextContent(/Klasičan french/i);
  });
});
