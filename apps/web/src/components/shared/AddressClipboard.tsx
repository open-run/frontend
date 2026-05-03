import { ReactNode } from 'react'
import { useModal } from '@contexts/ModalProvider'
import { useUserStore } from '@store/user'
import ToastModal from '@shared/ToastModal'
import { MODAL_KEY } from '@constants/modal'

type Props = {
  children: (address: string) => ReactNode
}

export default function AddressClipboard({ children }: Props) {
  const { showModal } = useModal()
  // 표시용 주소는 백엔드 user 정보에서 읽는다.
  // (Reown wallet hook은 로그인/로그아웃 시점에만 사용 — 매 페이지 진입마다 wallet hydrate를 강제하지 않기 위함.)
  const blockchainAddress = useUserStore((state) => state.userInfo.blockchainAddress ?? '')

  const handleCopy = async () => {
    if (!blockchainAddress) return
    try {
      await navigator.clipboard.writeText(blockchainAddress)
      showModal({
        key: MODAL_KEY.TOAST,
        component: <ToastModal mode='success' message='주소가 복사되었습니다.' />,
      })
    } catch (error) {
      console.error('복사 실패:', error)
    }
  }

  return (
    <div onClick={handleCopy} style={{ cursor: 'pointer' }}>
      {children(formatAddress(blockchainAddress))}
    </div>
  )
}

// address를 앞 4글자, 뒤 4글자만 보여주고 가운데는 ***로 처리하는 함수
function formatAddress(address: string): string {
  if (!address) return ''
  if (address.length <= 8) return address
  return `${address.slice(0, 4)}***${address.slice(-4)}`
}
