import { Menu } from '@/generated/prisma/client'
import { cn } from '@/lib/utils'

type Props = {
  menuList: Menu[]
  selectedMenuId: string
  onSelectMenuId: (MenuId: string) => void
  onSelectMenu: (Menu: string) => void
}
export function MenuSelector({
  menuList,
  selectedMenuId,
  onSelectMenuId,
  onSelectMenu,
}: Props) {
  return (
    <section>
      <h2 className='text-xl font-medium'>Menu</h2>
      <div className='mt-6 grid gap-4 md:grid-cols-2'>
        {menuList.map((menu) => {
          const isSelected = selectedMenuId === menu.id
          return (
            <button
              key={menu.id}
              type='button'
              onClick={() => {
                onSelectMenuId(menu.id)
                onSelectMenu(menu.name)
              }}
              className={cn(
                'rounded-xl border p-4 text-left transition hover:border-black',
                isSelected && 'border-black bg-[#0000001e]',
              )}
            >
              <p className='font-medium'>{menu.name}</p>
              <p className='text-muted-foreground mt-2 text-sm'>
                ¥{menu.price.toLocaleString()}
              </p>
              <p className='text-muted-foreground mt-1 text-sm'>
                {menu.description}
                {menu.durationMin}分
              </p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
