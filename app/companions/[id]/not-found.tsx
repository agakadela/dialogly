import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className='flex flex-col items-center justify-center min-h-[60vh] gap-6'>
      <div className='text-center space-y-4'>
        <h1 className='text-4xl font-bold'>Companion Not Found</h1>
        <p className='text-lg text-gray-600'>
          The companion you're looking for doesn't exist or has been removed.
        </p>
      </div>
      <Link href='/companions'>
        <Button className='btn-primary'>Browse All Companions</Button>
      </Link>
    </main>
  );
}

