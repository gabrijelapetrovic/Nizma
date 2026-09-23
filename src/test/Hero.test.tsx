import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Hero } from '../components/Hero';

describe('Hero Component', () => {
  it('renders main headline and slogan', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Nokti/i);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/trepavice/i);
  });

  it('renders CTAs and triggers callbacks', () => {
    const handleMenu = vi.fn();
    const handleReservation = vi.fn();
    render(<Hero onOpenMenu={handleMenu} onOpenReservation={handleReservation} />);

    const bookBtn = screen.getByRole('button', { name: /Zakaži termin/i });
    const menuBtn = screen.getByRole('button', { name: /Cenovnik/i });

    fireEvent.click(bookBtn);
    expect(handleReservation).toHaveBeenCalled();

    fireEvent.click(menuBtn);
    expect(handleMenu).toHaveBeenCalled();
  });

  it('renders key feature highlights', () => {
    render(<Hero />);
    expect(screen.getAllByText('Nokti').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/trepavice/i).length).toBeGreaterThan(0);
    expect(screen.getByText('Nega')).toBeInTheDocument();
    expect(screen.getByText('Studio')).toBeInTheDocument();
  });
});

