# 美容室向けの予約システム
<img width="1440" height="900" alt="スクリーンショット 2026-07-27 0 06 47" src="https://github.com/user-attachments/assets/9a102031-b9f2-450f-a73f-b9ade7b7c211" />
---

実際の予約システムを参考に、スタッフ・メニュー・営業時間・施術時間を考慮した予約機能を実装しました。
---

## デモ

### URL

https://salon-app-dun-alpha.vercel.app/
---

## 使用技術

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma
- PostgreSQL (Neon)
- Vercel

---

## 主な機能

### 予約機能

- スタッフ選択
- メニュー選択
- 日付選択
- 時間選択
- 予約作成
- ダブルブッキング防止

### 管理機能

- スタッフ管理
- メニュー管理
- 営業時間管理
- スタッフ勤務時間管理
- 予約管理

---

## 工夫した点

### 営業時間と施術時間を考慮した予約ロジック

メニューごとの施術時間を考慮し、営業時間内に施術が終了する時間のみ予約可能となるよう実装しました。

予約できない時間帯も表示したままグレーアウトすることで、営業時間を分かりやすく表現しています。

---

### ダブルブッキング防止

既存予約との時間重複を判定し、同じスタッフに重複した予約が入らないようにしています。

判定条件

```text
既存予約開始 < 新規予約終了
AND
既存予約終了 > 新規予約開始
```

---

### 営業時間の優先順位

営業時間は以下の優先順位で取得します。

1. スタッフ勤務時間
2. 店舗営業時間
3. デフォルト営業時間

これによりスタッフごとの勤務時間にも対応しています。

---

## データベース設計

- User
- Staff
- Menu
- Reservation
- BusinessHour
- StaffSchedule

---

## 今後追加予定

- 顧客管理
- 売上管理
- メール通知
- LINE連携

---

## 学んだこと

- Prismaを用いたデータベース設計
- Server Actionsを利用したサーバーサイド処理
- 営業時間・施術時間を考慮した予約ロジック
- ダブルブッキング防止アルゴリズム

- 実務を意識した管理画面設計

---

## スクリーンショット
<img width="1440" height="900" alt="スクリーンショット 2026-07-27 0 06 56" src="https://github.com/user-attachments/assets/bf9b2586-4c93-4f38-a3ac-1c31708d1401" />
<img width="1440" height="900" alt="スクリーンショット 2026-07-27 0 07 01" src="https://github.com/user-attachments/assets/b723362f-bb62-41a3-8e42-094ac1c53395" />
<img width="1440" height="900" alt="スクリーンショット 2026-07-27 0 07 10" src="https://github.com/user-attachments/assets/100a8771-9c0f-46ab-8ad9-8cc60fbbc09a" />
<img width="1440" height="900" alt="スクリーンショット 2026-07-27 0 31 03" src="https://github.com/user-attachments/assets/b509be9e-e241-42e4-bc6c-872b2e3d61dc" />
<img width="1440" height="900" alt="スクリーンショット 2026-07-27 0 30 46" src="https://github.com/user-attachments/assets/d918e6c3-5445-45ee-a943-ddfba5fcfa52" />



