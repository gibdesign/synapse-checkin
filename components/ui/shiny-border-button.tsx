'use client';

import Link from 'next/link';
import { LinkSpinner } from '@/components/link-spinner';

type Props = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  type?: 'button' | 'submit';
  variant?: 'shiny' | 'plain';
};

const wrapperClass =
  'group relative inline-flex overflow-hidden rounded-full p-[2px] transition-transform duration-300 snappy hover:scale-[1.02]';
const plainWrapperClass =
  'inline-flex rounded-full transition-transform duration-300 snappy hover:scale-[1.02]';
const innerClass =
  'relative z-[1] flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#0a0a0a] px-10 py-4 text-sm font-semibold text-white';
const plainInnerClass =
  'flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white px-10 py-4 text-sm font-semibold text-black';
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
  variant = 'shiny',
}: Props) {
  const isPlain = variant === 'plain';

  const inner = (
    <span className={isPlain ? plainInnerClass : innerClass}>
      {children}
      {href ? <LinkSpinner /> : null}
    </span>
  );

  const content = isPlain ? (
    inner
  ) : (
    <>
      <span className={gradientClass} style={gradientStyle} aria-hidden />
      {inner}
    </>
  );

  const wrapper = isPlain ? plainWrapperClass : wrapperClass;

  if (href) {
    return (
      <Link href={href} prefetch={false} className={`${wrapper} ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={`${wrapper} ${className}`}>
      {content}
    </button>
  );
}
