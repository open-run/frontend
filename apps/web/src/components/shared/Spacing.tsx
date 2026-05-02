export default function Spacing({
  size,
  direction = 'vertical',
}: {
  size: number
  direction?: 'vertical' | 'horizontal'
}) {
  return direction === 'vertical' ? <div style={{ height: size }} /> : <div style={{ width: size }} />
}
