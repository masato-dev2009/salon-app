'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import styles from '@/app/style.module.css'

interface ArrowButtonProps extends React.ComponentProps<typeof Button> {
  href?: string
  children: React.ReactNode
  textClassName?: string
  transparent?: boolean
}

export function ArrowButton({
  href,
  className,
  children,
  textClassName,
  transparent,
  ...props
}: ArrowButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const content = (
    <>
      <p className={textClassName}>{children}</p>
      <span
        className={cn(
          'inline-block transition duration-300 ease-in-out',
          isOpen ? 'translate-x-2' : 'translate-x-0',
        )}
      >
        {'>'}
      </span>
    </>
  )

  const buttonClassName = cn(
    'border-none px-4 py-6 md:px-10',
    props.variant !== 'outline' && 'bg-[#000000aa]',
    transparent && styles.transparentLeft,
    className,
  )

  if (href) {
    return (
      <Button
        asChild
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={buttonClassName}
        {...props}
      >
        <Link href={href} prefetch>
          {content}
        </Link>
      </Button>
    )
  }

  return (
    <Button
      type={props.type ?? 'button'}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className={buttonClassName}
      {...props}
    >
      {content}
    </Button>
  )
}
