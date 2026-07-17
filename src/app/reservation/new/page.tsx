// app/reservation/new/page.tsx

import { prisma } from '@/lib/prisma'
import { ReservationNewForm } from '@/components/features/reservation/ReservationNewForm'

/**
 * Date型を日本時間の「YYYY-MM-DD」形式へ変換する。
 *
 * toISOString()を直接使うとUTC基準になり、
 * 日本時間との日付ずれが起こる可能性があるため、
 * Asia/Tokyoを明示する。
 */
function formatDateInJapan(date: Date) {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

/**
 * 予約入力ページ
 *
 * スタッフ・メニューと一緒に、
 * カレンダーで無効化するための休日情報を取得する。
 */
export default async function ReservationNewPage() {
  const [staffList, menuList, businessHours, closedDays, staffSchedules] =
    await Promise.all([
      prisma.staff.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      }),

      prisma.menu.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),

      // 店舗の毎週の営業時間・定休日
      prisma.businessHour.findMany(),

      // 店舗の臨時休業日
      prisma.closedDay.findMany({
        where: {
          date: {
            gte: new Date(),
          },
        },
      }),

      // 全スタッフの毎週の勤務スケジュール
      prisma.staffSchedule.findMany(),
    ])

  /**
   * 店舗の毎週の定休日を曜日番号の配列に変換する。
   *
   * 0 = 日曜日
   * 1 = 月曜日
   * 2 = 火曜日
   * ...
   * 6 = 土曜日
   */
  const businessClosedWeekdays = businessHours
    .filter((businessHour) => businessHour.isClosed)
    .map((businessHour) => businessHour.dayOfWeek)

  /**
   * 臨時休業日をClient Componentへ渡せる文字列へ変換する。
   */
  const closedDateStrings = closedDays.map((closedDay) =>
    formatDateInJapan(closedDay.date),
  )

  /**
   * DateSelectorで必要な情報だけに絞る。
   */
  const staffHolidaySchedules = staffSchedules
    .filter((schedule) => schedule.isHoliday)
    .map((schedule) => ({
      staffId: schedule.staffId,
      dayOfWeek: schedule.dayOfWeek,
    }))

  return (
    <ReservationNewForm
      staffList={staffList}
      menuList={menuList}
      businessClosedWeekdays={businessClosedWeekdays}
      closedDates={closedDateStrings}
      staffHolidaySchedules={staffHolidaySchedules}
    />
  )
}
