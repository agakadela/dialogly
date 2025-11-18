'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { subjects } from '@/constants';

const SubjectFilter = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('subject') || '';

  const [subject, setSubject] = useState(query);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (subject === 'all' || !subject) {
      params.delete('subject');
    } else {
      params.set('subject', subject);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    const currentQueryString = searchParams.toString();
    const currentUrl = currentQueryString
      ? `${pathname}?${currentQueryString}`
      : pathname;

    if (newUrl !== currentUrl) {
      router.push(newUrl, { scroll: false });
    }
  }, [subject, pathname, router, searchParams]);

  return (
    <Select onValueChange={setSubject} value={subject}>
      <SelectTrigger className='input capitalize w-24'>
        <SelectValue placeholder='Subject' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>All subjects</SelectItem>
        {subjects.map((subject) => (
          <SelectItem key={subject} value={subject} className='capitalize'>
            {subject}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SubjectFilter;
