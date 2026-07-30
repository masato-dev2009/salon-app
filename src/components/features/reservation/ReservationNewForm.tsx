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
import { container } from '@/components/layout/common/container'
import { CustomerForm } from './CustomerForm'
import { CustomerData } from './ReservationCheck'

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
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [selectedStaffId, setSelectedStaffId] = useState('')
  const [selectedMenuId, setSelectedMenuId] = useState('')
  const [selectedStaff, setSelectedStaff] = useState('')
  const [selectedMenu, setSelectedMenu] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState('')
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(defaultsTimeSlots)

  /**
   * 確認画面から戻ったとき、
   * 保存済みの顧客情報を入力欄へ復元する。
   */
  useEffect(() => {
    const savedCustomer = sessionStorage.getItem('reservationCustomer')

    if (!savedCustomer) {
      return
    }

    try {
      const parsedCustomer = JSON.parse(savedCustomer) as CustomerData

      setName(parsedCustomer.customerName ?? '')

      setPhone(parsedCustomer.customerPhone ?? '')

      setEmail(parsedCustomer.customerEmail ?? '')
    } catch (error) {
      console.error('顧客情報の復元に失敗しました:', error)

      sessionStorage.removeItem('reservationCustomer')
    }
  }, [])
  /**
   * 確認画面へ進むために必要な項目が、
   * すべて選択されているか判定する。
   */
  const hasContact = Boolean(phone || email)
  const canProceed = Boolean(
    name &&
    hasContact &&
    selectedStaffId &&
    selectedMenuId &&
    selectedDate &&
    selectedTime,
  )

  /**
   * 時間選択に必要な項目が選択されているか判定する。
   */
  const canSelectTime = Boolean(
    name && hasContact && selectedStaffId && selectedMenuId && selectedDate,
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
    <section className={cn(container, 'py-16')}>
      <h1 className='text-3xl font-semibold tracking-widest'>RESERVATION</h1>

      <p className='text-muted-foreground mt-4 text-sm leading-7'>
        スタイリスト、メニュー、日時を選択してください。
      </p>

      <div className='mt-12 space-y-12'>
        <CustomerForm
          customerName={name}
          phone={phone}
          email={email}
          onCustomerNameChange={setName}
          onPhoneChange={setPhone}
          onEmailChange={setEmail}
        />
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
        <div className='grid gap-8 md:grid-cols-2'>
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
        </div>

        <div className='text-md mx-auto max-w-2xs space-y-3 rounded-xl border p-6'>
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
          onClick={() =>
            //顧客情報を一時保存
            sessionStorage.setItem(
              'reservationCustomer',
              JSON.stringify({
                customerName: name,
                customerPhone: phone,
                customerEmail: email,
              }),
            )
          }
        >
          確認
        </ArrowButton>
      </div>
    </section>
  )
}
