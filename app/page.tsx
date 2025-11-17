import CompanionCard from '@/components/companion-card';
import CTA from '@/components/cta';
import CompanionsList from '@/components/companions-list';

const companions = [
  {
    id: '1',
    name: 'John Doe',
    subject: 'Math',
    topic: 'Algebra',
    duration: 30,
    color: '#E5D0FF',
  },
  {
    id: '2',
    name: 'Jane Doe',
    subject: 'Science',
    topic: 'Physics',
    duration: 30,
    color: '#FFDA6E',
  },
  {
    id: '3',
    name: 'Jim Doe',
    subject: 'History',
    topic: 'World War II',
    duration: 30,
    color: '#FFECC8',
  },
];

const Page = () => {
  return (
    <main>
      <h1 className='text-2xl underline'>Popular Companions</h1>
      <section className='home-section'>
        {companions.map((companion) => (
          <CompanionCard
            key={companion.id}
            id={companion.id}
            name={companion.name}
            subject={companion.subject}
            topic={companion.topic}
            duration={companion.duration}
            color={companion.color}
          />
        ))}
      </section>
      <section className='home-section'>
        <CompanionsList />
        <CTA />
      </section>
    </main>
  );
};

export default Page;
