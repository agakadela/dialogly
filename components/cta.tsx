import Link from 'next/link';
import { Button } from './ui/button';
import Image from 'next/image';

export default function CTA() {
  return (
    <section className='cta-section'>
      <div className='cta-badge'>Start Learning Your Way</div>
      <h2 className='text-2xl font-bold'>
        Build and Personalize Your Learning Companion
      </h2>
      <p className='text-sm'>
        Pick a name, choose a subject, and start learning through natural and
        fun voice conversations.
      </p>
      <Image src='/images/cta.svg' alt='cta' width={362} height={234} />
      <Button className='btn-primary w-full justify-center cursor-pointer'>
        <Image src='/icons/plus.svg' alt='plus' width={16} height={16} />
        <Link href='/companions/new'>Build Your Companion</Link>
      </Button>
    </section>
  );
}
