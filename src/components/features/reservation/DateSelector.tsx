/**
 * 予約日選択コンポーネント
 *
 * ・カレンダーを表示する
 * ・選択された日付を親へ返す
 * ・定休日は選択できないようにする
 */

import { Calendar } from '@/components/ui/calendar'

type Props = {
  selectedDate: Date | undefined
  onSelectDate: (date: Date | undefined) => void
  // 定休日一覧
  closedDays: Date[]
  // BusinessHourから取得した店舗定休日の曜日番号
  businessClosedDayNumbers: number[]
}

export function DateSelector({
  selectedDate,
  onSelectDate,
  closedDays,
  businessClosedDayNumbers,
}: Props) {
  return (
    <section>
      <h2 className='text-xl font-medium'>Date</h2>

      <div className='mt-6 rounded-xl border p-6'>
        <Calendar
          mode='single'
          selected={selectedDate}
          onSelect={onSelectDate}
          className='rounded-md'
          disabled={(date) => {
            // 曜日番号がBusinessHourの定休日に含まれているか確認
            const isBusinessClosedDay = businessClosedDayNumbers.includes(
              date.getDay(),
            )
            // 選択日が臨時休業日と一致するか確認
            const isSpecialClosedDay = closedDays.some(
              (closedDay) => closedDay.toDateString() === date.toDateString(),
            )
            // 店舗定休日または臨時休業なら選択不可
            return isBusinessClosedDay || isSpecialClosedDay
          }}
        />
      </div>
    </section>
  )
}
