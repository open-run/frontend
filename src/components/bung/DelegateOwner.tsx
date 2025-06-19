import { MODAL_KEY } from '@/constants/modal'
import { useModal } from '@/contexts/ModalProvider'
import clsx from 'clsx'
import Image from 'next/image'
import { useAppStore } from '@store/app'
import { BungMember } from '@type/bung'
import Input from '@shared/Input'
import ArrowLeftIcon from '@icons/ArrowLeftIcon'
import MagnifierIcon from '@icons/MagnifierIcon'
import useFushSearch from '@hooks/useFuseSearch'
import { colors } from '@styles/colors'
import ConfirmDelegateModal from './modal/ConfirmDelegateModal'
import { PageCategory } from './types'

export default function DelegateOwner({
  memberList,
  setPageCategory,
}: {
  memberList: BungMember[]
  setPageCategory: (category: PageCategory) => void
}) {
  const { isApp } = useAppStore()
  const { showModal } = useModal()
  const { search, setSearch, filteredList } = useFushSearch(memberList, 'nickname')

  return (
    <section className={clsx('h-full w-full bg-gray-lighten', isApp && 'pt-50')} onClick={(e) => e.stopPropagation()}>
      <header className='relative flex h-60 w-full items-center justify-center'>
        <button className='absolute left-16' onClick={() => setPageCategory('벙 상세')}>
          <ArrowLeftIcon size={24} color={colors.black.darken} />
        </button>
        <span className='text-black text-16 font-bold'>벙주 넘기기</span>
      </header>
      <section className='flex h-full w-full flex-col gap-16 px-16'>
        <div className='w-full rounded-8 bg-white p-16'>
          <h5 className='mb-4 text-center text-14 font-bold text-black-darken'>
            개설한 벙을 다른 멤버에게 양도할 수 있어요
          </h5>
          <ul className='space-y-2 px-16'>
            <li className='list-disc text-14 text-black-darken'>양도 요청은 벙 시작 1시간 전까지 가능합니다.</li>
            <li className='list-disc text-14 text-black-darken'>
              지정한 멤버가 30분 이내에 요청을 수락하면 완료됩니다.
            </li>
          </ul>
        </div>

        <Input
          className='pr-40'
          type='text'
          placeholder='닉네임을 검색하세요'
          value={search}
          setValue={setSearch}
          addon={
            <MagnifierIcon
              className='absolute bottom-1/2 right-16 translate-y-1/2'
              size={16}
              color={colors.black.darken}
            />
          }
        />

        <ul className='flex h-[calc(100%-230px)] flex-col gap-16 overflow-y-auto pb-40'>
          {filteredList.map((member) => (
            <li key={member.userId} className='flex items-center justify-between gap-8'>
              <div className='flex items-center gap-16'>
                <Image
                  className='rounded-8 bg-black-darken'
                  src='/temp/nft_detail_2.png'
                  alt={`${member.nickname}의 아바타`}
                  width={76}
                  height={76}
                />
                <span className='text-14 font-bold text-black-darken'>{member.nickname}</span>
              </div>
              <button
                className='rounded-12 bg-black-darken px-13 py-4 text-12 text-white'
                onClick={() =>
                  showModal({
                    key: MODAL_KEY.CONFIRM_DELEGATE,
                    component: <ConfirmDelegateModal member={member} onSuccess={() => setPageCategory('벙 상세')} />,
                  })
                }>
                벙주 넘기기
              </button>
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}
