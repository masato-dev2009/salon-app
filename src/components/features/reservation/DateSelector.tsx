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
}

export function DateSelector({
  selectedDate,
  onSelectDate,
  closedDays,
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
            // 毎週火曜日
            const isTuesday = date.getDay() === 2
            // 臨時休業
            const isClosedDay = closedDays.some(
              (closedDay) => closedDay.toDateString() === date.toDateString(),
            )
            return isTuesday || isClosedDay
          }}
        />
      </div>
    </section>
  )
}
