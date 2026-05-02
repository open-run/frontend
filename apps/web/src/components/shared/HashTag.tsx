import { BrokenXIcon } from '@icons/x'
import { colors } from '@styles/colors'

export default function HashTag({ label, onCloseButtonClick }: { label: string; onCloseButtonClick: () => void }) {
  return (
    <div className='flex w-fit items-center gap-8 rounded-4 bg-black-darken px-8 py-4'>
      <span className='text-14 text-white'>{label}</span>
      <button className='active-press-duration active:scale-90' onClick={onCloseButtonClick}>
        <BrokenXIcon size={16} color={colors.white} />
      </button>
    </div>
  )
}
