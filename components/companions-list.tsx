import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

interface CompanionsListProps {
  title: string;
  companions?: Companion[];
  className?: string;
}

export default function CompanionsList({
  title = 'Recent Sessions',
  companions,
  className,
}: CompanionsListProps) {
  return (
    <>
      {companions && companions.length > 0 ? (
        <>
          <article className={cn('companion-list', className)}>
            <h2 className='font-bold text-2xl'>{title}</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-lg w-2/3'>Lessons</TableHead>
                  <TableHead className='text-lg'>Subject</TableHead>
                  <TableHead className='text-lg text-right'>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companions?.map(
                  ({ $id, title, subject, topic, duration, color }) => (
                    <TableRow key={$id || title}>
                      <TableCell>
                        <Link href={`/companions/${$id}`}>
                          <div className='flex items-center gap-2'>
                            <div
                              className='size-[72px] flex items-center justify-center rounded-lg max-md:hidden'
                              style={{ backgroundColor: color }}
                            >
                              <Image
                                src={`/icons/${subject}.svg`}
                                alt={subject}
                                width={36}
                                height={36}
                              />
                            </div>
                            <div className='flex flex-col gap-2'>
                              <p className='font-bold text-xl'>{title}</p>
                              <p>{topic}</p>
                            </div>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className='subject-badge w-fit max-md:hidden'>
                          {subject}
                        </div>
                        <div
                          className='flex items-center justify-center rounded-lg w-fit p-2 md:hidden'
                          style={{ backgroundColor: color }}
                        >
                          <Image
                            src={`/icons/${subject}.svg`}
                            alt={subject}
                            width={20}
                            height={20}
                          />
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center gap-2 w-full justify-end'>
                          <Image
                            src='/icons/clock.svg'
                            alt='clock'
                            width={13.5}
                            height={13.5}
                          />
                          <p className='text-lg font-bold'>
                            {duration}{' '}
                            <span className='text-sm'>
                              {duration === 1 ? 'min' : 'mins'}
                            </span>
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </article>
        </>
      ) : (
        <div className='text-center text-lg'>No recent companions found</div>
      )}
    </>
  );
}
