import { Footer } from '@/components/layout/home/06_footer/Footer'
import { SectionHeading } from '@/components/layout/common/SectionHeading'
import { StaffCard } from '@/components/layout/home/04_staff/StaffCard'
import { Logo } from '@/components/ui/logo'
import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { ArrowButton } from '@/components/ui/arrow-button'
import { FixedHeader } from '@/components/layout/common/FixedHeader'
import { cn } from '@/lib/utils'
import { container } from '@/components/layout/common/container'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function StaffPage({ params }: Props) {
  const { id } = await params

  const [staff, staffList] = await Promise.all([
    prisma.staff.findUnique({
      where: {
        id,
      },
    }),

    prisma.staff.findMany({
      where: {
        id: {
          not: id,
        },
      },

      orderBy: {
        createdAt: 'asc',
      },
    }),
  ])

  if (!staff) {
    return null
  }

  const noImageSrc = '/image/home/no_image.png'

  return (
    <main className='bg-[rgb(247,243,237)]'>
      <FixedHeader>
        <div className={cn(container, 'flex items-center justify-between')}>
          <Logo href='/' />
          <ArrowButton href='/reservation/new/' children='ご予約はこちら' />
        </div>
      </FixedHeader>
      <section className='mx-auto px-6 pt-24 md:max-w-7xl md:px-0'>
        <div className='flex flex-col items-center'>
          <SectionHeading
            englishTitle='Stylist'
            title='スタイリスト一覧'
            className='text-2xl'
          />
          <Card className='w-full overflow-hidden md:w-lg'>
            <CardContent className='text-muted-foreground m-3 leading-6'>
              <div className='relative mb-6 aspect-square overflow-hidden rounded-lg'>
                <Image
                  alt={staff.displayName}
                  fill
                  src={staff.imageUrl || noImageSrc}
                  className='object-cover object-top'
                />
              </div>
              <p className='font-cormorant text-[15px] tracking-widest'>
                {staff.displayName}
              </p>
              {staff.bio}
            </CardContent>
          </Card>

          <div className='grid gap-4 py-36 md:grid-cols-2'>
            {staffList.map(
              (staff) =>
                staff.id != id && (
                  <StaffCard
                    key={staff.id}
                    displayName={staff.displayName}
                    imageUrl={staff.imageUrl}
                    bio={staff.bio}
                    id={staff.id}
                  />
                ),
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
