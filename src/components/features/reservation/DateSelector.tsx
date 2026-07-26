/**
 * 予約日選択コンポーネント
 *
 * ・カレンダーを表示する
 * ・選択された日付を親へ返す
 * ・定休日は選択できないようにする
 */

import { Calendar } from '@/components/ui/calendar'
import { useMemo } from 'react'

type Props = {
  staffId: String
  selectedDate: Date | undefined
  onSelectDate: (date: Date | undefined) => void
  // 定休日一覧
  closedDays: String[]
  // BusinessHourから取得した店舗定休日の曜日番号
  businessClosedWeekdays: number[]
  staffHolidaySchedules: {
    staffId: String
    dayOfWeek: number
  }[]
}

/**
 * 「YYYY-MM-DD」の文字列をローカル時間のDate型へ変換する。
 * new Date('2026-07-17')のように直接変換すると、
 * UTCとして解釈されて日付がずれる可能性があるため、
 * 年・月・日を分割して生成する。
 */
function parseDateString(dateString: String) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * 予約日を選択するカレンダー。
 * 以下の日を選択不可にする。
 * ・過去の日付
 * ・店舗の毎週の定休日
 * ・店舗の臨時休業日
 * ・選択したスタッフの毎週の休日
 */
export function DateSelector({
  staffId,
  selectedDate,
  onSelectDate,
  closedDays,
  businessClosedWeekdays,
  staffHolidaySchedules,
}: Props) {
  /**
   * 現在選択されているスタッフの休日だけを取得する。
   */
  const staffClosedWeekdays = useMemo(() => {
    if (!staffId) {
      return []
    }
    return staffHolidaySchedules
      .filter((schedule) => schedule.staffId === staffId)
      .map((schedule) => schedule.dayOfWeek)
  }, [staffId, staffHolidaySchedules])

  /**
   * 店舗定休日とスタッフ休日を合体させる。
   *
   * Setを使うことで、同じ曜日が重複していても1つにまとめられる。
   */
  const disabledWeekdays = useMemo(() => {
    return Array.from(
      new Set([...businessClosedWeekdays, ...staffClosedWeekdays]),
    )
  }, [businessClosedWeekdays, staffClosedWeekdays])
  /**
   * 臨時休業日の文字列をCalendarで扱えるDate型へ変換する。
   */
  const disabledSpecificDates = useMemo(() => {
    return closedDays.map((closeDay) => parseDateString(closeDay))
  }, [closedDays])

  /**
   * 今日の午前0時を作る。
   * 現在時刻を含んだままだと今日まで無効になる可能性があるため、
   * 時・分・秒・ミリ秒を0にする。
   */
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <section>
      <h2 className='text-xl font-medium'>Date</h2>

      <div className='mt-6'>
        <Calendar
          mode='single'
          selected={selectedDate}
          onSelect={onSelectDate}
          className='w-full rounded-md border'
          disabled={[
            // スタッフを選ぶまでは、すべての日付を選択不可にする
            ...(staffId
              ? []
              : [
                  {
                    before: new Date(9999, 11, 31),
                  },
                ]),
            // 過去の日付
            {
              before: today,
            },
            // 店舗定休日・スタッフ休日
            {
              dayOfWeek: disabledWeekdays,
            },
            // 臨時休業日
            ...disabledSpecificDates,
          ]}
        />
      </div>
    </section>
  )
}
