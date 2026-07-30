import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getAvailableTimeSlots } from '@/actions/reservation/getAvailableTimeSlots'
import { ReservationCheck } from '@/components/features/reservation/ReservationCheck'

type ReservationCheckPageProps = {
  searchParams: Promise<{
    staffId?: string
    menuId?: string
    date?: string
    time?: string
  }>
}

/**
 * URLから渡された予約内容を確認し、
 * 問題がなければ予約確認画面を表示する。
 */
export default async function ReservationCheckPage({
  searchParams,
}: ReservationCheckPageProps) {
  const { staffId, menuId, date, time } = await searchParams

  /**
   * 必須パラメータが不足している場合は、
   * 予約入力画面へ戻す。
   */
  if (!staffId || !menuId || !date || !time) {
    redirect('/reservation/new')
  }

  /**
   * URLから渡されたスタッフとメニューが
   * 実際に存在するか確認する。
   */
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

  if (!staff || !menu) {
    redirect('/reservation/new')
  }

  /**
   * 指定された時間が現在も予約可能か再確認する。
   *
   * URLを書き換えた場合や、
   * 確認画面を開いている間に別の予約が入った場合を防ぐ。
   */
  const timeSlots = await getAvailableTimeSlots({
    staffId,
    menuId,
    date,
  })

  const selectedSlot = timeSlots.find((slot) => slot.time === time)

  if (!selectedSlot?.isAvailable) {
    redirect('/reservation/new')
  }

  return (
    <ReservationCheck
      staffId={staffId}
      staffName={staff.displayName}
      menuId={menuId}
      menuName={menu.name}
      menuPrice={menu.price}
      date={date}
      time={time}
    />
  )
}
