import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Experience } from '../components/Experience';

describe('Experience Component', () => {
  it('renders nails, lashes and the studio rhythm', () => {
    render(<Experience />);
    expect(screen.getByText('Tri stvari, urađene do kraja')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Nokti' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Trepavice' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Ritam studija' })).toBeInTheDocument();
  });
});

