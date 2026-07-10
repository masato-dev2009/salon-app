import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function AdminReservationDetailPage({ params }: Props) {
  const { id } = await params

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      menu: true,
      staff: true,
    },
  })

  if (!reservation) {
    notFound()
  }

  return (
    <section className='space-y-6'>
      <header>
        <h1 className='text-3xl font-bold'>予約詳細</h1>
        <p className='text-muted-foreground mt-2'>
          予約内容の確認・管理を行います。
        </p>
      </header>

      <div className='rounded-lg border p-6'>
        <dl className='grid gap-4'>
          <div>
            <dt className='text-muted-foreground text-sm'>予約者名</dt>
            <dd className='font-medium'>
              {reservation.customerName ?? '未入力'}
            </dd>
          </div>

          <div>
            <dt className='text-muted-foreground text-sm'>メール</dt>
            <dd>{reservation.customerEmail ?? '未入力'}</dd>
          </div>

          <div>
            <dt className='text-muted-foreground text-sm'>電話番号</dt>
            <dd>{reservation.customerPhone ?? '未入力'}</dd>
          </div>

          <div>
            <dt className='text-muted-foreground text-sm'>メニュー</dt>
            <dd>{reservation.menu.name}</dd>
          </div>

          <div>
            <dt className='text-muted-foreground text-sm'>担当スタッフ</dt>
            <dd>{reservation.staff.displayName}</dd>
          </div>

          <div>
            <dt className='text-muted-foreground text-sm'>予約日時</dt>
            <dd>{reservation.startTime.toLocaleString('ja-JP')}</dd>
          </div>

          <div>
            <dt className='text-muted-foreground text-sm'>ステータス</dt>
            <dd>{reservation.status}</dd>
          </div>

          <div>
            <dt className='text-muted-foreground text-sm'>要望・メモ</dt>
            <dd>{reservation.note ?? 'なし'}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
