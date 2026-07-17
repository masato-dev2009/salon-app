import { ArrowButton } from '@/components/ui/arrow-button'
import { prisma } from '@/lib/prisma'
import { createReservation } from '@/actions/reservations/createReservation'
import { redirect } from 'next/navigation'
import { isBusinessClosed } from '@/lib/reservation/isBusinessClosed'
import { isClosedDay } from '@/lib/reservation/isClosedDay'
import { isStaffHoliday } from '@/lib/reservation/isStaffHoliday'

type Props = {
  searchParams: Promise<{
    staffId?: string
    menuId?: string
    date?: string
    time?: string
  }>
}

export default async function ReservationCheckPage({ searchParams }: Props) {
  const { staffId, menuId, date, time } = await searchParams

  if (!staffId || !menuId || !date || !time) {
    return <div>不正なアクセスです。</div>
  }

  // 選択された日付と時間から予約開始日時を作る

  const startTime = new Date(date)

  const [hour, minute] = time.split(':').map(Number)

  startTime.setHours(hour, minute, 0, 0)

  // 毎週の店舗定休日を確認

  const businessClosed = await isBusinessClosed(startTime)

  if (businessClosed) {
    return <div>この日は店舗の定休日です。</div>
  }

  // 日付指定の臨時休業を確認

  const closedDay = await isClosedDay(startTime)

  if (closedDay) {
    return <div>{closedDay.reason ?? 'この日は臨時休業です。'}</div>
  }

  // 選択されたスタッフが休みか確認

  const staffHoliday = await isStaffHoliday(staffId, startTime)

  if (staffHoliday) {
    return <div>選択されたスタッフはこの日お休みです。</div>
  }
  const reservationInput = { staffId, menuId, date, time }

  async function handleSubmit() {
    'use server'
    await createReservation(reservationInput)
  }

  const [staff, menu] = await Promise.all([
    prisma.staff.findUnique({
      where: {
        id: staffId,
      },
    }),

    prisma.menu.findUnique({
      where: {
        id: menuId,
      },
    }),
  ])

  return (
    <main className='pt-32'>
      <section className='mx-auto max-w-3xl space-y-8'>
        <h1 className='text-3xl font-semibold'>CONFIRM</h1>

        <div className='space-y-4 rounded-xl border p-6'>
          <p>Stylist : {staff?.displayName}</p>

          <p>Menu : {menu?.name}</p>

          <p>Price : ¥{menu?.price.toLocaleString()}</p>

          <p>Date :{new Date(date).toLocaleDateString()}</p>

          <p>Time :{time}</p>
        </div>
        <form action={handleSubmit}>
          <ArrowButton type='submit' children={'確認'} />
        </form>
      </section>
    </main>
  )
}
