'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { getSubjectColor } from '@/lib/utils';
import { addBookmark, removeBookmark } from '@/lib/actions/companion.actions';
import { usePathname } from 'next/navigation';

interface CompanionCardProps {
  id: string;
  title: string;
  subject: Subject;
  topic: string;
  duration: number;
  bookmarked?: boolean;
}

export default function CompanionCard({
  id,
  title,
  subject,
  topic,
  duration,
  bookmarked,
}: CompanionCardProps) {
  console.log(bookmarked);
  const pathname = usePathname();
  const handleBookmark = async () => {
    if (bookmarked) {
      await removeBookmark(id, pathname);
    } else {
      await addBookmark(id, pathname);
    }
  };
  return (
    <article
      className='companion-card'
      style={{ backgroundColor: getSubjectColor(subject) }}
    >
      <div className='flex justify-between items-center'>
        <div className='subject-badge'>{subject}</div>
        <Button
          className='companion-bookmark p-0 rounded-full'
          onClick={handleBookmark}
        >
          <Image
            src={
              bookmarked ? '/icons/bookmark-filled.svg' : '/icons/bookmark.svg'
            }
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
          Launch Lesson
        </Button>
      </Link>
    </article>
  );
}
