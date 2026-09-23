import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Gallery } from '../components/Gallery';

describe('Gallery Component', () => {
  it('renders gallery title and category buttons', () => {
    render(<Gallery />);
    expect(screen.getByText('Galerija detalja')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Studio' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nokti' })).toBeInTheDocument();
  });

  it('filters gallery images when category tab is clicked', () => {
    render(<Gallery />);
    const nailsBtn = screen.getByRole('button', { name: 'Nokti' });
    fireEvent.click(nailsBtn);

    expect(screen.getByText('French linija')).toBeInTheDocument();
  });

  it('opens lightbox modal when image item is clicked', () => {
    render(<Gallery />);
    const imageCards = screen.getAllByRole('img');
    fireEvent.click(imageCards[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
