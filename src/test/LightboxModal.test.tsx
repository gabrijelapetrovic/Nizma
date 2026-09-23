import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LightboxModal } from '../components/LightboxModal';
import { GALLERY_IMAGES } from '../utils/constants';

describe('LightboxModal Component', () => {
  it('renders nothing when currentIndex is null', () => {
    const { container } = render(
      <LightboxModal
        images={GALLERY_IMAGES}
        currentIndex={null}
        onClose={vi.fn()}
        onNext={vi.fn()}
        onPrev={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders image when currentIndex is set', () => {
    render(
      <LightboxModal
        images={GALLERY_IMAGES}
        currentIndex={0}
        onClose={vi.fn()}
        onNext={vi.fn()}
        onPrev={vi.fn()}
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(GALLERY_IMAGES[0].title)).toBeInTheDocument();
  });

  it('calls onNext and onPrev handlers', () => {
    const handleNext = vi.fn();
    const handlePrev = vi.fn();
    render(
      <LightboxModal
        images={GALLERY_IMAGES}
        currentIndex={0}
        onClose={vi.fn()}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    );

    const nextBtn = screen.getByLabelText('Sledeća slika');
    const prevBtn = screen.getByLabelText('Prethodna slika');

    fireEvent.click(nextBtn);
    expect(handleNext).toHaveBeenCalled();

    fireEvent.click(prevBtn);
    expect(handlePrev).toHaveBeenCalled();
  });
});

