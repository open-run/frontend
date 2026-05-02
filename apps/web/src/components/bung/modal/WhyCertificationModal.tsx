import { useModal } from '@contexts/ModalProvider'
import { Dimmed, Popup } from '@components/shared/Modal'
import { BrokenXIcon } from '@icons/x'
import { MODAL_KEY } from '@constants/modal'
import { colors } from '@styles/colors'

export default function WhyCertificationModal() {
  const { closeModal } = useModal()
  return (
    <Dimmed onClick={() => closeModal(MODAL_KEY.WHY_CERTIFICATION)}>
      <Popup>
        <div className='h-full w-full'>
          <header className='relative mb-16 flex h-60 w-full items-center justify-center'>
            <h3 className='text-16 font-bold text-black-darken'>참여 인증을 왜 해야 하나요?</h3>
            <button
              className='absolute right-16 translate-x-4 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/50'
              onClick={() => closeModal(MODAL_KEY.WHY_CERTIFICATION)}>
              <BrokenXIcon size={24} color={colors.black.DEFAULT} />
            </button>
          </header>
          <div className='px-24 pb-30 text-14'>
            <h4 className='mb-4 font-bold'>참여 인증이 뭔가요?</h4>
            <p className='mb-24'>
              모임 장소 도착 여부를 인증하는 절차입니다.
              <br />
              참여 인증을 통해 실제로 참여한 멤버를 확인하고, 러닝 이후 피드백을 남기거나 보상을 받을 수 있어요.
            </p>
            <h4 className='mb-4 font-bold'>언제 하면 되나요?</h4>
            <p>러닝 시작 전, 약속 장소에 모든 멤버가 모이면 참여 인증을 진행해 주세요.</p>
          </div>
        </div>
      </Popup>
    </Dimmed>
  )
}
