import { prisma } from '@/lib/prisma'

/**
 * 指定したスタッフが、指定日の曜日に休みかどうかを判定する関数
 *
 * StaffSchedule の dayOfWeek と isHoliday を確認し、
 * 休みなら StaffSchedule を返し、
 * 休みでなければ null を返す。
 */
export async function isStaffHoliday(staffId: string, date: Date) {
  // Date#getDay() は 0:日曜, 1:月曜, 2:火曜 ... 6:土曜 を返す
  const dayOfWeek = date.getDay()

  // 指定スタッフの該当曜日スケジュールを検索
  const schedule = await prisma.staffSchedule.findUnique({
    where: {
      staffId_dayOfWeek: {
        staffId,
        dayOfWeek,
      },
    },
  })

  // スケジュールが存在し、休日設定なら返す
  if (schedule?.isHoliday) {
    return schedule
  }

  // 休日でなければ null
  return null
}
