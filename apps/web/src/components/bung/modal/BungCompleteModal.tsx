import Image from 'next/image'
import { useRef, useState } from 'react'
import { useModal } from '@contexts/ModalProvider'
import { BungMember } from '@type/bung'
import { BottomSheet, BottomSheetRef, Dimmed } from '@shared/Modal'
import OverlayScrollbar from '@shared/OverlayScrollbar'
import PrimaryButton from '@shared/PrimaryButton'
import { PlaceIcon } from '@icons/place'
import { FilledThumbIcon, OutlinedThumbIcon } from '@icons/thumb'
import { BrokenXIcon } from '@icons/x'
import useAppInsetSize from '@hooks/useAppInsetSize'
import { useSendMemberLike } from '@apis/v1/users/feedback/mutation'
import { MODAL_KEY } from '@constants/modal'
import { DEFAULT_PROFILE_IMAGE_URL } from '@constants/profile'
import { colors } from '@styles/colors'
import { sortBungMembersOwnerFirst } from './sortBungMembersOwnerFirst'

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
  const { closeModal } = useModal()
  const sheetRef = useRef<BottomSheetRef>(null)
  const scrollRef = useRef<HTMLElement>(null)
  const handleClose = () => sheetRef.current?.close()
  const { mutate: sendMemberLike, isPending } = useSendMemberLike()
  const buttonMarginBottom = useAppInsetSize('bottom', 40)

  const [checkedUserIdList, setCheckedUserIdList] = useState<string[]>([])
  const hasSelectedFeedback = checkedUserIdList.length > 0
  const memberListWithOwnerFirst = sortBungMembersOwnerFirst(memberList)

  const handleSaveButton = () => {
    sendMemberLike(
      { bungId, targetUserIds: checkedUserIdList },
      {
        onSuccess: () => {
          handleClose()
        },
      },
    )
  }

  return (
    <Dimmed onClick={handleClose}>
      <BottomSheet
        ref={sheetRef}
        onClose={() => closeModal(MODAL_KEY.BUNG_COMPLETE)}
        className='flex h-[93%] flex-col overflow-hidden'>
        <header className='relative flex h-60 w-full shrink-0 items-center justify-center px-16'>
          <button
            type='button'
            aria-label='피드백 모달 닫기'
            className='absolute right-16 translate-x-4 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/50'
            onClick={handleClose}>
            <BrokenXIcon size={24} color={colors.black.DEFAULT} />
          </button>
          <span className='text-16 font-bold'>벙 완료!</span>
        </header>

        <div className='relative min-h-0 flex-1'>
          <section ref={scrollRef} className='scrollbar-web-hidden h-full overflow-y-auto px-16'>
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

            <ul className='flex flex-col gap-16'>
              {memberListWithOwnerFirst.map((member) => (
                <li key={member.userId} className='flex items-center justify-between gap-8'>
                  <div className='flex items-center gap-16'>
                    <Image
                      className='rounded-8 bg-black-darken object-contain'
                      src={member.profileImageUrl || DEFAULT_PROFILE_IMAGE_URL}
                      alt={`${member.nickname}의 아바타`}
                      width={76}
                      height={76}
                    />
                    <div className='flex items-center gap-4'>
                      <span className='text-14 font-bold text-black-darken'>{member.nickname}</span>
                      {member.owner && <Image src='/images/icon_crown.png' alt='Crown Icon' width={16} height={16} />}
                    </div>
                  </div>

                  <button
                    type='button'
                    aria-label={`${member.nickname}에게 좋아요 남기기`}
                    aria-pressed={checkedUserIdList.includes(member.userId)}
                    className='shrink-0 rounded-8 p-8 active-press-duration active:scale-90 active:bg-gray/50'
                    onClick={() => {
                      setCheckedUserIdList((prev) =>
                        prev.includes(member.userId)
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

            <div className='mt-24' style={{ marginBottom: buttonMarginBottom }}>
              <PrimaryButton
                variant={hasSelectedFeedback ? 'primary' : 'neutral'}
                disabled={isPending}
                onClick={handleSaveButton}>
                {isPending ? '저장 중...' : hasSelectedFeedback ? '피드백 저장' : '피드백 없이 완료'}
              </PrimaryButton>
            </div>
          </section>
          <OverlayScrollbar scrollRef={scrollRef} />
        </div>
      </BottomSheet>
    </Dimmed>
  )
}
