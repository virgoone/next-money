import { cn } from '@/lib/utils'

export const ArticleIcon = (props: { className?: string }) => {
  const LordIcon = 'lord-icon' as any

  return (
    <LordIcon
      src="https://cdn.lordicon.com/lyrrgrsl.json"
      trigger="hover"
      className={cn('current-color', props.className)}
    ></LordIcon>
  )
}
