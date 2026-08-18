import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ContractPriceList from '@/components/ContractPriceList';

describe('ContractPriceList', () => {
  it('renders market name', () => {
    render(
      <ContractPriceList
        marketName="Match Winner"
        contracts={[
          { id: '1', name: 'Arsenal' },
          { id: '2', name: 'Draw' },
        ]}
        quotes={new Map()}
      />
    );

    expect(screen.getByText('Match Winner')).toBeInTheDocument();
  });

  it('renders all contracts', () => {
    render(
      <ContractPriceList
        marketName="Match Winner"
        contracts={[
          { id: '1', name: 'Arsenal' },
          { id: '2', name: 'Draw' },
          { id: '3', name: 'Chelsea' },
        ]}
        quotes={new Map()}
      />
    );

    expect(screen.getByText('Arsenal')).toBeInTheDocument();
    expect(screen.getByText('Draw')).toBeInTheDocument();
    expect(screen.getByText('Chelsea')).toBeInTheDocument();
  });

  it('does not render price headers when there are no contracts', () => {
    render(
      <ContractPriceList
        marketName="Match Winner"
        contracts={[]}
        quotes={new Map()}
      />
    );

    expect(screen.getByText('Match Winner')).toBeInTheDocument();
    expect(screen.queryByText('Buy')).not.toBeInTheDocument();
    expect(screen.queryByText('Sell')).not.toBeInTheDocument();
  });
});
