import CompanionCard from '@/components/companion-card';
import CTA from '@/components/cta';
import CompanionsList from '@/components/companions-list';
import { getSubjectColor } from '@/lib/utils';

const companions = [
  {
    id: '1',
    title: 'Neura the Brainy Explorer',
    subject: 'Math',
    topic: 'Algebra',
    duration: 30,
  },
  {
    id: '2',
    title: 'Countsy the Number Wizard',
    subject: 'Science',
    topic: 'Physics',
    duration: 30,
  },
  {
    id: '3',
    title: 'Verba the Vocabulary Builder',
    subject: 'History',
    topic: 'World War II',
    duration: 30,
  },
];

const recentCompanions = [
  {
    id: '1',
    title: 'Neura the Brainy Explorer',
    subject: 'Math',
    topic: 'Algebra',
    duration: 30,
  },
  {
    id: '2',
    title: 'Countsy the Number Wizard',
    subject: 'Science',
    topic: 'Physics',
    duration: 30,
  },
  {
    id: '3',
    title: 'Verba the Vocabulary Builder',
    subject: 'History',
    topic: 'World War II',
    duration: 30,
  },
  {
    id: '4',
    title: 'Codey the Logic Hacker',
    subject: 'Coding',
    topic: 'Intro to If-Else Statements',
    duration: 30,
  },
  {
    id: '5',
    title: 'Memo the Memory Keeper',
    subject: 'History',
    topic: 'World War II',
    duration: 30,
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
            title={companion.title}
            subject={companion.subject as Subject}
            topic={companion.topic}
            duration={companion.duration}
          />
        ))}
      </section>
      <section className='home-section'>
        <CompanionsList
          title='Recently Completed Sessions'
          companions={recentCompanions as Companion[]}
          className='w-2/3 max-lg:w-full'
        />
        <CTA />
      </section>
    </main>
  );
};

export default Page;
