'use server';

import { auth } from '@clerk/nextjs/server';
import { createSupabaseClient } from '../supabase';
import { revalidatePath } from 'next/cache';

export async function createCompanion(
  formData: CreateCompanion
): Promise<Companion> {
  const { userId: author } = await auth();
  if (!author) {
    throw new Error('You must be signed in to create a companion');
  }
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('companions')
    .insert({
      ...formData,
      author,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to create companion');
  }

  return data as Companion;
}

export async function getAllCompanions(
  limit: number = 10,
  page: number = 1,
  subject: string = '',
  topic: string = ''
): Promise<Companion[]> {
  const supabase = createSupabaseClient();

  const { userId } = await auth();

  let query = supabase.from('companions').select();

  if (subject && topic) {
    query = query
      .ilike('subject', `%${subject}%`)
      .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  } else if (subject) {
    query = query.ilike('subject', `%${subject}%`);
  } else if (topic) {
    query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data: companions, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const companionIds = companions.map(({ id }) => id);

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select()
    .eq('user_id', userId)
    .in('companion_id', companionIds);

  const marks = new Set(bookmarks?.map(({ companion_id }) => companion_id));

  companions.forEach((companion) => {
    companion.bookmarked = marks.has(companion.id);
  });
  return companions as Companion[];
}

export async function getCompanion(id: string | undefined): Promise<Companion> {
  if (!id) {
    throw new Error('Companion ID is required');
  }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new Error('Invalid companion ID format. Please use a valid UUID.');
  }

  const supabase = createSupabaseClient();
  const { data: companion, error } = await supabase
    .from('companions')
    .select()
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Companion not found');
    }
    throw new Error(error.message || 'Failed to get companion');
  }

  if (!companion) {
    throw new Error('Companion not found');
  }

  return companion as Companion;
}

export const addToSessionHistory = async (
  companionId: string
): Promise<void> => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('You must be signed in to save session history');
  }
  const supabase = createSupabaseClient();
  const { error } = await supabase.from('session_history').insert({
    companion_id: companionId,
    user_id: userId,
  });

  if (error) throw new Error(error.message);
};

export const getRecentSessions = async (limit = 10): Promise<Companion[]> => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('session_history')
    .select(`companions:companion_id (*)`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  if (!data) return [];

  return data
    .map(({ companions }) => companions as unknown as Companion)
    .filter((companion): companion is Companion => companion !== null);
};

export const getUserSessions = async (
  userId: string,
  limit = 10
): Promise<Companion[]> => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('session_history')
    .select(`companions:companion_id (*)`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  if (!data) return [];

  return data
    .map(({ companions }) => companions as unknown as Companion)
    .filter((companion): companion is Companion => companion !== null);
};

export const getUserCompanions = async (
  userId: string
): Promise<Companion[]> => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('companions')
    .select()
    .eq('author', userId);

  if (error) throw new Error(error.message);
  if (!data) return [];

  return data as Companion[];
};

export const newCompanionPermissions = async () => {
  const { userId, has } = await auth();
  if (!userId) {
    return false;
  }
  const supabase = createSupabaseClient();

  let limit: number | null = null;
  const canCheckFeatures = typeof has === 'function';

  if (canCheckFeatures && has({ plan: 'pro' })) {
    return true;
  }

  if (canCheckFeatures && has({ feature: '10_companion_limit' })) {
    limit = 10;
  } else if (canCheckFeatures && has({ feature: '3_companion_limit' })) {
    limit = 3;
  }

  if (limit === null) {
    return true;
  }

  const { data, error } = await supabase
    .from('companions')
    .select('id', { count: 'exact' })
    .eq('author', userId);

  if (error) throw new Error(error.message);

  const companionCount = data?.length ?? 0;

  return companionCount < limit;
};

export const addBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('You must be signed in to manage bookmarks');
  }

  const supabase = createSupabaseClient();

  // no-op when the bookmark already exists for this user/companion pair
  const { data: existing, error: existingError } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('companion_id', companionId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (existing) {
    revalidatePath(path);
    return existing;
  }

  const { data, error } = await supabase
    .from('bookmarks')
    .insert({
      companion_id: companionId,
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      const { data: duplicate, error: duplicateError } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('companion_id', companionId)
        .eq('user_id', userId)
        .single();
      if (duplicateError) {
        throw new Error(duplicateError.message);
      }
      revalidatePath(path);
      return duplicate;
    }

    throw new Error(error.message);
  }

  revalidatePath(path);
  return data;
};

export const removeBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('You must be signed in to manage bookmarks');
  }
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('companion_id', companionId)
    .eq('user_id', userId);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath(path);
  return data;
};

export const getBookmarkedCompanions = async (
  userId: string
): Promise<Companion[]> => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('bookmarks')
    .select(`companions:companion_id (*)`)
    .eq('user_id', userId);
  if (error) {
    throw new Error(error.message);
  }
  if (!data) return [];
  return data.map(({ companions }) => companions as unknown as Companion);
};
