import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Reviews } from '../components/Reviews';

describe('Reviews Component', () => {
  it('stays hidden until real reviews exist', () => {
    render(<Reviews />);
    expect(screen.queryByText('Utisci gostiju')).not.toBeInTheDocument();
    expect(screen.queryByText('Milica Jovanović')).not.toBeInTheDocument();
  });
});

