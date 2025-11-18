import Link from 'next/link';
import Image from 'next/image';
import NavItems from './nav-items';
import { Button } from './ui/button';
import { UserButton, SignInButton } from '@clerk/nextjs';
import { SignedIn, SignedOut } from '@clerk/nextjs';

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
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode='modal'>
            <Button variant='outline' className='btn-signin'>
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </nav>
  );
}
