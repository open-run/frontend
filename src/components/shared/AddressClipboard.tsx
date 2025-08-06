import { ReactNode, useEffect, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useAccount } from 'wagmi'
import { useModal } from '@contexts/ModalProvider'
import { useAppStore } from '@store/app'
import { postMessageToRN } from '@shared/AppBridge'
import ToastModal from '@shared/ToastModal'
import { useMessageHandler } from '@hooks/useMessageHandler'
import { MESSAGE } from '@constants/app'
import { MODAL_KEY } from '@constants/modal'

type Props = {
  children: (address: string) => ReactNode
}

export default function AddressClipboard({ children }: Props) {
  const { isApp } = useAppStore()

  return isApp ? (
    <AddressClipboardApp>{children}</AddressClipboardApp>
  ) : (
    <AddressClipboardBrowser>{children}</AddressClipboardBrowser>
  )
}

function AddressClipboardApp({ children }: Props) {
  const [address, setAddress] = useState('')

  useMessageHandler(({ type, data }) => {
    switch (type) {
      case MESSAGE.RESPONSE_SMART_WALLET_CONNECT:
        setAddress(data as string)
        break
    }
  })

  useEffect(() => {
    if (address) return
    postMessageToRN({ type: MESSAGE.REQUEST_SMART_WALLET_CONNECT })
  }, [address])

  return <CommonComponent address={address}>{children}</CommonComponent>
}

function AddressClipboardBrowser({ children }: Props) {
  const { address } = useAccount()
  return <CommonComponent address={address ?? ''}>{children}</CommonComponent>
}

function CommonComponent({ address, children }: { address: string; children: (address: string) => ReactNode }) {
  const { showModal } = useModal()

  return (
    <CopyToClipboard
      text={address}
      onCopy={() =>
        showModal({
          key: MODAL_KEY.TOAST,
          component: <ToastModal mode='success' message='주소가 복사되었습니다.' />,
        })
      }>
      {children(formatAddress(address))}
    </CopyToClipboard>
  )
}

// address를 앞 4글자, 뒤 4글자만 보여주고 가운데는 ***로 처리하는 함수
function formatAddress(address: string): string {
  if (!address) return ''
  if (address.length <= 8) return address
  return `${address.slice(0, 4)}***${address.slice(-4)}`
}
