import { CustomerProvider } from '@/components/features/reservation/CustomerContext'

export default function ReservationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CustomerProvider>{children}</CustomerProvider>
}
