import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Navbar } from '../components/Navbar';

describe('Navbar Component', () => {
  it('renders brand logo and title', () => {
    render(<Navbar />);
    expect(screen.getByText('NOKTI')).toBeInTheDocument();
    expect(screen.getByText(/Trepavice · Užice/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('O nama')).toBeInTheDocument();
    expect(screen.getByText('Cenovnik')).toBeInTheDocument();
    expect(screen.getByText('Galerija')).toBeInTheDocument();
    expect(screen.getByText('Lokacija')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: '069 159 6686' }).length).toBeGreaterThan(0);
    expect(screen.queryByText('Utisci')).not.toBeInTheDocument();
  });

  it('calls onOpenReservation callback when reservation button is clicked', () => {
    const handleReservation = vi.fn();
    render(<Navbar onOpenReservation={handleReservation} />);
    const buttons = screen.getAllByRole('button', { name: /Zakaži/i });
    fireEvent.click(buttons[0]);
    expect(handleReservation).toHaveBeenCalled();
  });

  it('toggles mobile menu on hamburger click', () => {
    render(<Navbar />);
    const toggleButton = screen.getByLabelText(/Otvori meni/i);
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.getByLabelText(/Zatvori meni/i)).toBeInTheDocument();
    expect(screen.getByText('Zakaži odmah')).toBeInTheDocument();
  });
});

