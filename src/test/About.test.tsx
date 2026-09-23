import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { About } from '../components/About';

describe('About Component', () => {
  it('renders about section title and philosophy', () => {
    render(<About />);
    expect(screen.getByText(/Naša priča/i)).toBeInTheDocument();
    expect(screen.getByText(/Studio u kome se/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/detalj/i);
    expect(screen.getAllByText(/Studio u Užicu/i).length).toBeGreaterThan(0);
    expect(screen.getByText('Kako izgleda termin')).toBeInTheDocument();
  });

  it('renders value propositions cards', () => {
    render(<About />);
    expect(screen.getByText(/Nokti koji drže liniju/i)).toBeInTheDocument();
    expect(screen.getByText(/Trepavice po oku/i)).toBeInTheDocument();
    expect(screen.getByText(/Higijena pre estetike/i)).toBeInTheDocument();
    expect(screen.getByText(/Instagram kao dnevnik rada/i)).toBeInTheDocument();
  });
});
