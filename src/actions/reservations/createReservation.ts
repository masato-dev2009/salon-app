// src/actions/reservation/createReservation.ts

'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { isClosedDay } from '@/lib/reservation/isClosedDay'
import { isStaffHoliday } from '@/lib/reservation/isStaffHoliday'
import { isBusinessClosed } from '@/lib/reservation/isBusinessClosed'

type CreateReservationInput = {
  staffId: string
  menuId: string
  date: string
  time: string
}

/**
 * 予約を作成するServer Action
 *
 * - メニュー情報を取得する
 * - 選択された日付・時間から開始時刻と終了時刻を作る
 * - 定休日なら予約を止める
 * - 既存予約と重なっていないか確認する
 * - 問題なければ予約を作成する
 */
export async function createReservation(input: CreateReservationInput) {
  const { staffId, menuId, date, time } = input

  // 選択されたメニューを取得
  const menu = await prisma.menu.findUnique({
    where: { id: menuId },
  })

  if (!menu) {
    throw new Error('メニューが見つかりません')
  }

  // 予約開始日時を作成
  const startTime = new Date(date)
  const [hour, minute] = time.split(':').map(Number)
  startTime.setHours(hour, minute, 0, 0)

  // 予約終了日時を作成
  // Dateはオブジェクトなので、startTimeを直接変更しないようにコピーする
  const endTime = new Date(startTime)
  endTime.setMinutes(endTime.getMinutes() + menu.durationMin)

  const businessHour = await isBusinessClosed(startTime)

  // 選択された日付が定休日か確認
  const closedDay = await isClosedDay(startTime)

  // 選択されたスタッフが、その曜日に休みか確認
  const staffHoliday = await isStaffHoliday(staffId, startTime)

  if (businessHour) {
    throw new Error('火曜日は定休日です')
  }

  if (closedDay) {
    throw new Error(closedDay.reason ?? 'この日は定休日です')
  }
  if (staffHoliday) {
    throw new Error('選択されたスタッフはこの日お休みです')
  }

  // 同じスタッフで、時間が重なる予約がないか確認
  const existingReservation = await prisma.reservation.findFirst({
    where: {
      staffId,
      startTime: {
        lt: endTime,
      },
      endTime: {
        gt: startTime,
      },
      status: {
        in: ['PENDING', 'CONFIRMED'],
      },
    },
  })

  if (existingReservation) {
    throw new Error('この時間はすでに予約されています')
  }

  // 予約を作成
  await prisma.reservation.create({
    data: {
      staffId,
      menuId,
      startTime,
      endTime,
      status: 'PENDING',
    },
  })

  redirect('/reservation/complete')
}
