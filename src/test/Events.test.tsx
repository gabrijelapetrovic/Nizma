import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Events } from '../components/Events';

describe('Events Component', () => {
  it('renders the current events list', () => {
    render(<Events />);
    expect(screen.getByText('Paketi i redovni dolasci')).toBeInTheDocument();
    expect(screen.getByText(/Set za venčanje/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Zakaži ovaj tretman/i })).not.toBeInTheDocument();
  });
});

