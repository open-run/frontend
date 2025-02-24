import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useModalContext } from '@contexts/ModalContext'
import { BungMember } from '@type/bung'
import { Popup } from '@shared/Modal'
import { useDelegateOwner } from '@apis/bungs/delegateOwner/mutation'

export default function ConfirmDelegateModal({ member, onSuccess }: { member: BungMember; onSuccess: () => void }) {
  const router = useRouter()
  const { bungId } = useParams<{ bungId: string }>()

  const { closeModal } = useModalContext()
  const { mutate: delegateOwner } = useDelegateOwner()

  const handleDelegate = () => {
    delegateOwner(
      { bungId, newOwnerUserId: member.userId },
      {
        onSuccess: () => {
          /* 벙 상세 페이지 서버 컴포넌트 API 호출 업데이트 */
          router.refresh()
          closeModal()
          onSuccess()
        },
      },
    )
  }

  return (
    <Popup>
      <div className='flex h-214 w-full flex-col items-center justify-between p-16'>
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
          <h5 className='text-center text-20 font-bold text-black-darken'>멤버에게 벙주 넘기기</h5>
        </div>
        <div className='flex w-full gap-8'>
          <button
            className={`h-56 flex-1 rounded-8 bg-black-darkest text-16 font-bold text-white`}
            onClick={handleDelegate}>
            확인
          </button>
          <button
            className='h-56 flex-1 rounded-8 bg-white text-16 font-bold text-black-darken'
            onClick={() => closeModal()}>
            취소
          </button>
        </div>
      </div>
    </Popup>
  )
}
