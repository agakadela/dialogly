import CompanionForm from '@/components/companion-form';
import { newCompanionPermissions } from '@/lib/actions/companion.actions';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function NewCompanionPage() {
  const { userId: author } = await auth();
  if (!author) {
    redirect('/sign-in');
  }
  const canCreateCompanion = await newCompanionPermissions();

  return (
    <main className='min-lg:w-1/3 min-md:2/3 items-center justify-center flex'>
      {canCreateCompanion ? (
        <article className='w-full flex flex-col gap-4'>
          <h1>Build Your Companion</h1>
          <CompanionForm />
        </article>
      ) : (
        <article className='companion-limit'>
          <Image
            src='/images/limit.svg'
            alt='companion limit'
            width={360}
            height={230}
          />
          <div className='cta-badge'>Upgrade your plan</div>
          <h1>You have reached the maximum number of companions</h1>
          <p>Please upgrade to create more companions</p>
          <Button className='btn-primary w-full justify-center cursor-pointer'>
            <Link href='/subscription'>Upgrade</Link>
          </Button>
        </article>
      )}
    </main>
  );
}
