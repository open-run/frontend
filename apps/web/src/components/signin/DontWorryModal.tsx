import { useRef } from 'react'
import { colors } from '@/styles/colors'
import { useModal } from '@contexts/ModalProvider'
import { BottomSheet, BottomSheetRef, Dimmed } from '@shared/Modal'
import { BrokenXIcon } from '@icons/x'
import { MODAL_KEY } from '@constants/modal'

export default function DontWorryModal() {
  const { closeModal } = useModal()
  const sheetRef = useRef<BottomSheetRef>(null)
  const handleClose = () => sheetRef.current?.close()
  return (
    <Dimmed onClick={handleClose}>
      <BottomSheet ref={sheetRef} onClose={() => closeModal(MODAL_KEY.DONT_WORRY)}>
        <header className='flex h-60 w-full items-center justify-center'>
          <button
            className='absolute right-14 rounded-8 p-2 active-press-duration active:scale-90 active:bg-gray/50'
            onClick={handleClose}>
            <BrokenXIcon size={24} color={colors.black.DEFAULT} />
          </button>
          <span className='text-16 font-bold'>월렛 로그인, 안심하고 진행하세요!</span>
        </header>
        <section className='flex flex-col gap-24 px-24 pb-80 pt-16'>
          <div className='flex flex-col gap-4'>
            <p className='text-14 font-bold text-black-darken'>Q. 오픈런이 제 개인 정보를 수집하나요?</p>
            <div className='flex flex-col text-14 text-black-darken'>
              <p className='font-bold text-primary'>A. 개인 정보를 수집하지 않습니다.</p>
              <p>
                오픈런은 월렛 주소만으로 로그인 인증을 진행하며, 이름·이메일 등 어떠한 개인 정보도 수집하지 않습니다.
              </p>
              <p>여러분의 정보는 월렛에 안전하게 보관되며, 오픈런 서버에는 저장되지 않습니다.</p>
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <p className='text-14 font-bold text-black-darken'>Q. 로그인 시 금융 거래가 발생하나요?</p>
            <div className='flex flex-col text-14 text-black-darken'>
              <p className='font-bold text-primary'>A. 금융 거래가 발생하지 않습니다.</p>
              <p>
                로그인 과정에서 이루어지는 &quot;서명(Sign)&quot;은 사용자 인증을 위한 디지털 서명일 뿐, 코인 전송이나
                결제 등의 블록체인 거래는 일어나지 않습니다.
              </p>
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <p className='text-14 font-bold text-black-darken'>Q. 왜 서명이 필요한가요?</p>
            <div className='flex flex-col text-14 text-black-darken'>
              <p className='font-bold text-primary'>
                A. 서명은 &apos;지갑이 내 것이라는 것&apos;을 확인하는 과정입니다.
              </p>
              <p>비밀번호 입력 대신 서명을 통해 더 안전하고 간편하게 본인 인증을 할 수 있습니다.</p>
            </div>
          </div>
        </section>
      </BottomSheet>
    </Dimmed>
  )
}
