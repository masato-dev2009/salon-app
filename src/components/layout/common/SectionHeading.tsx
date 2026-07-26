import { cn } from '@/lib/utils'

type Props = {
  englishTitle?: string
  title?: string
  description?: string
  className?: string
}
export function SectionHeading({
  englishTitle,
  title,
  description,
  className,
}: Props) {
  return (
    <div className='flex flex-col items-center'>
      <h2 className='text-muted-foreground font-cormorant text-sm tracking-[0.4em]'>
        {englishTitle}
      </h2>
      <h2 className={cn('mt-4 text-4xl tracking-widest', className)}>
        {title}
      </h2>
      <p className='text-muted-foreground mt-10 leading-9 whitespace-pre-line'>
        {description}
      </p>
    </div>
  )
}
