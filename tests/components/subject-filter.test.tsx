import { fireEvent, render, screen } from '@testing-library/react';
import SubjectFilter from '@/components/subject-filter';
import { vi, beforeEach, describe, it, expect } from 'vitest';
import type { ReactNode } from 'react';

const push = vi.fn();
let currentParams = new URLSearchParams();
let latestOnValueChange: ((value: string) => void) | undefined;

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => '/companions',
  useSearchParams: () => ({
    get: (key: string) => currentParams.get(key),
    toString: () => currentParams.toString(),
  }),
}));

vi.mock('@/components/ui/select', () => ({
  Select: ({
    children,
    onValueChange,
  }: {
    children: ReactNode;
    onValueChange: (value: string) => void;
  }) => {
    latestOnValueChange = onValueChange;
    return <div>{children}</div>;
  },
  SelectTrigger: ({ children }: { children: ReactNode }) => (
    <button type='button'>{children}</button>
  ),
  SelectContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  SelectValue: ({ children }: { children: ReactNode }) => (
    <span>{children}</span>
  ),
  SelectItem: ({ children, value }: { children: ReactNode; value: string }) => (
    <button type='button' onClick={() => latestOnValueChange?.(value)}>
      {children}
    </button>
  ),
}));

beforeEach(() => {
  currentParams = new URLSearchParams();
  latestOnValueChange = undefined;
  push.mockClear();
});

describe('SubjectFilter', () => {
  it('adds the subject query param and pushes the new URL', () => {
    render(<SubjectFilter />);

    fireEvent.click(screen.getByText(/math/i));

    expect(push).toHaveBeenCalledWith('/companions?subject=math', {
      scroll: false,
    });
  });

  it('removes the subject param when selecting "All subjects"', () => {
    currentParams = new URLSearchParams('subject=science');
    render(<SubjectFilter />);

    fireEvent.click(screen.getByText(/All subjects/i));

    expect(push).toHaveBeenCalledWith('/companions', { scroll: false });
  });
});
