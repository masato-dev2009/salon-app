import { TimeSlot } from '@/app/constant/timeSlots'
import { cn } from '@/lib/utils'

type Props = {
  timeSlots: TimeSlot[]
  selectedTime: string
  onSelectTime: (time: string) => void
  canSelectTime: boolean
}
export function TimeSelector({
  timeSlots,
  selectedTime,
  onSelectTime,
  canSelectTime,
}: Props) {
  return (
    <section>
      <h2 className='text-xl font-medium'>Time</h2>
      <div className='mt-6 grid grid-cols-3 gap-3 md:grid-cols-5'>
        {timeSlots.map((slot) => {
          const isSelected = selectedTime === slot.time
          const isDisabled = !canSelectTime || !slot.isAvailable
          return (
            <button
              key={slot.time}
              type='button'
              onClick={() => onSelectTime(slot.time)}
              disabled={isDisabled}
              className={cn(
                !canSelectTime
                  ? 'bg-muted text-muted-foreground cursor-not-allowed rounded-md border px-3 py-2 opacity-40'
                  : !slot.isAvailable
                    ? 'bg-muted text-muted-foreground cursor-not-allowed rounded-md border px-3 py-2 opacity-60'
                    : isSelected
                      ? 'rounded-md border border-black bg-[#0000001e] px-3 py-2'
                      : 'hover:bg-muted rounded-md border px-3 py-2 transition-colors',
              )}
            >
              {slot.time}
            </button>
          )
        })}
      </div>
    </section>
  )
}
