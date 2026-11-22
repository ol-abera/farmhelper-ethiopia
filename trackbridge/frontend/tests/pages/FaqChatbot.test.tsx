import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FaqChatbot } from '../../src/components/chatbot/FaqChatbot';

vi.mock('../../src/api/ai.api', () => ({
  aiApi: {
    faq: vi.fn().mockResolvedValue({
      answer: 'I could not find a close match in the published FAQ corpus.',
      fallback: true,
    }),
  },
}));

describe('FaqChatbot', () => {
  it('shows fallback copy when the corpus has no close match', async () => {
    render(<FaqChatbot />);
    fireEvent.click(screen.getByText('English FAQ'));
    fireEvent.change(screen.getByPlaceholderText(/Ask about CBTP/), { target: { value: 'zzz unknown' } });
    fireEvent.submit(screen.getByPlaceholderText(/Ask about CBTP/).closest('form')!);
    await waitFor(() => expect(screen.getByText(/No close corpus match/)).toBeInTheDocument());
  });
});
