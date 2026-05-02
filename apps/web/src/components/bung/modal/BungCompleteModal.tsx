import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { useModal } from '@contexts/ModalProvider'
import { BungMember } from '@type/bung'
import { BottomSheet, BottomSheetRef, Dimmed } from '@shared/Modal'
import { PlaceIcon } from '@icons/place'
import { FilledThumbIcon, OutlinedThumbIcon } from '@icons/thumb'
import { BrokenXIcon } from '@icons/x'
import { useSendMemberLike } from '@apis/v1/users/feedback/mutation'
import { MODAL_KEY } from '@constants/modal'
import { colors } from '@styles/colors'

export default function BungCompleteModal({
  bungId,
  imageUrl,
  title,
  location,
  memberList,
}: {
  bungId: string
  imageUrl: string
  title: string
  location: string
  memberList: BungMember[]
}) {
  const router = useRouter()
  const { closeModal } = useModal()
  const sheetRef = useRef<BottomSheetRef>(null)
  const handleClose = () => sheetRef.current?.close()
  const { mutate: sendMemberLike } = useSendMemberLike()

  const [checkedUserIdList, setCheckedUserIdList] = useState<string[]>([])

  const handleSaveButton = () => {
    if (checkedUserIdList.length === 0) {
      closeModal(MODAL_KEY.BUNG_COMPLETE)
      return
    }

    sendMemberLike(
      { bungId, targetUserIds: checkedUserIdList },
      {
        onSuccess: () => {
          /* 자기 자신에게 좋아요를 눌렀을 경우, 메인 페이지에서의 좋아요 갯수 업데이트 */
          router.refresh()
          closeModal(MODAL_KEY.BUNG_COMPLETE)
        },
      },
    )
  }

  return (
    <Dimmed onClick={handleClose}>
      <BottomSheet ref={sheetRef} onClose={() => closeModal(MODAL_KEY.BUNG_COMPLETE)} fullSize>
        <header className='relative mb-16 flex h-60 w-full items-center justify-center px-16'>
          <button
            className='absolute right-16 translate-x-4 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/50'
            onClick={handleClose}>
            <BrokenXIcon size={24} color={colors.black.DEFAULT} />
          </button>
          <span className='text-16 font-bold'>벙 완료!</span>
          <button
            className='absolute right-56 rounded-8 px-8 py-4 active-press-duration active:scale-90 active:bg-gray/50'
            onClick={handleSaveButton}>
            <span className='text-14 text-black-darken'>저장</span>
          </button>
        </header>

        <section className='h-[calc(100%-110px)] overflow-y-auto px-16'>
          <div className='mb-40 flex flex-col items-center gap-8 text-center'>
            <h1 className='text-20 font-bold'>
              함께 달렸던 멤버들에게
              <br />
              <FilledThumbIcon className='inline -translate-y-[2px]' size={24} color={colors.black.darken} /> 를
              남겨보세요
            </h1>
            <p className='text-14 text-black-darken'>좋아요를 남긴 멤버의 인기도가 올라갑니다</p>
          </div>

          <div className='mb-40 flex w-full items-center gap-16 rounded-8 p-16 shadow-floating-primary'>
            <Image
              className='aspect-[76/56] rounded-8 object-cover'
              src={imageUrl}
              alt='bung-image'
              width={76}
              height={56}
            />
            <div className='flex flex-col gap-4'>
              <p className='whitespace-wrap text-16 font-bold text-black-darken'>{title}</p>
              <div className='flex gap-4'>
                <PlaceIcon className='translate-y-2' size={16} color={colors.black.darken} />
                <span className='whitespace-wrap text-14 text-black-darken'>{location}</span>
              </div>
            </div>
          </div>

          <ul className='flex h-[calc(100%-230px)] flex-col gap-16 overflow-y-auto pb-40'>
            {memberList.map((member) => (
              <li key={member.userId} className='flex items-center justify-between gap-8'>
                <div className='flex items-center gap-16'>
                  <Image
                    className='rounded-8 bg-black-darken'
                    src='/temp/nft_detail_2.png'
                    alt={`${member.nickname}의 아바타`}
                    width={76}
                    height={76}
                  />
                  <div className='flex items-center gap-4'>
                    <span className='text-14 font-bold text-black-darken'>{member.nickname}</span>
                    {member.owner && <Image src='/images/icon_crown.png' alt='Crown Icon' width={16} height={18} />}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCheckedUserIdList((prev) =>
                      checkedUserIdList.includes(member.userId)
                        ? prev.filter((id) => id !== member.userId)
                        : [...prev, member.userId],
                    )
                  }}>
                  {checkedUserIdList.includes(member.userId) ? (
                    <FilledThumbIcon className='inline -translate-y-[2px]' size={24} color={colors.primary.DEFAULT} />
                  ) : (
                    <OutlinedThumbIcon className='inline -translate-y-[2px]' size={24} color={colors.gray.darken} />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </BottomSheet>
    </Dimmed>
  )
}
