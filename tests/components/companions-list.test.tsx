import { render, screen } from '@testing-library/react';
import type { ImgHTMLAttributes, ReactNode } from 'react';
import CompanionsList from '@/components/companions-list';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} alt={props.alt ?? ''} />
  ),
}));

const buildCompanion = (overrides: Partial<Companion> = {}): Companion => ({
  id: 'companion-1',
  title: 'Algebra 101',
  subject: 'math' as Subject,
  topic: 'Linear equations',
  duration: 1,
  voice: 'female',
  style: 'casual',
  author: 'user-1',
  ...overrides,
});

describe('CompanionsList', () => {
  it('renders an empty state when there are no companions', () => {
    render(<CompanionsList title='Empty' companions={[]} />);

    expect(screen.getByText('No recent companions found')).toBeInTheDocument();
  });

  it('renders each provided companion with duration label', () => {
    render(
      <CompanionsList
        title='My Companions'
        companions={[
          buildCompanion(),
          buildCompanion({
            id: 'companion-2',
            title: 'History Hour',
            subject: 'history' as Subject,
            duration: 5,
            topic: 'World War I',
          }),
        ]}
      />
    );

    expect(screen.getByText('Algebra 101')).toBeInTheDocument();
    expect(screen.getByText('History Hour')).toBeInTheDocument();
    expect(
      screen.getAllByText((_, node) => node?.textContent === '1 min').length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText((_, node) => node?.textContent === '5 mins').length
    ).toBeGreaterThan(0);
  });
});
