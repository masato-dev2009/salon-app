import { prisma } from '@/lib/prisma'
import { StaffCard } from './StaffCard'
import { SectionHeading } from '../../common/SectionHeading'
import { cn } from '@/lib/utils'
import { container } from '../../common/container'

export async function StaffSection() {
  const staff = await prisma.staff.findMany({
    orderBy: {
      createdAt: 'asc',
    },
  })
  return (
    <section id='staff' className='py-32'>
      <div className={cn(container)}>
        <div className='flex flex-col items-center justify-center'>
          <SectionHeading
            englishTitle='STYLIST'
            title='スタイリスト'
            description={`笑顔と丁寧なカウンセリングで、髪の悩みに寄り添う自慢のスタッフ達です。
            初めての方も緊張せず、どうぞリラックスして何でもご相談ください。`}
          />
          <div className='mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {staff.map((stylist) => (
              <StaffCard
                key={stylist.id}
                displayName={stylist.displayName}
                imageUrl={stylist.imageUrl}
                bio={stylist.bio}
                id={stylist.id}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
