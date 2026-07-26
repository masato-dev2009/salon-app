// src/actions/reservation/getAvailableTimeSlots.ts

'use server'

import type { TimeSlot } from '@/app/constant/timeSlots'
import { prisma } from '@/lib/prisma'

type GetAvailableTimeSlotsInput = {
  staffId: string
  menuId: string
  date: string
}

/**
 * BusinessHourに営業時間が登録されていない曜日で使用する、
 * 店舗の基本営業時間。
 */
const DEFAULT_OPEN_TIME = '10:00'
const DEFAULT_CLOSE_TIME = '20:00'

/**
 * 「HH:mm」形式の文字列を分へ変換する。
 *
 * 例:
 * 10:30 → 630分
 */
function timeToMinutes(time: string) {
  const [hour, minute] = time.split(':').map(Number)

  return hour * 60 + minute
}

/**
 * 分を「HH:mm」形式へ変換する。
 *
 * 例:
 * 630分 → 10:30
 */
function minutesToTime(totalMinutes: number) {
  const hour = Math.floor(totalMinutes / 60)
  const minute = totalMinutes % 60

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

/**
 * 日本時間の年月日と時刻からDateを作成する。
 *
 * サーバー環境のタイムゾーンに影響されないように、
 * +09:00を明示する。
 */
function createJapanDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00+09:00`)
}

/**
 * YYYY-MM-DD形式の日付から曜日番号を取得する。
 *
 * 0: 日曜日
 * 1: 月曜日
 * 2: 火曜日
 * ...
 * 6: 土曜日
 */
function getDayOfWeek(date: string) {
  return new Date(`${date}T00:00:00Z`).getUTCDay()
}

/**
 * 指定されたスタッフ・メニュー・日付から、
 * 予約時間候補を取得する。
 *
 * BusinessHourに該当曜日のデータがない場合は、
 * 通常営業時間として10:00〜20:00を使用する。
 */
export async function getAvailableTimeSlots(
  input: GetAvailableTimeSlotsInput,
): Promise<TimeSlot[]> {
  const { staffId, menuId, date } = input

  if (!staffId || !menuId || !date) {
    return []
  }

  const dayOfWeek = getDayOfWeek(date)

  console.log('空き時間取得条件:', {
    date,
    dayOfWeek,
  })

  /**
   * メニュー、営業時間、スタッフ勤務情報を並列で取得する。
   */
  const [menu, businessHour, staffSchedule] = await Promise.all([
    prisma.menu.findUnique({
      where: {
        id: menuId,
      },
    }),

    /**
     * 選択日の曜日に対応する営業時間データを取得する。
     *
     * 該当データが存在しない場合はnullになるが、
     * その場合は通常営業として扱う。
     */
    prisma.businessHour.findUnique({
      where: {
        dayOfWeek,
      },
    }),

    prisma.staffSchedule.findUnique({
      where: {
        staffId_dayOfWeek: {
          staffId,
          dayOfWeek,
        },
      },
    }),
  ])

  if (!menu) {
    console.log('選択されたメニューが見つかりません。')
    return []
  }

  /**
   * 該当曜日が明示的に定休日として登録されている場合は、
   * 時間候補を返さない。
   */
  if (businessHour?.isClosed) {
    console.log('選択した曜日は店舗の定休日です。', {
      date,
      dayOfWeek,
    })

    return []
  }

  /**
   * スタッフが休日として登録されている場合も、
   * 時間候補を返さない。
   */
  if (staffSchedule?.isHoliday) {
    console.log('選択した曜日はスタッフの休日です。', {
      staffId,
      date,
      dayOfWeek,
    })

    return []
  }

  /**
   * 営業時間の優先順位
   *
   * 1. スタッフ個別の勤務時間
   * 2. 選択曜日の店舗営業時間
   * 3. 店舗の基本営業時間（10:00〜20:00）
   */
  const openTime =
    staffSchedule?.startTime ?? businessHour?.openTime ?? DEFAULT_OPEN_TIME

  const closeTime =
    staffSchedule?.endTime ?? businessHour?.closeTime ?? DEFAULT_CLOSE_TIME

  const dayStart = createJapanDateTime(date, '00:00')
  const nextDayStart = new Date(dayStart)

  /**
   * Dateは内部的に絶対時刻として保持されるため、
   * 24時間後を翌日の開始時刻として使用する。
   */
  nextDayStart.setTime(dayStart.getTime() + 24 * 60 * 60 * 1000)

  /**
   * 選択したスタッフの、その日の予約を取得する。
   * キャンセル済みの予約は重複判定から除外する。
   */
  const existingReservations = await prisma.reservation.findMany({
    where: {
      staffId,
      startTime: {
        gte: dayStart,
        lt: nextDayStart,
      },
      status: {
        not: 'CANCELED',
      },
    },
    select: {
      startTime: true,
      endTime: true,
    },
    orderBy: {
      startTime: 'asc',
    },
  })

  const timeSlots: TimeSlot[] = []

  const openingMinutes = timeToMinutes(openTime)
  const closingMinutes = timeToMinutes(closeTime)
  const durationMinutes = menu.durationMin

  /**
   * 営業時間や施術時間に異常な値がある場合は、
   * 時間候補を作成しない。
   */
  if (
    Number.isNaN(openingMinutes) ||
    Number.isNaN(closingMinutes) ||
    durationMinutes <= 0 ||
    openingMinutes >= closingMinutes
  ) {
    console.error('営業時間または施術時間の設定が不正です。', {
      openTime,
      closeTime,
      durationMinutes,
    })

    return []
  }

  /**
   * 30分単位で予約候補を作成する。
   */
  for (
    let startMinutes = openingMinutes;
    startMinutes <= closingMinutes;
    startMinutes += 30
  ) {
    const startTimeString = minutesToTime(startMinutes)
    const endTimeString = minutesToTime(startMinutes + durationMinutes)
    const candidateStartTime = createJapanDateTime(date, startTimeString)
    const candidateEndTime = createJapanDateTime(date, endTimeString)
    const canFinishInTime = startMinutes + durationMinutes <= closingMinutes
    /**
     * 既存予約と候補時間が重なっているか確認する。
     *
     * 既存予約開始 < 候補終了
     * かつ
     * 既存予約終了 > 候補開始
     */
    const isOverlapping = existingReservations.some((reservation) => {
      return (
        reservation.startTime < candidateEndTime &&
        reservation.endTime > candidateStartTime
      )
    })

    /**
     * すべての時間候補を追加する。
     *
     * 予約と重なる時間だけ、
     * isAvailableをfalseにする。
     */
    timeSlots.push({
      time: startTimeString,
      isAvailable: canFinishInTime && !isOverlapping,
    })
  }

  return timeSlots
}
