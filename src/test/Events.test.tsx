import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Events } from '../components/Events';

describe('Events Component', () => {
  it('renders the current events list', () => {
    render(<Events />);
    expect(screen.getByText('Paketi i redovni dolasci')).toBeInTheDocument();
    expect(screen.getByText(/Set za venčanje/i)).toBeInTheDocument();
    expect(screen.getAllByText('Termin se potvrđuje porukom').length).toBeGreaterThan(0);
  });

  it('calls onSelectEvent when event reservation button is clicked', () => {
    const handleSelectEvent = vi.fn();
    render(<Events onSelectEvent={handleSelectEvent} />);

    const reserveButtons = screen.getAllByRole('button', { name: /Zakaži ovaj tretman/i });
    expect(reserveButtons.length).toBeGreaterThan(0);

    fireEvent.click(reserveButtons[0]);
    expect(handleSelectEvent).toHaveBeenCalled();
  });
});

