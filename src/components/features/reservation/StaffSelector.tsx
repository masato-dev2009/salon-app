import { Staff } from '@/generated/prisma/client'
import { cn } from '@/lib/utils'

type Props = {
  staffList: Staff[]
  selectedStaffId: string
  onSelectedStaffId: (StaffId: string) => void
  onSelectStaff: (StaffName: string) => void
  offSelectedStaffDate: (OffDate: undefined) => void
}

export function StaffSelector({
  staffList,
  selectedStaffId,
  onSelectedStaffId,
  onSelectStaff,
  offSelectedStaffDate,
}: Props) {
  return (
    <section>
      <h2 className='text-xl font-medium'>Stylist</h2>

      <div className='mt-6 grid gap-4 md:grid-cols-3'>
        {staffList.map((staff) => {
          const isSelected = selectedStaffId === staff.id
          return (
            <button
              key={staff.id}
              type='button'
              onClick={() => {
                ;((onSelectedStaffId(staff.id),
                onSelectStaff(staff.displayName)),
                  offSelectedStaffDate(undefined))
              }}
              className={cn(
                'rounded-xl border p-4 text-left transition hover:border-black',
                isSelected && 'border-black bg-[#0000001e]',
              )}
            >
              <p className='font-medium'>{staff.displayName}</p>
              <p className='text-muted-foreground mt-2 text-sm'>
                {staff.position}
              </p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
