import { Footer } from '@/components/layout/home/06_footer/Footer'
import { SectionHeading } from '@/components/layout/common/SectionHeading'
import { MenuCard } from '@/components/layout/home/03_menu/MenuCard'
import { ArrowButton } from '@/components/ui/arrow-button'
import { Logo } from '@/components/ui/logo'
import { prisma } from '@/lib/prisma'
import { FixedHeader } from '@/components/layout/common/FixedHeader'
import { cn } from '@/lib/utils'
import { container } from '@/components/layout/common/container'

export default async function MenusPage() {
  const menus = await prisma.menu.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <main className='bg-[rgb(247,243,237)]'>
      <FixedHeader>
        <div className={cn(container, 'flex items-center justify-between')}>
          <Logo href='/' className='' />
          <ArrowButton href='/reservation/new/' children='ご予約はこちら' />
        </div>
      </FixedHeader>
      <section className='mx-auto max-w-7xl px-6 py-24'>
        <div className='flex flex-col items-center justify-center'>
          <SectionHeading
            englishTitle='Menus'
            title='メニュー一覧'
            className='text-2xl'
          />
          <div className='grid gap-4 md:grid-cols-2'>
            {menus.map((menu) => (
              <MenuCard
                englishName={menu.englishName}
                name={menu.name}
                imageUrl={menu.imageUrl}
                description={menu.description}
                price={menu.price}
              />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

{
  /* <p className='text-muted-foreground mt-2 text-sm'>
  {menu.description}
</p>

<div className='mt-4 flex justify-between text-sm'>
  <span>{menu.durationMin}分</span>
  <span className='font-semibold'>
    ¥{menu.price.toLocaleString()}
  </span>
</div> */
}
// </div>
