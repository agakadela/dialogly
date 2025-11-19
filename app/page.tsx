import CompanionCard from '@/components/companion-card';
import CTA from '@/components/cta';
import CompanionsList from '@/components/companions-list';
import {
  getAllCompanions,
  getRecentSessions,
} from '@/lib/actions/companion.actions';

export default async function Page() {
  const companions = await getAllCompanions();
  const recentCompanions = await getRecentSessions();
  return (
    <main>
      <h1 className='text-2xl underline'>Popular Companions</h1>
      <section className='home-section'>
        {companions.map((companion) => (
          <CompanionCard key={companion.id} {...companion} />
        ))}
      </section>
      <section className='home-section'>
        <CompanionsList
          title='Recently Completed Sessions'
          companions={recentCompanions}
          className='w-2/3 max-lg:w-full'
        />
        <CTA />
      </section>
    </main>
  );
}
