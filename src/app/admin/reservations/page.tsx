import { prisma } from '@/lib/prisma'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function AdminReservationsPage() {
  const reservations = await prisma.reservation.findMany({
    orderBy: {
      startTime: 'desc',
    },
    include: {
      menu: {
        select: {
          name: true,
          price: true,
          durationMin: true,
        },
      },
      staff: {
        select: {
          displayName: true,
        },
      },
    },
  })
  function getStatusBadgeVariant(status: string) {
    switch (status) {
      case 'PENDING':
        return 'secondary'
      case 'CONFIRMED':
        return 'default'
      case 'CANCELLED':
        return 'destructive'
      default:
        return 'outline'
    }
  }
  function getStatusLabel(status: string) {
    switch (status) {
      case 'PENDING':
        return '未確定'
      case 'CONFIRMED':
        return '確定'
      case 'CANCELLED':
        return 'キャンセル'
      default:
        return status
    }
  }

  return (
    <section>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>予約一覧</h1>
        <p className='text-muted-foreground mt-2'>
          予約状況を確認・管理できます。
        </p>
      </div>

      <div className='rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>予約者</TableHead>
              <TableHead>メニュー</TableHead>
              <TableHead>担当</TableHead>
              <TableHead>予約日時</TableHead>
              <TableHead className='text-center'>ステータス</TableHead>
              <TableHead className='text-center'>操作</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>
                  <div>
                    <p className='font-medium'>
                      {reservation.customerName ?? '名前未入力'}
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      {reservation.customerEmail ?? 'メール未入力'}
                    </p>
                  </div>
                </TableCell>

                <TableCell>{reservation.menu.name}</TableCell>

                <TableCell>{reservation.staff.displayName}</TableCell>

                <TableCell>
                  {reservation.startTime.toLocaleString('ja-JP')}
                </TableCell>

                <TableCell className='text-center'>
                  <Badge variant={getStatusBadgeVariant(reservation.status)}>
                    {getStatusLabel(reservation.status)}
                  </Badge>
                </TableCell>
                <TableCell className='text-center'>
                  <Button asChild size='sm' variant='outline'>
                    <Link href={`/admin/reservations/${reservation.id}`}>
                      詳細
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
