import { useRouter } from 'next/navigation'
import { useModal } from '@contexts/ModalProvider'
import { Dimmed, Popup } from '@shared/Modal'
import { useRefetchQuery } from '@hooks/useRefetchQuery'
import { useDeleteBung } from '@apis/v1/bungs/[bungId]/mutation'
import { queryKey } from '@apis/v1/bungs/my-bungs/query'
import { MODAL_KEY } from '@constants/modal'

export default function DeleteBungModal({ bungId }: { bungId: string }) {
  const router = useRouter()
  const { closeModal } = useModal()
  const 메인페이지벙리스트업데이트 = useRefetchQuery(queryKey)
  const { mutate: deleteBung } = useDeleteBung()

  const handleDeleteBung = () => {
    deleteBung(
      { bungId },
      {
        onSuccess: () => {
          메인페이지벙리스트업데이트()
          closeModal(MODAL_KEY.DELETE_BUNG)
          router.replace('/')
        },
      },
    )
  }

  return (
    <Dimmed onClick={() => closeModal(MODAL_KEY.DELETE_BUNG)}>
      <Popup>
        <div className='flex h-230 w-full flex-col items-center justify-between p-16'>
          <div className='mt-24 flex flex-col gap-8'>
            <h5 className='text-center text-20 font-bold text-black-darken'>벙 삭제하기</h5>
            <p className='text-center text-14 text-black-darken'>
              삭제한 벙은 복구할 수 없습니다. <br />
              벙을 삭제하시겠습니까?
            </p>
          </div>
          <div className='flex w-full gap-8'>
            <button
              className='active:scale-98 h-56 flex-1 rounded-8 bg-pink/20 text-16 font-bold text-pink active-press-duration active:bg-pink/30'
              onClick={handleDeleteBung}>
              삭제
            </button>
            <button
              className='active:scale-98 h-56 flex-1 rounded-8 bg-white text-16 font-bold text-black-darken active-press-duration active:bg-gray/50'
              onClick={() => closeModal(MODAL_KEY.DELETE_BUNG)}>
              취소
            </button>
          </div>
        </div>
      </Popup>
    </Dimmed>
  )
}
