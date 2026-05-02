import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useModal } from '@contexts/ModalProvider'
import { BungMember } from '@type/bung'
import Checkbox from '@shared/Checkbox'
import { Dimmed, Popup } from '@shared/Modal'
import { useDropoutMember } from '@apis/v1/bungs/[bungId]/members/[userId]/mutation'
import { MODAL_KEY } from '@constants/modal'

export default function ConfirmDropoutModal({ member }: { member: BungMember }) {
  const router = useRouter()
  const { bungId } = useParams<{ bungId: string }>()

  const { closeModal, closeAllModals } = useModal()
  const [isChecked, setIsChecked] = useState(false)
  const { mutate: dropoutMember } = useDropoutMember()

  const handleDropout = () => {
    dropoutMember(
      { bungId, userId: member.userId },
      {
        onSuccess: () => {
          /* 벙 상세 페이지 서버 컴포넌트 API 호출 업데이트 */
          router.refresh()
          closeAllModals()
        },
      },
    )
  }

  return (
    <Dimmed onClick={() => closeModal(MODAL_KEY.CONFIRM_DROPOUT)}>
      <Popup>
        <div className='flex h-254 w-full flex-col items-center justify-between p-16'>
          <div className='mt-24 flex flex-col gap-8'>
            <div className='flex items-center gap-8 self-center'>
              <Image
                className='rounded-4 bg-black-darken'
                src='/temp/nft_detail_2.png'
                alt={`${member.nickname}의 아바타`}
                width={24}
                height={24}
              />
              <span className='text-16 font-bold text-black-darken'>{member.nickname}</span>
            </div>
            <h5 className='text-center text-20 font-bold text-black-darken'>멤버를 내보낼까요?</h5>
          </div>
          <div className='flex w-full flex-col items-center gap-18'>
            <Checkbox
              checked={isChecked}
              onChange={setIsChecked}
              text={<p className='text-14 font-bold text-black-darken'>이 멤버를 영구적으로 차단할게요</p>}
            />
            <div className='flex w-full gap-8'>
              <button
                className='h-56 flex-1 rounded-8 bg-pink/20 text-16 font-bold text-pink active-press-duration active:scale-90 active:bg-pink/30'
                onClick={handleDropout}>
                내보내기
              </button>
              <button
                className='h-56 flex-1 rounded-8 bg-white text-16 font-bold text-black-darken active-press-duration active:scale-90 active:bg-gray/50'
                onClick={() => closeModal(MODAL_KEY.CONFIRM_DROPOUT)}>
                취소
              </button>
            </div>
          </div>
        </div>
      </Popup>
    </Dimmed>
  )
}
