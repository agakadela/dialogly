import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';

interface CompanionCardProps {
  id: string;
  title: string;
  subject: string;
  topic: string;
  duration: number;
  color: string;
}

export default function CompanionCard({
  id,
  title,
  subject,
  topic,
  duration,
  color,
}: CompanionCardProps) {
  return (
    <article className='companion-card' style={{ backgroundColor: color }}>
      <div className='flex justify-between items-center'>
        <div className='subject-badge'>{subject}</div>
        <Button className='companion-bookmark p-0 rounded-full'>
          <Image
            src='/icons/bookmark.svg'
            alt='bookmark'
            width={12.5}
            height={15}
          />
        </Button>
      </div>
      <h2 className='text-2xl bold'>{title}</h2>
      <p className='text-sm'>{topic}</p>
      <div className='flex items-center gap-2'>
        <Image src='/icons/clock.svg' alt='clock' width={13.5} height={13.5} />
        <p className='text-sm'>{duration} minutes</p>
      </div>
      <Link href={`/companions/${id}`}>
        <Button className='btn-primary w-full justify-center cursor-pointer'>
          View Companion
        </Button>
      </Link>
    </article>
  );
}
