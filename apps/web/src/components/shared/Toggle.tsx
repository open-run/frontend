import clsx from 'clsx'

export default function Toggle({
  isOn,
  onToggle,
  disabled = false,
  className,
}: {
  isOn: boolean
  onToggle: (value: boolean) => void
  disabled?: boolean
  className?: string
}) {
  const handleToggle = () => {
    if (!disabled) {
      onToggle(!isOn)
    }
  }

  return (
    <button
      className={clsx(
        'relative inline-flex h-40 w-64 flex-shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out',
        isOn ? 'bg-primary' : 'bg-gray-darken',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className,
      )}
      type='button'
      disabled={disabled}
      onClick={handleToggle}>
      <span
        className={clsx(
          'inline-block h-32 w-32 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out',
          isOn ? 'translate-x-28' : 'translate-x-4',
        )}
      />
    </button>
  )
}
