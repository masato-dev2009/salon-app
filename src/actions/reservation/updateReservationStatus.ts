'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { ReservationStatus } from '@/generated/prisma//enums'

type UpdateReservationStatusInput = {
  reservationId: string
  status: ReservationStatus
}

export async function updateReservationStatus(
  input: UpdateReservationStatusInput,
) {
  const { reservationId, status } = input

  await prisma.reservation.update({
    where: {
      id: reservationId,
    },
    data: {
      status,
    },
  })

  revalidatePath('/admin/reservations')
  revalidatePath(`/admin/reservations/${reservationId}`)
}
