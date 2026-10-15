import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Hero } from '../components/Hero';

describe('Hero Component', () => {
  it('renders main headline and slogan', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Nokti/i);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/trepavice/i);
  });

  it('renders the price list button', () => {
    const handleMenu = vi.fn();
    render(<Hero onOpenMenu={handleMenu} />);

    const menuBtn = screen.getByRole('button', { name: /Cenovnik/i });
    fireEvent.click(menuBtn);
    expect(handleMenu).toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: /Zakaži termin/i })).not.toBeInTheDocument();
  });

  it('renders key feature highlights', () => {
    render(<Hero />);
    expect(screen.getAllByText('Nokti').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/trepavice/i).length).toBeGreaterThan(0);
    expect(screen.getByText('Nega')).toBeInTheDocument();
    expect(screen.getByText('Studio')).toBeInTheDocument();
  });
});

