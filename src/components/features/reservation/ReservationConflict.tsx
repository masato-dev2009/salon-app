// src/components/features/reservation/ReservationConflict.tsx

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { container } from '@/components/layout/common/container'

/**
 * 予約内容が最新の空き状況と競合した場合に表示するコンポーネント。
 *
 * 確認画面へ進む直前に別の予約が入った場合など、
 * ユーザーへ理由を伝えたうえで予約入力画面へ戻して、
 * 時間を選び直してもらう。
 */
export function ReservationConflict({
  title = 'この時間は予約できなくなりました',
  message = '他のお客様が先に予約されたため、選択した時間では予約できません。時間を選び直してください。',
  backUrl = '/reservation/new',
}) {
  return (
    <main className={cn(container, 'py-16')}>
      <section
        className='mx-auto max-w-xl rounded-2xl border p-6 text-center shadow-sm md:p-10'
        aria-labelledby='reservation-conflict-title'
      >
        <div className='bg-muted mx-auto flex size-14 items-center justify-center rounded-full'>
          <AlertTriangle
            className='text-destructive size-7'
            aria-hidden='true'
          />
        </div>

        <h1
          id='reservation-conflict-title'
          className='mt-6 text-2xl font-semibold tracking-wide'
        >
          {title}
        </h1>

        <p className='text-muted-foreground mt-4 text-sm leading-7'>
          {message}
        </p>

        <div className='mt-8'>
          <Link
            href={backUrl}
            className={cn(
              'inline-flex min-h-11 items-center justify-center rounded-md px-6',
              'bg-primary text-primary-foreground text-sm font-medium',
              'transition-opacity hover:opacity-90',
              'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            )}
          >
            時間を選び直す
          </Link>
        </div>
      </section>
    </main>
  )
}
