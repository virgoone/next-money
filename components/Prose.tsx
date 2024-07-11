import { cn } from '~/lib/utils'

export function Prose({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn(className, 'prose dark:prose-invert')}>{children}</div>
  )
}
