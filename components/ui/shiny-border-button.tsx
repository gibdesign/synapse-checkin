'use client';

import Link from 'next/link';

type Props = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  type?: 'button' | 'submit';
};

const wrapperClass =
  'group relative inline-flex overflow-hidden rounded-full p-[2px] transition-transform duration-300 snappy hover:scale-[1.02]';
const innerClass =
  'relative z-[1] flex flex-1 items-center justify-center rounded-full bg-[#0a0a0a] px-10 py-4 text-sm font-semibold text-white';
// Solid orange border with a thin sweeping gap - always visible, clean one-direction sweep
const gradientClass =
  'absolute inset-[-100%] animate-spin [animation-duration:3s]';
const gradientStyle = {
  background: 'conic-gradient(from 0deg, #f97316 0%, #f97316 92%, transparent 96%, transparent 100%)',
};

export function ShinyBorderButton({
  children,
  className = '',
  href,
  type = 'button',
}: Props) {
  const content = (
    <>
      <span className={gradientClass} style={gradientStyle} aria-hidden />
      <span className={innerClass}>{children}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${wrapperClass} ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={`${wrapperClass} ${className}`}>
      {content}
    </button>
  );
}
