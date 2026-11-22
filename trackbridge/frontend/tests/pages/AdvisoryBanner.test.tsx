import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdvisoryBanner } from '../../src/components/ui/AdvisoryBanner';

describe('AdvisoryBanner', () => {
  it('labels AI output as advisory', () => {
    render(<AdvisoryBanner>Rankings never create a placement.</AdvisoryBanner>);
    expect(screen.getByText('Advisory.')).toBeInTheDocument();
    expect(screen.getByText(/never create a placement/)).toBeInTheDocument();
  });
});
