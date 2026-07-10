import 'dotenv/config'
import { prisma } from '@/lib/prisma'

// async function main() {
//   const adminUser = await prisma.user.create({
//     data: {
//       name: '管理者ユーザー',
//       email: 'admin@example.com',
//       phone: '090-0000-0000',
//       role: Role.ADMIN,
//     },
//   })

//   const customerUser1 = await prisma.user.create({
//     data: {
//       name: '山田 花子',
//       email: 'customer1@example.com',
//       phone: '090-1111-1111',
//       role: Role.CUSTOMER,
//     },
//   })
//   const customerUser2 = await prisma.user.create({
//     data: {
//       name: '前田 太郎',
//       email: 'customer2@example.com',
//       phone: '090-2222-2222',
//       role: Role.CUSTOMER,
//     },
//   })

//   const staffUser1 = await prisma.user.create({
//     data: {
//       name: '佐藤 美咲',
//       email: 'sato@example.com',
//       phone: '090-2222-2222',
//       role: Role.STAFF,
//     },
//   })

//   const staffUser2 = await prisma.user.create({
//     data: {
//       name: '鈴木 健太',
//       email: 'suzuki@example.com',
//       phone: '090-3333-3333',
//       role: Role.STAFF,
//     },
//   })

//   const staffUser3 = await prisma.user.create({
//     data: {
//       name: '川口 達郎',
//       email: 'kawaguchi@example.com',
//       phone: '090-4444-4444',
//       role: Role.STAFF,
//     },
//   })

//   const staff1 = await prisma.staff.create({
//     data: {
//       userId: staffUser1.id,
//       displayName: '佐藤 美咲',
//       position: 'トップスタイリスト　代表',
//       bio: 'ショートカットと透明感カラーが得意です。',
//       imageUrl: '/image/staff/sato.png',
//     },
//   })

//   const staff2 = await prisma.staff.create({
//     data: {
//       userId: staffUser2.id,
//       displayName: '鈴木 健太',
//       position: 'シニアスタイリスト',
//       bio: 'メンズカットとパーマスタイルが得意です。',
//       imageUrl: '/image/staff/suzuki.png',
//     },
//   })

//   const staff3 = await prisma.staff.create({
//     data: {
//       userId: staffUser3.id,
//       displayName: '川口 達郎',
//       position: 'スタイリスト',
//       bio: 'ヘッドスパとトリートメンケアが得意です。',
//       imageUrl: '/image/staff/kawaguchi.png',
//     },
//   })

//   const cut = await prisma.menu.create({
//     data: {
//       name: 'カット',
//       englishName: 'Cut',
//       imageUrl: '/image/menu/cut.png',
//       description: '骨格や髪質に合わせた似合わせカットです。',
//       price: 4000,
//       durationMin: 60,
//     },
//   })

//   const color = await prisma.menu.create({
//     data: {
//       name: 'カラー',
//       englishName: 'Color',
//       imageUrl: '/image/menu/color.png',
//       description: '透明感のあるカラーから白髪染めまで対応します。',
//       price: 7000,
//       durationMin: 90,
//     },
//   })

//   await prisma.menu.createMany({
//     data: [
//       {
//         name: 'ヘッドスパ',
//         englishName: 'Head Spa',
//         imageUrl: '/image/menu/head-spa.png',
//         description:
//           '心地よいクレンジングで頭皮の汚れを取り除くケアメニューです。',
//         price: 3000,
//         durationMin: 30,
//       },
//       {
//         name: 'トリートメント',
//         englishName: 'Treatment',
//         imageUrl: '/image/menu/treatment.png',
//         description: '髪質改善を目的とした集中ケアメニューです。',
//         price: 5000,
//         durationMin: 60,
//       },
//       {
//         name: 'パーマ',
//         englishName: 'Perm',
//         imageUrl: '/image/menu/perm.png',
//         description: '自然な動きやボリュームを出すパーマメニューです。',
//         price: 8000,
//         durationMin: 120,
//       },
//     ],
//   })

//   await prisma.businessHour.createMany({
//     data: [
//       { dayOfWeek: 0, openTime: '10:00', closeTime: '20:00', isClosed: true },
//       { dayOfWeek: 1, openTime: '10:00', closeTime: '20:00' },
//       { dayOfWeek: 2, openTime: '10:00', closeTime: '20:00' },
//       { dayOfWeek: 3, openTime: '10:00', closeTime: '20:00' },
//       { dayOfWeek: 4, openTime: '10:00', closeTime: '20:00' },
//       { dayOfWeek: 5, openTime: '10:00', closeTime: '20:00' },
//       { dayOfWeek: 6, openTime: '10:00', closeTime: '20:00' },
//     ],
//   })

//   const tomorrow = new Date()
//   tomorrow.setDate(tomorrow.getDate() + 1)
//   tomorrow.setHours(10, 0, 0, 0)

//   const reservationEnd = new Date(tomorrow)
//   reservationEnd.setMinutes(reservationEnd.getMinutes() + cut.durationMin)

//   await prisma.reservation.create({
//     data: {
//       customerId: customerUser1.id,
//       staffId: staff1.id,
//       menuId: color.id,
//       startTime: tomorrow,
//       endTime: reservationEnd,
//       status: ReservationStatus.CONFIRMED,
//       note: '明るすぎないブラウン系で相談したいです。',
//     },
//   })

//   const anotherStart = new Date()
//   anotherStart.setDate(anotherStart.getDate() + 2)
//   anotherStart.setHours(13, 0, 0, 0)
//   const anotherEnd = new Date(anotherStart)
//   anotherEnd.setMinutes(anotherEnd.getMinutes() + color.durationMin)

//   await prisma.reservation.create({
//     data: {
//       customerId: customerUser2.id,
//       staffId: staff2.id,
//       menuId: cut.id,
//       startTime: tomorrow,
//       endTime: reservationEnd,
//       status: ReservationStatus.CONFIRMED,
//       note: '前髪は短めにしたいです。',
//     },
//   })

//   console.log('Seed data created.')
// }
async function main() {
  await prisma.businessHour.upsert({
    where: {
      dayOfWeek: 2,
    },
    update: {
      openTime: null,
      closeTime: null,
      isClosed: true,
    },
    create: {
      dayOfWeek: 2,
      openTime: null,
      closeTime: null,
      isClosed: true,
    },
  })

  /**
   * 店舗全体の臨時休業日を登録する
   *
   * ※ ClosedDay は「毎週の定休日」ではなく、
   * 年末年始・夏季休業・臨時休業など、
   * 特定の日付だけを管理する。
   */
  await prisma.closedDay.createMany({
    data: [
      {
        date: new Date(2026, 7, 13), // 2026/08/13
        reason: '夏季休業',
      },
      {
        date: new Date(2026, 11, 31), // 2026/12/31
        reason: '年末休業',
      },
      {
        date: new Date(2027, 0, 1), // 2027/01/01
        reason: '元日休業',
      },
    ],
    skipDuplicates: true,
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
