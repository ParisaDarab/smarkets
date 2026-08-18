import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PriceCell from '@/components/PriceCell';

describe('PriceCell', () => {
  it('renders the best available level', () => {
    render(
      <PriceCell
        levels={[
          { price: 5000, volume: 10 },
          { price: 4500, volume: 20 },
        ]}
        tone="buy"
      />
    );

    expect(screen.getByText('2.00')).toBeInTheDocument();
  });

  it('renders "-" when no levels are available', () => {
    render(<PriceCell levels={[]} tone="buy" />);

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders "-" when levels are undefined', () => {
    render(<PriceCell levels={undefined} tone="sell" />);

    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
