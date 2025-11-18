'use server';

import { auth } from '@clerk/nextjs/server';
import { createSupabaseClient } from '../supabase';

export async function createCompanion(
  formData: CreateCompanion
): Promise<Companion> {
  const { userId: author } = await auth();
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

  let query = supabase.from('companions').select();

  if (subject && topic) {
    query = query
      .ilike('subject', `%${subject}%`)
      .or(`topic.ilike.%${topic}%,title.ilike.%${topic}%`);
  } else if (subject) {
    query = query.ilike('subject', `%${subject}%`);
  } else if (topic) {
    query = query.or(`topic.ilike.%${topic}%,title.ilike.%${topic}%`);
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data: companions, error } = await query;

  if (error || !companions) {
    throw new Error(error?.message || 'Failed to get companions');
  }

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
