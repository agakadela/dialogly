import { act, fireEvent, render, screen } from '@testing-library/react';
import SearchInput from '@/components/search-input';
import { vi, beforeEach, describe, it, expect } from 'vitest';

const push = vi.fn();
let currentParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => '/companions',
  useSearchParams: () => ({
    get: (key: string) => currentParams.get(key),
    toString: () => currentParams.toString(),
  }),
}));

beforeEach(() => {
  currentParams = new URLSearchParams();
  push.mockClear();
});

describe('SearchInput', () => {
  it('debounces updates and pushes the topic query param', async () => {
    vi.useFakeTimers();
    render(<SearchInput />);

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'algebra' },
    });

    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });

    expect(push).toHaveBeenCalledWith('/companions?topic=algebra');
    vi.useRealTimers();
  });

  it('removes the topic param when the input is cleared', async () => {
    vi.useFakeTimers();
    currentParams = new URLSearchParams('topic=math');
    render(<SearchInput />);

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: '' },
    });

    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });

    expect(push).toHaveBeenCalledWith('/companions');
    vi.useRealTimers();
  });
});
