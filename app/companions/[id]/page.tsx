import { getCompanion } from '@/lib/actions/companion.actions';
import { notFound, redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { getSubjectColor } from '@/lib/utils';
import Image from 'next/image';
import CompanionComponent from '@/components/companion-component';

interface CompanionSessionPageProps {
  params: Promise<{ id: string }>;
}

export default async function CompanionSessionPage({
  params,
}: CompanionSessionPageProps) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const companion = await getCompanion(id);

  if (!companion) {
    notFound();
  }

  return (
    <main>
      <article className='flex rounded-border justify-between p-6 max-md:flex-col'>
        <div className='flex items-center gap-2'>
          <div
            className='size-[72px] flex item-center justify-center rounded-lg max-md:hidden'
            style={{ backgroundColor: getSubjectColor(companion.subject) }}
          >
            <Image
              src={`/icons/${companion.subject}.svg`}
              alt={companion.subject}
              width={36}
              height={36}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <h2 className='text-2xl bold'>{companion.title}</h2>
              <p className='subject-badge max-sm:hidden'>{companion.subject}</p>
            </div>
            <p className='text-sm'>{companion.topic}</p>
          </div>
        </div>
        <div className='flex items-center justify-center gap-2 max-md:hidden'>
          <Image
            src='/icons/clock.svg'
            alt='clock'
            width={13.5}
            height={13.5}
          />
          <p className='text-sm'>{companion.duration} minutes</p>
        </div>
      </article>
      <CompanionComponent
        companion={companion as Companion}
        userName={user.fullName}
        userImage={user.imageUrl}
      />
    </main>
  );
}
