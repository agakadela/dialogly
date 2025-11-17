import Link from 'next/link';
import Image from 'next/image';
import NavItems from './nav-items';
import { Button } from './ui/button';

export default function Navbar() {
  return (
    <nav className='navbar'>
      <Link href='/'>
        <div className='flex items-center gap2 cursor-pointer'>
          <Image src='/images/logo.svg' alt='Dialogly' width={46} height={60} />
        </div>
      </Link>
      <div className='flex items-center gap-4'>
        <NavItems />
        <Button variant='outline' className='btn-signin'>
          Sign In
        </Button>
      </div>
    </nav>
  );
}
