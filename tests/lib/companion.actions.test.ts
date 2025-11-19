import { beforeEach, describe, expect, it, vi } from 'vitest';
import { newCompanionPermissions } from '@/lib/actions/companion.actions';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseClient } from '@/lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

vi.mock('@/lib/supabase', () => ({
  createSupabaseClient: vi.fn(),
}));

const mockAuth = vi.mocked(auth);
const mockCreateSupabase = vi.mocked(createSupabaseClient);

const setupSupabaseQuery = (count: number, error?: Error) => {
  const eq = vi.fn().mockResolvedValue(
    error
      ? { error, data: null }
      : {
          data: Array.from({ length: count }, (_, i) => ({ id: `${i}` })),
          error: null,
        }
  );
  const select = vi.fn().mockReturnValue({ eq });
  const from = vi.fn().mockReturnValue({ select });
  mockCreateSupabase.mockReturnValue({ from } as never as SupabaseClient);
  return { from, select, eq };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('newCompanionPermissions', () => {
  it('returns false when the user is not signed in', async () => {
    mockAuth.mockResolvedValue({ userId: null } as never);

    await expect(newCompanionPermissions()).resolves.toBe(false);
    expect(mockCreateSupabase).not.toHaveBeenCalled();
  });

  it('allows users on the Pro plan without counting companions', async () => {
    const has = vi.fn(({ plan }) => plan === 'pro');
    mockAuth.mockResolvedValue({ userId: 'user-1', has } as never);
    const { from } = setupSupabaseQuery(0);

    await expect(newCompanionPermissions()).resolves.toBe(true);
    expect(has).toHaveBeenCalledWith({ plan: 'pro' });
    expect(from).not.toHaveBeenCalled();
  });

  it('honors the 10 companion limit feature flag', async () => {
    const has = vi.fn(
      (input: { feature?: string }) => input.feature === '10_companion_limit'
    );
    mockAuth.mockResolvedValue({ userId: 'user-1', has } as never);
    const { eq } = setupSupabaseQuery(5);

    await expect(newCompanionPermissions()).resolves.toBe(true);
    expect(eq).toHaveBeenCalledWith('author', 'user-1');
  });

  it('blocks users who reached the 3 companion limit', async () => {
    const has = vi.fn(
      (input: { feature?: string }) => input.feature === '3_companion_limit'
    );
    mockAuth.mockResolvedValue({ userId: 'user-1', has } as never);
    setupSupabaseQuery(3);

    await expect(newCompanionPermissions()).resolves.toBe(false);
  });

  it('throws when Supabase responds with an error', async () => {
    const has = vi.fn(
      (input: { feature?: string }) => input.feature === '3_companion_limit'
    );
    mockAuth.mockResolvedValue({ userId: 'user-1', has } as never);
    setupSupabaseQuery(0, new Error('limit error'));

    await expect(newCompanionPermissions()).rejects.toThrow('limit error');
  });
});
