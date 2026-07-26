import { cn } from '@/lib/utils'
import Image from 'next/image'
import { container } from '../../common/container'

export function ConceptSection() {
  return (
    <section id='concept' className='bg-[#f7f3ed] pt-32'>
      <div
        className={cn(container, 'grid gap-16 md:grid-cols-2 md:items-start')}
      >
        <div className='relative aspect-square overflow-hidden rounded-sm'>
          <Image
            src='/image/home/concept.png'
            alt='サロンイメージ'
            fill
            className='object-cover'
          />
        </div>
        <div className='flex flex-col items-center md:items-start'>
          <p className='font-cormorant text-muted-foreground text-center text-sm tracking-[0.4em] md:text-start'>
            CONCEPT
          </p>
          <h2 className='mt-6 text-3xl leading-relaxed md:text-4xl'>
            毎日が少し楽しくなる
            <br />
            ヘアデザインを
          </h2>
          <p className='text-muted-foreground mt-10 leading-9'>
            お客様一人ひとりの髪質やライフスタイルに寄り添い、
            再現性の高いスタイルをご提案します。 サロン帰りだけでなく、
            ご自宅でも扱いやすいデザインを大切にしています。
          </p>
        </div>
      </div>
    </section>
  )
}
