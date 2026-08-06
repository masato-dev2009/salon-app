'use client'

import Image from 'next/image'
import { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

type Props = {
  src: string
  alt: string
}

export function MenuImageDialog({ src, alt }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={cn(
            'relative aspect-square w-64 cursor-pointer overflow-hidden rounded-lg',
            'focus:outline-none focus-visible:ring-0',
          )}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className='object-cover object-center transition-transform duration-300 hover:scale-105'
          />
        </button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className='fixed! inset-0! top-0! left-0! h-screen! w-screen! max-w-none! translate-x-0! translate-y-0! rounded-none border-none bg-[#00000099] p-0 shadow-none'
      >
        <DialogClose asChild>
          <button
            type='button'
            aria-label='閉じる'
            className='absolute top-4 right-4 z-50 flex size-10 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none'
          >
            <X className='size-5' />
          </button>
        </DialogClose>
        <div
          className='flex h-full w-full items-center justify-center p-6'
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setOpen(false)
            }
          }}
        >
          <div className='relative aspect-square max-h-[90vh] w-[90vw] max-w-5xl'>
            <Image
              src={src}
              alt={alt}
              fill
              className='object-contain object-center'
            />
          </div>
        </div>
      </DialogContent>{' '}
    </Dialog>
  )
}
