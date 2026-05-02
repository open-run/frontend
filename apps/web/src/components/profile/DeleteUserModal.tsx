import { useRouter } from 'next/navigation'
import { useModal } from '@contexts/ModalProvider'
import { Dimmed, Popup } from '@shared/Modal'
import { useDeleteUser } from '@apis/v1/users/mutation'
import { MODAL_KEY } from '@constants/modal'

export default function DeleteUserModal() {
  const router = useRouter()
  const { closeModal, closeAllModals } = useModal()
  const { mutate: deleteUser } = useDeleteUser()

  const handleDeleteUser = () => {
    deleteUser(undefined, {
      onSuccess: () => {
        closeAllModals()
        router.replace('/signin')
      },
    })
  }

  return (
    <Dimmed onClick={() => closeModal(MODAL_KEY.DELETE_USER)}>
      <Popup>
        <div className='flex h-230 w-full flex-col items-center justify-between p-16'>
          <div className='mt-24 flex flex-col gap-8'>
            <h5 className='text-center text-20 font-bold text-black-darken'>계정 탈퇴</h5>
            <p className='text-center text-14 text-black-darken'>
              탈퇴된 계정은 복구할 수 없습니다. <br />
              계정을 탈퇴하시겠습니까?
            </p>
          </div>
          <div className='flex w-full gap-8'>
            <button
              className='h-56 flex-1 rounded-8 bg-pink/20 text-16 font-bold text-pink active-press-duration active:scale-90 active:bg-pink/30'
              onClick={handleDeleteUser}>
              탈퇴
            </button>
            <button
              className='h-56 flex-1 rounded-8 bg-white text-16 font-bold text-black-darken active-press-duration active:scale-90 active:bg-gray/30'
              onClick={() => closeModal(MODAL_KEY.DELETE_USER)}>
              취소
            </button>
          </div>
        </div>
      </Popup>
    </Dimmed>
  )
}
