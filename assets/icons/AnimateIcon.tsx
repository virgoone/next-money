import { cn } from '~/lib/utils'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lord-icon': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string
        trigger?: 'hover' | 'click' | 'focus'
      }
    }
  }
}
export const ArticleIcon = (props: { className?: string }) => {
  return (
    <lord-icon
      src="https://cdn.lordicon.com/lyrrgrsl.json"
      trigger="hover"
      className={cn('current-color', props.className)}
    ></lord-icon>
  )
}
