'use client'

import type { Menu, Staff } from '@/generated/prisma/client'
import { useEffect, useState } from 'react'
import { StaffSelector } from './StaffSelector'
import { MenuSelector } from './MenuSelector'
import { DateSelector } from './DateSelector'
import { TimeSelector } from './TimeSelector'
import { cn } from '@/lib/utils'
import { ArrowButton } from '@/components/ui/arrow-button'
import { getAvailableTimeSlots } from '@/actions/reservation/getAvailableTimeSlots'
import { defaultsTimeSlots, type TimeSlot } from '@/app/constant/timeSlots'

type ReservationNewFormProps = {
  staffList: Staff[]
  menuList: Menu[]
  closedDates: string[]
  businessClosedWeekdays: number[]
  staffHolidaySchedules: {
    staffId: string
    dayOfWeek: number
  }[]
}

export function ReservationNewForm({
  staffList,
  menuList,
  closedDates,
  businessClosedWeekdays,
  staffHolidaySchedules,
}: ReservationNewFormProps) {
  const [selectedStaffId, setSelectedStaffId] = useState('')
  const [selectedMenuId, setSelectedMenuId] = useState('')
  const [selectedStaff, setSelectedStaff] = useState('')
  const [selectedMenu, setSelectedMenu] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState('')
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(defaultsTimeSlots)

  /**
   * 確認画面へ進むために必要な項目が、
   * すべて選択されているか判定する。
   */
  const canProceed = Boolean(
    selectedStaffId && selectedMenuId && selectedDate && selectedTime,
  )

  /**
   * 時間選択に必要な項目が選択されているか判定する。
   */
  const canSelectTime = Boolean(
    selectedStaffId && selectedMenuId && selectedDate,
  )

  /**
   * Date型を「YYYY-MM-DD」形式へ変換する。
   *
   * toISOStringはUTCへ変換されるため、
   * 日本時間の日付をそのまま送る目的では使用しない。
   */
  function formatDate(date: Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  /**
   * 初期時間一覧を、すべて選択不可に変換する。
   */
  function createDisabledTimeSlots(): TimeSlot[] {
    return defaultsTimeSlots.map((slot) => ({
      ...slot,
      isAvailable: false,
    }))
  }

  /**
   * スタッフ、メニュー、日付が変わったら、
   * その条件で予約可能な時間を取得する。
   */
  useEffect(() => {
    let isCancelled = false

    async function loadAvailableTimes() {
      /**
       * 必要な選択項目が不足している場合は、
       * 初期時間一覧へ戻す。
       */
      if (!selectedStaffId || !selectedMenuId || !selectedDate) {
        setTimeSlots(defaultsTimeSlots)
        setSelectedTime('')
        return
      }

      /**
       * 条件が変わったため、
       * 以前選択していた時間を解除する。
       */
      setSelectedTime('')

      try {
        const times = await getAvailableTimeSlots({
          staffId: selectedStaffId,
          menuId: selectedMenuId,
          date: formatDate(selectedDate),
        })

        /**
         * 通信中に選択条件が変更されていた場合は、
         * 古い取得結果を画面へ反映しない。
         */
        if (isCancelled) {
          return
        }

        console.log('取得した時間:', times)

        /**
         * 定休日やスタッフ休日などで空配列が返った場合も、
         * 時間欄を消さず、すべて選択不可として表示する。
         */
        if (times.length === 0) {
          setTimeSlots(createDisabledTimeSlots())
          return
        }

        setTimeSlots(times)
      } catch (error) {
        if (isCancelled) {
          return
        }

        console.error('空き時間の取得に失敗しました', error)

        /**
         * エラー時も時間候補を消さず、
         * すべて選択不可として表示する。
         */
        setTimeSlots(createDisabledTimeSlots())
      }
    }

    loadAvailableTimes()

    return () => {
      isCancelled = true
    }
  }, [selectedStaffId, selectedMenuId, selectedDate])

  const selectedDateString = selectedDate ? formatDate(selectedDate) : ''

  const checkPageUrl =
    `/reservation/check` +
    `?staffId=${encodeURIComponent(selectedStaffId)}` +
    `&menuId=${encodeURIComponent(selectedMenuId)}` +
    `&date=${encodeURIComponent(selectedDateString)}` +
    `&time=${encodeURIComponent(selectedTime)}`

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
          onSelectedStaffId={setSelectedStaffId}
          onSelectStaff={setSelectedStaff}
          offSelectedStaffDate={setSelectedDate}
        />

        <MenuSelector
          menuList={menuList}
          selectedMenuId={selectedMenuId}
          onSelectMenuId={setSelectedMenuId}
          onSelectMenu={setSelectedMenu}
        />

        <DateSelector
          staffId={selectedStaffId}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          closedDays={closedDates}
          businessClosedWeekdays={businessClosedWeekdays}
          staffHolidaySchedules={staffHolidaySchedules}
        />

        <TimeSelector
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
          timeSlots={timeSlots}
          canSelectTime={canSelectTime}
        />

        <div className='rounded-xl border p-6 text-sm'>
          <p>スタッフ: {selectedStaff || '未選択'}</p>
          <p>メニュー: {selectedMenu || '未選択'}</p>
          <p>日付: {selectedDate?.toLocaleDateString() ?? '未選択'}</p>
          <p>時間: {selectedTime || '未選択'}</p>
        </div>
      </div>

      <div className='mt-6 flex justify-center'>
        <ArrowButton
          href={checkPageUrl}
          className={cn(!canProceed && 'pointer-events-none opacity-50')}
        >
          確認
        </ArrowButton>
      </div>
    </section>
  )
}
