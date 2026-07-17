import { prisma } from '@/lib/prisma'

import { ReservationNewForm } from '@/components/features/reservation/ReservationNewForm'

/**
 * 予約作成ページ
 *
 * ・スタッフ一覧を取得する
 * ・メニュー一覧を取得する
 * ・定休日一覧を取得する
 * ・取得したデータを予約フォームへ渡す
 */

export default async function ReservationPage() {
  // スタッフ一覧を取得
  const staffList = await prisma.staff.findMany({
    orderBy: {
      createdAt: 'asc',
    },
  })
  // メニュー一覧を取得
  const menuList = await prisma.menu.findMany({
    orderBy: {
      createdAt: 'asc',
    },
  })
  // 定休日一覧を取得
  const closedDays = await prisma.closedDay.findMany({
    select: {
      date: true,
    },
  })

  // 毎週の店舗定休日を取得

  const businessClosedDays = await prisma.businessHour.findMany({
    where: {
      isClosed: true,
    },

    select: {
      dayOfWeek: true,
    },
  })
  return (
    <ReservationNewForm
      staffList={staffList}
      menuList={menuList}
      closedDays={closedDays.map((closedDay) => closedDay.date)}
      businessClosedDayNumbers={businessClosedDays.map(
        (businessHour) => businessHour.dayOfWeek,
      )}
    />
  )
}

// <main className='bg-[rgb(247,243,237)]'>
//   <FixedHeader>
//     <div className='flex justify-between'>
//       <Logo href='/' />
//     </div>
//   </FixedHeader>
//   <ReservationNewForm menuList={menuList} staffList={staffList} />
//   <Footer />
// </main>
