import { getCompanion } from '@/lib/actions/companion.actions';
import { notFound } from 'next/navigation';

interface CompanionSessionPageProps {
  params: Promise<{ id: string }>;
}

export default async function CompanionSessionPage({
  params,
}: CompanionSessionPageProps) {
  const { id } = await params;

  let companion;
  try {
    companion = await getCompanion(id);
  } catch {
    // If it's a validation error or not found, show 404
    notFound();
  }

  return (
    <main>
      <section className='flex justify-between gap-4 max-sm:flex-col'>
        <h1 className='text-2xl underline'>{companion.title}</h1>
      </section>
    </main>
  );
}
