'use client'

import { useEffect, useState } from 'react'
import { createReservation } from '@/actions/reservation/createReservation'
import { ArrowButton } from '@/components/ui/arrow-button'
import { useRouter } from 'next/navigation'
import { ReservationConflict } from './ReservationConflict'

/**
 * check/page.tsxから受け取る予約情報
 *
 * スタッフ名やメニュー名などは、
 * Server Component側でPrismaから取得して渡す。
 */
type ReservationCheckProps = {
  staffId: string
  staffName: string
  menuId: string
  menuName: string
  menuPrice: number
  date: string
  time: string
}

/**
 * sessionStorageに一時保存する顧客情報
 */
export type CustomerData = {
  customerName: string
  customerPhone: string
  customerEmail: string
}

/**
 * 予約確認画面の表示と予約確定処理を担当するClient Component
 */
export function ReservationCheck({
  staffId,
  staffName,
  menuId,
  menuName,
  menuPrice,
  date,
  time,
}: ReservationCheckProps) {
  // sessionStorageから読み出した顧客情報を保持する
  const [customer, setCustomer] = useState<CustomerData | null>(null)

  // sessionStorageの読み込みが完了したかを管理する
  const [isLoaded, setIsLoaded] = useState(false)

  // 予約処理中かどうかを管理する
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Server Actionで発生したエラーを画面内に表示する
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  //完了ページに遷移する
  const router = useRouter()

  // ダブルブッキング時の画面切り替え
  const [isConflict, setIsConflict] = useState(false)
  /**
   * コンポーネント表示後にsessionStorageから顧客情報を取得する
   *
   * sessionStorageはブラウザ上でしか使えないため、
   * useEffect内で読み出す。
   */
  useEffect(() => {
    const savedCustomer = sessionStorage.getItem('reservationCustomer')
    if (savedCustomer) {
      try {
        const parsedCustomer = JSON.parse(savedCustomer) as CustomerData

        setCustomer(parsedCustomer)
      } catch {
        // 保存データが壊れている場合は削除する
        sessionStorage.removeItem('reservationCustomer')
      }
    }
    console.log('顧客情報：', customer)
    setIsLoaded(true)
  }, [])
  /**
   * 予約確定ボタンを押したときの処理
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // formの通常送信によるページ再読み込みを防ぐ
    event.preventDefault()

    if (!customer) {
      setErrorMessage(
        '顧客情報が見つかりません。入力画面からやり直してください。',
      )
      return
    }

    const customerName = customer.customerName.trim()
    const customerPhone = customer.customerPhone.trim()
    const customerEmail = customer.customerEmail.trim()

    // 名前は必須
    if (!customerName) {
      setErrorMessage('お名前を入力してください。')
      return
    }

    // 電話番号かメールアドレスのどちらかは必須
    if (!customerPhone && !customerEmail) {
      setErrorMessage('電話番号またはメールアドレスを入力してください。')
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const result = await createReservation({
        staffId,
        menuId,
        date,
        time,
        customerName,
        customerPhone,
        customerEmail,
      })

      if (!result.success) {
        setIsConflict(true)
        setIsSubmitting(false)
        return
      }
      // 予約登録成功後に一時保存データを削除
      sessionStorage.removeItem('reservationCustomer')

      // 完了ページへ遷移
      router.push('/reservation/complete')
    } catch (error) {
      console.error('予約登録エラー:', error)

      setErrorMessage(
        error instanceof Error ? error.message : '予約の登録に失敗しました。',
      )

      setIsSubmitting(false)
    }
  }
  if (isConflict) {
    return <ReservationConflict />
  }
  return (
    <main className='pt-32'>
      <section className='mx-auto space-y-8 px-6 md:max-w-3xl'>
        <h1 className='text-center text-3xl font-semibold'>CONFIRM</h1>

        <div className='space-y-4 rounded-xl border p-6'>
          <p>Stylist : {staffName}</p>

          <p>Menu : {menuName}</p>

          <p>Price : ¥{menuPrice.toLocaleString()}</p>

          <p>Date :{new Date(date).toLocaleDateString()}</p>

          <p>Time :{time}</p>

          {errorMessage && <p className='text-[#ff0000]'>{errorMessage}</p>}
        </div>
        <div className='flex justify-center'>
          <form onSubmit={handleSubmit}>
            <ArrowButton
              type='submit'
              disabled={isSubmitting}
              children={
                isSubmitting ? '予約を登録しています...' : '予約を確定する'
              }
            />
          </form>
        </div>
      </section>
    </main>
  )
}
