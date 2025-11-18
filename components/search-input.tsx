'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Input } from './ui/input';

export default function SearchInput() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('topic') || '';
  const [searchQuery, setSearchQuery] = useState<string>(query);

  useEffect(() => {
    const delayInputTimeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchQuery) {
        params.set('topic', searchQuery);
      } else {
        params.delete('topic');
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      // Only push if the URL actually changed
      const currentQueryString = searchParams.toString();
      const currentUrl = currentQueryString
        ? `${pathname}?${currentQueryString}`
        : pathname;

      if (newUrl !== currentUrl) {
        router.push(newUrl);
      }
    }, 500);
    return () => clearTimeout(delayInputTimeout);
  }, [searchQuery, pathname, router]);

  return (
    <div className='flex justify-center'>
      <div className='space-y-6'>
        <div className='relative w-full max-w-sm'>
          <Image
            src='/icons/search.svg'
            alt='search'
            width={16}
            height={16}
            className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground'
          />
          <Input
            className='pl-10'
            type='text'
            placeholder='Search...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
