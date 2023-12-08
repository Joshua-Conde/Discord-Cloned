import clsx from '../../../rediscord-lib/clsx'

interface TabGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: string
}

export default function TabGroup({
  gap = '4',
  className,
  ...props
}: TabGroupProps) {
  return <div className={clsx(`flex gap-${gap}`, className)} {...props} />
}
