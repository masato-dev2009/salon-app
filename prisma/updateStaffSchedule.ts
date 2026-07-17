import 'dotenv/config'
import { prisma } from '@/lib/prisma'

/**
 * スタッフごとの毎週の休日を登録するスクリプト
 *
 * StaffScheduleでは次の情報を管理する。
 * ・どのスタッフか
 * ・何曜日か
 * ・その曜日が休日か
 *
 * dayOfWeek:
 * 0 = 日曜日
 * 1 = 月曜日
 * 2 = 火曜日
 * 3 = 水曜日
 * 4 = 木曜日
 * 5 = 金曜日
 * 6 = 土曜日
 */
async function main() {
  // 毎週水曜日を休日にするスタッフを取得
  const wednesdayHolidayStaff = await prisma.staff.findFirst({
    where: {
      displayName: '鈴木 健太',
    },
  })

  if (!wednesdayHolidayStaff) {
    throw new Error('水曜日休みを設定するスタッフが見つかりません')
  }

  // 毎週木曜日を休日にするスタッフを取得
  const thursdayHolidayStaff = await prisma.staff.findFirst({
    where: {
      displayName: '川口 達郎',
    },
  })

  if (!thursdayHolidayStaff) {
    throw new Error('金曜日休みを設定するスタッフが見つかりません')
  }

  /**
   * 水曜日の休日設定
   *
   * すでに同じスタッフ・曜日の設定があれば更新し、
   * 存在しなければ新しく作成する。
   */

  await prisma.staffSchedule.upsert({
    where: {
      staffId_dayOfWeek: {
        staffId: wednesdayHolidayStaff.id,
        dayOfWeek: 3,
      },
    },
    update: {
      startTime: null,
      endTime: null,
      isHoliday: true,
    },
    create: {
      staffId: wednesdayHolidayStaff.id,
      dayOfWeek: 3,
      startTime: null,
      endTime: null,
      isHoliday: true,
    },
  })
  /**
   * 木曜日の休日設定
   */
  await prisma.staffSchedule.upsert({
    where: {
      staffId_dayOfWeek: {
        staffId: thursdayHolidayStaff.id,
        dayOfWeek: 4,
      },
    },
    update: {
      startTime: null,
      endTime: null,
      isHoliday: true,
    },
    create: {
      staffId: thursdayHolidayStaff.id,
      dayOfWeek: 4,
      startTime: null,
      endTime: null,
      isHoliday: true,
    },
  })

  console.log('スタッフ休日の登録が完了しました')
}

main()
  .catch((error) => {
    console.error('StaffScheduleの登録中にエラーが発生しました')
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    // スクリプト終了時にDB接続を切断する
    await prisma.$disconnect()
  })
