import { prisma } from '@/lib/prisma'
import { MenuCard } from './MenuCard'
import { SectionHeading } from '../../common/SectionHeading'
import { ArrowButton } from '@/components/ui/arrow-button'
import { cn } from '@/lib/utils'
import { container } from '../../common/container'

export async function MenuSection() {
  const menus = await prisma.menu.findMany({
    take: 3,
    orderBy: {
      createdAt: 'asc',
    },
  })
  return (
    <section id='menu' className='py-32'>
      <div className={cn(container)}>
        <div className='flex flex-col items-center justify-center'>
          <SectionHeading
            englishTitle='MENU'
            title='人気メニュー'
            description='髪質やライフスタイルに合わせて、扱いやすく自然なスタイルをご提案します。'
          ></SectionHeading>
          <div className='mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {menus.map((menu) => (
              <MenuCard
                key={menu.id}
                name={menu.name}
                imageUrl={menu.imageUrl}
                englishName={menu.englishName}
                description={menu.description}
                price={menu.price}
              />
            ))}
          </div>
          <ArrowButton href='/menus' children='メニュー一覧' className='mt-6' />
        </div>
      </div>
    </section>
  )
}
