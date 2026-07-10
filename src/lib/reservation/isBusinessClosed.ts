// src/lib/reservation/isBusinessClosed.ts

import { prisma } from '@/lib/prisma'

/**
 * 指定した日付が、店舗全体の定休日かどうかを判定する関数
 *
 * BusinessHour は「毎週の営業ルール」を管理する。
 * 例：
 * - 火曜日は定休日
 * - 月曜日は営業日
 *
 * 定休日なら BusinessHour のデータを返し、
 * 営業日なら null を返す。
 */
export async function isBusinessClosed(date: Date) {
  // Date#getDay() は 0:日曜, 1:月曜, 2:火曜 ... 6:土曜 を返す
  const dayOfWeek = date.getDay()

  // 指定された曜日の営業ルールを取得
  const businessHour = await prisma.businessHour.findUnique({
    where: {
      dayOfWeek,
    },
  })

  // BusinessHour にデータがあり、isClosed が true なら店舗定休日
  if (businessHour?.isClosed) {
    return businessHour
  }

  // データがない、または isClosed が false なら営業日として扱う
  return null
}
