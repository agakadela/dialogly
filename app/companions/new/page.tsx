import CompanionForm from '@/components/companion-form';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function NewCompanionPage() {
  const { userId: author } = await auth();
  if (!author) {
    redirect('/sign-in');
  }
  return (
    <main className='min-lg:w-1/3 min-md:2/3 items-center justify-center flex'>
      <article className='w-full flex flex-col gap-4'>
        <h1>Build Your Companion</h1>
        <CompanionForm />
      </article>
    </main>
  );
}
