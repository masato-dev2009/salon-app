import { prisma } from '@/lib/prisma'

/**
 * 指定した日付が定休日かどうかを判定する関数
 * 定休日なら ClosedDay オブジェクトを返し、
 * 定休日でなければ null を返す。
 */
export async function isClosedDay(date: Date) {
  // 指定日の0時0分0秒にする
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)

  // 指定日の23時59分59.999秒にする
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  // その日が定休日として登録されているか検索
  const closedDay = await prisma.closedDay.findFirst({
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  })

  // 定休日ならオブジェクト、なければ null
  return closedDay
}
