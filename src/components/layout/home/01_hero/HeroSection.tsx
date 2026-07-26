import Image from 'next/image'
import styles from '@/app/style.module.css'
import { DesktopNav } from './header/DesktopNav'
import { MobileNav } from './header/MobileNav'
import { FixedHeader } from '../../common/FixedHeader'
import { cn } from '@/lib/utils'
import { container } from '../../common/container'

export function HeroSection() {
  return (
    <section className='relative min-h-screen overflow-hidden bg-[#f7f3ed]'>
      <Image
        src='/image/home/hero.png'
        alt='ヘアスタイルモデル'
        fill
        priority
        className='object-cover object-[70%_center] md:object-cover'
      />
      <div className='absolute inset-0 bg-white/40' />
      <FixedHeader>
        <div className='hidden lg:block'>
          <DesktopNav />
        </div>
        <div className='lg:hidden'>
          <MobileNav />
        </div>
      </FixedHeader>
      <div
        className={cn(
          container,
          'relative z-10 flex min-h-screen items-center',
        )}
      >
        <div className='w-full'>
          <h1
            className={`${styles.textOutline} text-2xl leading-relaxed font-medium tracking-widest md:text-6xl`}
          >
            毎日が少し楽しくなる
            <br />
            ヘアスタイルを
          </h1>
          <p
            className={`${styles.textOutline} text-muted-foreground mt-8 leading-8`}
          >
            お客様一人ひとりの髪質やライフスタイルに寄り添い、
            <br />
            再現性の高いヘアデザインをご提案します。
          </p>
        </div>
      </div>
    </section>
  )
}
