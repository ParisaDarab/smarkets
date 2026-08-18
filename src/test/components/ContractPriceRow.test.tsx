import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ContractPriceRow } from '@/components/ContractPriceRow';

describe('ContractPriceRow', () => {
  it('renders contract name', () => {
    render(
      <ContractPriceRow
        name="Arsenal"
        quote={{
          bids: [{ price: 5000, volume: 10 }],
          offers: [{ price: 5100, volume: 15 }],
        }}
      />
    );

    expect(screen.getByText('Arsenal')).toBeInTheDocument();
  });

  it('renders bid and offer prices', () => {
    render(
      <ContractPriceRow
        name="Arsenal"
        quote={{
          bids: [{ price: 5000, volume: 10 }],
          offers: [{ price: 5100, volume: 15 }],
        }}
      />
    );

    expect(screen.getByText('2.00')).toBeInTheDocument();
    expect(screen.getByText('1.96')).toBeInTheDocument();
  });

  it('handles missing quote', () => {
    render(<ContractPriceRow name="Arsenal" quote={undefined} />);

    expect(screen.getByText('Arsenal')).toBeInTheDocument();
    expect(screen.getAllByText('-')).toHaveLength(2);
  });
});
