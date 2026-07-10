'use client'

import { Menu, Staff } from '@/generated/prisma/client'
import { StaffSelector } from './StaffSelector'
import { MenuSelector } from './MenuSelector'
import { DateSelector } from './DateSelector'
import { TimeSelector } from './TimeSelector'
import { useState } from 'react'
import { cn } from '../../../lib/utils'
import { ArrowButton } from '@/components/ui/arrow-button'

type ReservationNewFormProps = {
  staffList: Staff[]
  menuList: Menu[]
  closedDays: Date[]
}

export function ReservationNewForm({
  staffList,
  menuList,
  closedDays,
}: ReservationNewFormProps) {
  const [selectedStaffId, setSelectedStaffId] = useState('')
  const [selectedMenuId, setSelectedMenuId] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState('')
  const canProceed =
    selectedStaffId && selectedMenuId && selectedDate && selectedTime

  return (
    <section className='mx-auto max-w-5xl px-4 py-16'>
      <h1 className='text-3xl font-semibold tracking-widest'>RESERVATION</h1>
      <p className='text-muted-foreground mt-4 text-sm leading-7'>
        スタイリスト、メニュー、日時を選択してください。
      </p>
      <div className='mt-12 space-y-12'>
        <StaffSelector
          staffList={staffList}
          selectedStaffId={selectedStaffId}
          onSelectStaff={setSelectedStaffId}
        />
        <MenuSelector
          menuList={menuList}
          selectedMenuId={selectedMenuId}
          onSelectMenu={setSelectedMenuId}
        />
        <DateSelector
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          closedDays={closedDays}
        />
        <TimeSelector
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
        />
        <div className='rounded-xl border p-6 text-sm'>
          <p>selectedStaffId: {selectedStaffId || '未選択'}</p>
          <p>selectedMenuId: {selectedMenuId || '未選択'}</p>
          <p>selectedDate :{selectedDate?.toLocaleDateString() ?? '未選択'}</p>
          <p>selectedTime: {selectedTime || '未選択'}</p>
        </div>
      </div>
      <ArrowButton
        href={`/reservation/check?staffId=${selectedStaffId}&menuId=${selectedMenuId}&date=${selectedDate?.toISOString()}&time=${selectedTime}`}
        children={'確認'}
        className={cn(!canProceed && 'pointer-events-none opacity-50')}
      />
    </section>
  )
}
