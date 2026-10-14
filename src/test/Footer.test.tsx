import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from '../components/Footer';

describe('Footer Component', () => {
  it('renders footer brand info, quick links and author attribution', () => {
    render(<Footer />);
    expect(screen.getByText('NOKTI')).toBeInTheDocument();
    expect(screen.getByText('Brzi linkovi')).toBeInTheDocument();
    expect(screen.getByText('Kontakt i lokacija')).toBeInTheDocument();
    expect(screen.getByText(/Sva prava zadržana/i)).toBeInTheDocument();

    // Check Built by Ognjen Dabić with portfolio link
    const authorLink = screen.getByRole('link', { name: /byeMyBrain/i });
    expect(authorLink).toBeInTheDocument();
    expect(authorLink).toHaveAttribute('href', 'https://byemybrain.com');
    expect(authorLink).toHaveAttribute('target', '_blank');
    expect(authorLink).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('points open appointments to Instagram and has no newsletter form', () => {
    render(<Footer />);
    expect(screen.getByText('Slobodni termini idu na Instagram.')).toBeInTheDocument();
    expect(screen.queryByLabelText('Prijavi se na newsletter')).not.toBeInTheDocument();
  });
});
