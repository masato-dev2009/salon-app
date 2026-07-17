import { timeSlots } from '@/app/constant/timeSlots'
import { cn } from '@/lib/utils'

type Props = {
  selectedTime: string
  onSelectTime: (time: string) => void
}
export function TimeSelector({ selectedTime, onSelectTime }: Props) {
  return (
    <section>
      <h2 className='text-xl font-medium'>Time</h2>
      <div className='mt-6 grid grid-cols-3 gap-3 md:grid-cols-5'>
        {timeSlots.map((time) => {
          const isSelected = selectedTime === time
          return (
            <button
              key={time}
              type='button'
              onClick={() => onSelectTime(time)}
              className={cn(
                'rounded-xl border p-4 transition hover:border-black',
                isSelected && 'border-black bg-[#0000001e]',
              )}
            >
              {time}
            </button>
          )
        })}
      </div>
    </section>
  )
}
