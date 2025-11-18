import CompanionCard from '@/components/companion-card';
import { getAllCompanions } from '@/lib/actions/companion.actions';
import SearchInput from '@/components/search-input';
import SubjectFilter from '@/components/subject-filter';

export default async function CompanionsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { subject, topic, page = 1, limit = 10 } = await searchParams;
  const companions = await getAllCompanions(
    Number(limit),
    Number(page),
    subject as string,
    topic as string
  );
  return (
    <main>
      <section className='flex justify-between gap-4 max-sm:flex-col'>
        <h1 className='text-2xl underline'>Companion Library</h1>
        <div className='flex gap-4'>
          <SearchInput />
          <SubjectFilter />
        </div>
      </section>
      <section className='companions-grid'>
        {companions.map((companion: Companion) => (
          <CompanionCard
            key={companion.id}
            id={companion.id}
            title={companion.title}
            subject={companion.subject as Subject}
            topic={companion.topic}
            duration={companion.duration}
          />
        ))}
      </section>
    </main>
  );
}
