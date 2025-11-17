import Link from 'next/link';

const navItems = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Companions',
    href: '/companions',
  },
  {
    label: 'My Journey',
    href: '/my-journey',
  },
];

export default function NavItems() {
  return (
    <div className='flex items-center gap-4'>
      {navItems.map(({ label, href }) => (
        <Link href={href} key={label}>
          <p>{label}</p>
        </Link>
      ))}
    </div>
  );
}
