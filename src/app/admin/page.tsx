import { redirect } from 'next/navigation'
import { auth } from '../../../auth'
import { prisma } from '@/lib/prisma'
import AdminReservationsPage from './reservations/page'

export default async function AdminPage() {
  // const session = await auth()
  // if (!session?.user?.email) {
  //   redirect('/')
  // }
  // const currentUser = await prisma.user.findUnique({
  //   where: {
  //     email: session.user.email,
  //   },
  //   select: {
  //     role: true,
  //   },
  // })

  // if (!currentUser || currentUser.role !== 'ADMIN') {
  //   redirect('/')
  // }

  return (
    <section>
      <h1 className='text-3xl font-bold'>Dashboard</h1>
      <p className='text-muted-foreground mt-2'>
        美容室予約管理システム 管理画面
      </p>
    </section>
  )
}
