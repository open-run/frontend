'use client'

import clsx from 'clsx'
import Image from 'next/image'
import QRCode from 'qrcode'
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FaApple, FaDiscord, FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { FiCopy } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { SiWalletconnect } from 'react-icons/si'
import {
  AccountController,
  ApiController,
  AssetUtil,
  ChainController,
  ConnectionController,
  ConnectorController,
  StorageUtil,
  type BadgeType,
  type Connector,
  type WcWallet,
} from '@reown/appkit-controllers'
import { useModal } from '@contexts/ModalProvider'
import { BottomSheet, BottomSheetRef, Dimmed } from '@shared/Modal'
import { ArrowLeftIcon } from '@icons/arrow'
import { BrokenXIcon } from '@icons/x'
import { MagnifierIcon } from '@icons/magnifier'
import { MODAL_KEY } from '@constants/modal'
import {
  WALLET_ID_BINANCE_WALLET,
  WALLET_ID_COINBASE_WALLET,
  WALLET_ID_METAMASK,
  WALLET_ID_TRUST_WALLET,
} from '@constants/wallet'
import { colors } from '@styles/colors'
import {
  buildReownSocialRedirectUri,
  storePendingReownSocialProvider,
  type ReownSocialProvider,
} from '@utils/reownSocialRedirect'

type SheetView = 'connect' | 'allWallets' | 'walletConnect' | 'externalWallet' | 'socialWallet'
type SocialProvider = ReownSocialProvider
type FeaturedWalletActionId = 'metamask' | 'trust' | 'binance' | 'coinbase'
type ConnectActionId = SocialProvider | FeaturedWalletActionId | 'directoryWallet' | 'walletConnect'
type WalletBadge = Extract<BadgeType, 'certified'> | undefined
type WalletConnectSheetState = {
  wcUri?: string
  wcError?: boolean
  status?: 'connecting' | 'connected' | 'disconnected'
}

type SocialLoginOption = {
  id: SocialProvider
  label: string
  icon: ReactNode
  iconBackground?: string
  iconClassName?: string
}

type FeaturedWalletOption = {
  id: FeaturedWalletActionId
  label: string
  walletId: string
}

type ExternalWalletConnection = {
  wallet: WcWallet
  connector: Connector
  returnView: SheetView
}

type SocialConnectionState = {
  provider: SocialProvider
  popupBlocked: boolean
  errorMessage: string | null
}

type SocialAuthConnector = Connector & {
  provider?: {
    getSocialRedirectUri?: (params: { provider: SocialProvider }) => Promise<{ uri?: string }>
  }
}

type FeaturedWalletMap = Partial<Record<string, WcWallet>>
type WalletImageMap = Partial<Record<string, string>>
type FeaturedWalletMetadataState = {
  wallets: FeaturedWalletMap
  hasError: boolean
  retry: () => void
}

type WalletLoginBottomSheetProps = {
  onConnectStart: () => void
  onConnectError: () => void
  onConnectSuccess: () => void
  onCancel: () => void
}

const CONNECT_SHEET_HEIGHT = 'min(680px, calc(100dvh - 24px))'
const SEARCH_SHEET_HEIGHT = 'min(720px, calc(100dvh - 24px))'
const WALLET_CONNECT_SHEET_HEIGHT = 'min(620px, calc(100dvh - 24px))'
const EXTERNAL_WALLET_SHEET_HEIGHT = 'min(520px, calc(100dvh - 24px))'
const SOCIAL_WALLET_SHEET_HEIGHT = 'min(520px, calc(100dvh - 24px))'
const INITIAL_WALLET_SKELETON_COUNT = 12
const LOAD_MORE_WALLET_SKELETON_COUNT = 6
const QR_CODE_MARGIN_MODULES = 8
const QR_SKELETON_QUIET_ZONE_INSET = '7%'
const SOCIAL_LOGIN_ORIGIN = 'https://secure.walletconnect.org'
const SOCIAL_LOGIN_LOADING_URL = `${SOCIAL_LOGIN_ORIGIN}/loading`
const SOCIAL_LOGIN_POPUP_FEATURES = 'width=600,height=800,scrollbars=yes'
const SOCIAL_LOGIN_TIMEOUT_MS = 45_000

const SOCIAL_OPTIONS: SocialLoginOption[] = [
  {
    id: 'google',
    label: 'google',
    icon: <FcGoogle size={26} />,
    iconBackground: 'bg-white',
    iconClassName: 'ring-1 ring-gray/80',
  },
  {
    id: 'x',
    label: 'X',
    icon: <FaXTwitter size={24} />,
    iconBackground: 'bg-black-darkest text-white',
  },
  {
    id: 'discord',
    label: 'Discord',
    icon: <FaDiscord size={25} />,
    iconBackground: 'bg-[#5865F2] text-white',
  },
  {
    id: 'apple',
    label: 'Apple',
    icon: <FaApple size={25} />,
    iconBackground: 'bg-black-darkest text-white',
  },
  {
    id: 'github',
    label: 'GitHub',
    icon: <FaGithub size={24} />,
    iconBackground: 'bg-black-darken text-white',
  },
]

const FEATURED_WALLET_OPTIONS: FeaturedWalletOption[] = [
  {
    id: 'metamask',
    label: 'MetaMask',
    walletId: WALLET_ID_METAMASK,
  },
  {
    id: 'trust',
    label: 'Trust Wallet',
    walletId: WALLET_ID_TRUST_WALLET,
  },
  {
    id: 'binance',
    label: 'Binance Wallet',
    walletId: WALLET_ID_BINANCE_WALLET,
  },
  {
    id: 'coinbase',
    label: 'Coinbase Wallet',
    walletId: WALLET_ID_COINBASE_WALLET,
  },
]

export default function WalletLoginBottomSheet({
  onConnectStart,
  onConnectError,
  onConnectSuccess,
  onCancel,
}: WalletLoginBottomSheetProps) {
  const { closeModal } = useModal()
  const featuredWalletMetadata = useReownFeaturedWallets(FEATURED_WALLET_OPTIONS)
  const featuredWallets = featuredWalletMetadata.wallets
  const walletImages = useMemo(() => getWalletImagesFromMap(featuredWallets), [featuredWallets])
  const sheetRef = useRef<BottomSheetRef>(null)
  const shouldCancelOnCloseRef = useRef(true)
  const connectionSettledRef = useRef(false)
  const walletConnectRequestIdRef = useRef(0)
  const externalWalletRequestIdRef = useRef(0)
  const socialRequestIdRef = useRef(0)
  const socialPopupRef = useRef<Window | null>(null)
  const socialMessageHandlerRef = useRef<((event: MessageEvent) => void) | null>(null)
  const socialTimeoutRef = useRef<number | null>(null)
  const [view, setView] = useState<SheetView>('connect')
  const [walletConnectReturnView, setWalletConnectReturnView] = useState<SheetView>('connect')
  const [walletConnectWallet, setWalletConnectWallet] = useState<WcWallet | null>(null)
  const [externalWalletConnection, setExternalWalletConnection] = useState<ExternalWalletConnection | null>(null)
  const [socialConnection, setSocialConnection] = useState<SocialConnectionState | null>(null)
  const [selectedAction, setSelectedAction] = useState<ConnectActionId | null>(null)
  const [selectedDirectoryWalletId, setSelectedDirectoryWalletId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [copyMessage, setCopyMessage] = useState<string | null>(null)
  const walletConnectState = useWalletConnectState(view === 'walletConnect')
  const sheetHeight =
    view === 'allWallets'
      ? SEARCH_SHEET_HEIGHT
      : view === 'walletConnect'
        ? WALLET_CONNECT_SHEET_HEIGHT
        : view === 'externalWallet'
          ? EXTERNAL_WALLET_SHEET_HEIGHT
          : view === 'socialWallet'
            ? SOCIAL_WALLET_SHEET_HEIGHT
            : CONNECT_SHEET_HEIGHT

  const closeSheet = useCallback((shouldCancel: boolean) => {
    shouldCancelOnCloseRef.current = shouldCancel
    sheetRef.current?.close()
  }, [])

  const resetWalletConnectFlow = useCallback(
    (shouldNotify: boolean) => {
      walletConnectRequestIdRef.current += 1
      ConnectionController.resetUri()
      ConnectionController.setWcError(false)
      ConnectionController.setWcLinking(undefined)
      ConnectionController.setRecentWallet(undefined)
      setSelectedAction(null)
      setSelectedDirectoryWalletId(null)
      setWalletConnectWallet(null)
      setCopyMessage(null)
      connectionSettledRef.current = false

      if (shouldNotify) {
        onConnectError()
      }
    },
    [onConnectError],
  )

  const resetExternalWalletFlow = useCallback(
    (shouldNotify: boolean) => {
      externalWalletRequestIdRef.current += 1
      setSelectedAction(null)
      setSelectedDirectoryWalletId(null)
      setExternalWalletConnection(null)
      connectionSettledRef.current = false

      if (shouldNotify) {
        onConnectError()
      }
    },
    [onConnectError],
  )

  const clearSocialLoginSideEffects = useCallback((shouldClosePopup: boolean) => {
    if (socialTimeoutRef.current != null) {
      window.clearTimeout(socialTimeoutRef.current)
      socialTimeoutRef.current = null
    }

    if (socialMessageHandlerRef.current != null) {
      window.removeEventListener('message', socialMessageHandlerRef.current, false)
      socialMessageHandlerRef.current = null
    }

    if (shouldClosePopup && socialPopupRef.current != null) {
      try {
        socialPopupRef.current.close()
      } catch {
        // Cross-origin popup handles can reject close attempts; the flow also times out safely.
      }
    }

    socialPopupRef.current = null
    AccountController.setSocialWindow(undefined, ChainController.state.activeChain)
  }, [])

  const resetSocialLoginFlow = useCallback(
    (shouldNotify: boolean) => {
      socialRequestIdRef.current += 1
      clearSocialLoginSideEffects(true)
      setSelectedAction(null)
      setSelectedDirectoryWalletId(null)
      setSocialConnection(null)
      connectionSettledRef.current = false

      if (shouldNotify) {
        onConnectError()
      }
    },
    [clearSocialLoginSideEffects, onConnectError],
  )

  const handleBackClick = useCallback(() => {
    setErrorMessage(null)

    if (view === 'walletConnect') {
      resetWalletConnectFlow(true)
      setView(walletConnectReturnView === 'walletConnect' ? 'connect' : walletConnectReturnView)
      return
    }

    if (view === 'externalWallet') {
      const returnView = externalWalletConnection?.returnView ?? 'connect'
      resetExternalWalletFlow(true)
      setView(returnView === 'externalWallet' ? 'connect' : returnView)
      return
    }

    if (view === 'socialWallet') {
      resetSocialLoginFlow(true)
      setView('connect')
      return
    }

    setView('connect')
  }, [
    externalWalletConnection?.returnView,
    resetExternalWalletFlow,
    resetSocialLoginFlow,
    resetWalletConnectFlow,
    view,
    walletConnectReturnView,
  ])

  const handleRequestClose = useCallback(() => {
    closeSheet(true)
  }, [closeSheet])

  const handleClosed = useCallback(() => {
    if (shouldCancelOnCloseRef.current && view === 'walletConnect') {
      resetWalletConnectFlow(false)
    }

    if (shouldCancelOnCloseRef.current && view === 'externalWallet') {
      resetExternalWalletFlow(false)
    }

    if (shouldCancelOnCloseRef.current && view === 'socialWallet') {
      resetSocialLoginFlow(false)
    }

    closeModal(MODAL_KEY.WALLET_LOGIN)

    if (shouldCancelOnCloseRef.current) {
      onCancel()
    }
  }, [closeModal, onCancel, resetExternalWalletFlow, resetSocialLoginFlow, resetWalletConnectFlow, view])

  useEffect(() => {
    return () => clearSocialLoginSideEffects(true)
  }, [clearSocialLoginSideEffects])

  const startSocialLogin = useCallback(
    async (provider: SocialProvider) => {
      const popup = openSocialLoginPopup()

      if (selectedAction != null && selectedAction !== provider) {
        try {
          popup?.close()
        } catch {
          // Ignore popup cleanup failures from cross-origin handles.
        }
        return
      }

      clearSocialLoginSideEffects(true)
      connectionSettledRef.current = false
      setSelectedAction(provider)
      setSelectedDirectoryWalletId(null)
      setSocialConnection({ provider, popupBlocked: popup == null, errorMessage: null })
      setErrorMessage(null)
      setView('socialWallet')
      onConnectStart()

      const requestId = socialRequestIdRef.current + 1
      socialRequestIdRef.current = requestId

      const authConnector = ConnectorController.getAuthConnector() as SocialAuthConnector | undefined
      const getSocialRedirectUri = authConnector?.provider?.getSocialRedirectUri

      if (authConnector == null || getSocialRedirectUri == null) {
        try {
          popup?.close()
        } catch {
          // Ignore popup cleanup failures from cross-origin handles.
        }
        if (requestId !== socialRequestIdRef.current) return
        setSelectedAction(null)
        setSocialConnection({
          provider,
          popupBlocked: false,
          errorMessage: '소셜 로그인 설정을 찾지 못했어요. 다시 시도해 주세요.',
        })
        onConnectError()
        return
      }

      if (popup == null) {
        try {
          const { uri } = await getSocialRedirectUri.call(authConnector.provider, { provider })

          if (requestId !== socialRequestIdRef.current) return

          if (uri == null) {
            throw new Error('Missing social redirect uri')
          }

          storePendingReownSocialProvider(provider)
          window.location.assign(buildReownSocialRedirectUri(uri))
        } catch {
          if (requestId !== socialRequestIdRef.current) return
          setSelectedAction(null)
          setSocialConnection({
            provider,
            popupBlocked: false,
            errorMessage: '소셜 로그인 페이지로 이동하지 못했어요. 다시 시도해 주세요.',
          })
          onConnectError()
        }

        return
      }

      socialPopupRef.current = popup
      AccountController.setSocialProvider(provider, ChainController.state.activeChain)
      AccountController.setSocialWindow(popup, ChainController.state.activeChain)

      const handleSocialConnection = async (event: MessageEvent) => {
        const resultUri = getTrustedSocialResultUri(event)
        if (resultUri == null) return

        clearSocialLoginSideEffects(true)

        try {
          await ConnectionController.connectExternal(
            { id: authConnector.id, type: authConnector.type, socialUri: resultUri },
            authConnector.chain,
          )
          StorageUtil.setConnectedSocialProvider(provider as Parameters<typeof StorageUtil.setConnectedSocialProvider>[0])
          await ConnectionController.connectExternal(authConnector, authConnector.chain)

          if (requestId !== socialRequestIdRef.current) return

          if (ChainController.state.activeCaipAddress == null) {
            throw new Error('Missing social account address')
          }

          connectionSettledRef.current = true
          setErrorMessage(null)
          onConnectSuccess()
          closeSheet(false)
        } catch {
          if (requestId !== socialRequestIdRef.current) return
          setSelectedAction(null)
          setSocialConnection({
            provider,
            popupBlocked: false,
            errorMessage: '로그인을 완료하지 못했어요. 다시 시도해 주세요.',
          })
          onConnectError()
        }
      }

      socialMessageHandlerRef.current = handleSocialConnection
      window.addEventListener('message', handleSocialConnection, false)
      socialTimeoutRef.current = window.setTimeout(() => {
        if (requestId !== socialRequestIdRef.current) return
        clearSocialLoginSideEffects(true)
        setSelectedAction(null)
        setSocialConnection({
          provider,
          popupBlocked: false,
          errorMessage: '로그인 시간이 초과됐어요. 다시 시도해 주세요.',
        })
        onConnectError()
      }, SOCIAL_LOGIN_TIMEOUT_MS)

      try {
        const { uri } = await getSocialRedirectUri.call(authConnector.provider, { provider })

        if (requestId !== socialRequestIdRef.current) return

        if (uri == null) {
          throw new Error('Missing social redirect uri')
        }

        popup.location.href = uri
      } catch {
        clearSocialLoginSideEffects(true)
        if (requestId !== socialRequestIdRef.current) return
        setSelectedAction(null)
        setSocialConnection({
          provider,
          popupBlocked: false,
          errorMessage: '소셜 로그인 창을 열지 못했어요. 다시 시도해 주세요.',
        })
        onConnectError()
      }
    },
    [clearSocialLoginSideEffects, closeSheet, onConnectError, onConnectStart, onConnectSuccess, selectedAction],
  )

  const handleSelectSocialWallet = (provider: SocialProvider) => {
    void startSocialLogin(provider)
  }

  const handleOpenWalletConnect = async () => {
    if (selectedAction != null) return

    await startWalletConnect({ action: 'walletConnect', returnView: 'connect' })
  }

  const startWalletConnect = useCallback(
    async ({
      action,
      wallet,
      returnView,
    }: {
      action: ConnectActionId
      wallet?: WcWallet
      returnView: SheetView
    }) => {
      connectionSettledRef.current = false
      setSelectedAction(action)
      setSelectedDirectoryWalletId(wallet?.id ?? null)
      setWalletConnectWallet(wallet ?? null)
      setWalletConnectReturnView(returnView)
      setCopyMessage(null)
      setErrorMessage(null)
      setView('walletConnect')
      onConnectStart()

      const requestId = walletConnectRequestIdRef.current + 1
      walletConnectRequestIdRef.current = requestId

      try {
        ConnectionController.resetUri()
        ConnectionController.setWcError(false)
        ConnectionController.setWcLinking(undefined)
        ConnectionController.setRecentWallet(wallet)
        await ConnectionController.connectWalletConnect()
        if (requestId !== walletConnectRequestIdRef.current) return
        connectionSettledRef.current = true
        onConnectSuccess()
      } catch {
        if (requestId !== walletConnectRequestIdRef.current) return

        if (hasWalletConnectUri()) {
          ConnectionController.setWcError(false)
          return
        }

        ConnectionController.setWcError(true)
        setErrorMessage(null)
        onConnectError()
      }
    },
    [onConnectError, onConnectStart, onConnectSuccess],
  )

  const startExternalWallet = useCallback(
    async ({
      action,
      wallet,
      connector,
      returnView,
    }: {
      action: ConnectActionId
      wallet: WcWallet
      connector: Connector
      returnView: SheetView
    }) => {
      connectionSettledRef.current = false
      setSelectedAction(action)
      setSelectedDirectoryWalletId(wallet.id)
      setExternalWalletConnection({ wallet, connector, returnView })
      setErrorMessage(null)
      setView('externalWallet')
      onConnectStart()

      const requestId = externalWalletRequestIdRef.current + 1
      externalWalletRequestIdRef.current = requestId

      try {
        await ConnectionController.connectExternal(connector, connector.chain)
        if (requestId !== externalWalletRequestIdRef.current) return
        connectionSettledRef.current = true
        setErrorMessage(null)
        onConnectSuccess()
        closeSheet(false)
      } catch {
        if (requestId !== externalWalletRequestIdRef.current) return
        setSelectedAction(null)
        setSelectedDirectoryWalletId(null)
        setExternalWalletConnection(null)
        setView(returnView === 'externalWallet' ? 'connect' : returnView)
        setErrorMessage('연결이 취소되었어요. 다시 선택해 주세요.')
        onConnectError()
      }
    },
    [closeSheet, onConnectError, onConnectStart, onConnectSuccess],
  )

  const connectCustomWallet = useCallback(
    async ({
      action,
      wallet,
      returnView,
    }: {
      action: ConnectActionId
      wallet: WcWallet
      returnView: SheetView
    }) => {
      const connector = ConnectorController.getConnector(wallet.id, wallet.rdns)

      if (!connector) {
        await startWalletConnect({ action, wallet, returnView })
        return
      }

      if (!isDirectExternalConnector(connector, wallet)) {
        await startWalletConnect({ action, wallet, returnView })
        return
      }

      await startExternalWallet({ action, wallet, connector, returnView })
    },
    [startExternalWallet, startWalletConnect],
  )

  const handleSelectFeaturedWallet = async (option: FeaturedWalletOption) => {
    if (selectedAction != null) return

    const wallet = getFeaturedWallet(option, featuredWallets)
    await connectCustomWallet({ action: option.id, wallet, returnView: 'connect' })
  }

  const handleSelectDirectoryWallet = async (wallet: WcWallet) => {
    if (selectedAction != null) return

    await connectCustomWallet({ action: 'directoryWallet', wallet, returnView: 'allWallets' })
  }

  const handleRetryWalletConnect = useCallback(() => {
    if (selectedAction == null) return

    void startWalletConnect({
      action: selectedAction,
      wallet: walletConnectWallet ?? undefined,
      returnView: walletConnectReturnView,
    })
  }, [selectedAction, startWalletConnect, walletConnectReturnView, walletConnectWallet])

  const handleRetryExternalWallet = useCallback(() => {
    if (selectedAction == null || externalWalletConnection == null) return

    void startExternalWallet({
      action: selectedAction,
      wallet: externalWalletConnection.wallet,
      connector: externalWalletConnection.connector,
      returnView: externalWalletConnection.returnView,
    })
  }, [externalWalletConnection, selectedAction, startExternalWallet])

  const handleCopyWalletConnectUri = useCallback(async () => {
    if (walletConnectState.wcUri == null) return

    const didCopy = await copyText(walletConnectState.wcUri)
    setCopyMessage(didCopy ? '링크를 복사했어요.' : '링크 복사에 실패했어요.')
  }, [walletConnectState.wcUri])

  return (
    <Dimmed onClick={handleRequestClose}>
      <BottomSheet
        ref={sheetRef}
        onClose={handleClosed}
        style={{ height: sheetHeight }}
        className='right-0 mx-auto flex max-h-[calc(100dvh-24px)] max-w-tablet flex-col overflow-hidden rounded-t-28 bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.16)] transition-[height] duration-300 ease-in-out'>
        <header className='relative flex h-52 w-full items-center justify-center px-16'>
          {view !== 'connect' && (
            <button
              className='absolute left-12 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/50'
              aria-label='이전으로'
              onClick={handleBackClick}>
              <ArrowLeftIcon size={28} color={colors.black.DEFAULT} />
            </button>
          )}

          <button
            className='absolute right-16 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/50'
            aria-label='닫기'
            onClick={handleRequestClose}>
            <BrokenXIcon size={22} color={colors.black.DEFAULT} />
          </button>
          <span className='text-16 font-semibold text-black-darken'>
            {view === 'allWallets'
              ? 'Search Wallet'
              : view === 'walletConnect'
                ? 'WalletConnect'
                : view === 'externalWallet'
                  ? externalWalletConnection?.wallet.name ?? 'Connect Wallet'
                  : view === 'socialWallet'
                    ? getSocialOption(socialConnection?.provider)?.label ?? 'Connect Wallet'
                    : 'Connect Wallet'}
          </span>
        </header>

        <section
          className={clsx(
            'flex min-h-0 flex-1 flex-col px-16 pt-4',
            view === 'connect' && 'gap-20 overflow-y-auto pb-36',
            view === 'allWallets' && 'overflow-hidden pb-0',
            (view === 'walletConnect' || view === 'externalWallet' || view === 'socialWallet') && 'overflow-hidden pb-28',
          )}>
          {view === 'connect' && (
            <>
              <SocialLoginOptions
                selectedAction={selectedAction}
                onSelect={handleSelectSocialWallet}
              />

              <OrDivider />

              <WalletOptions
                selectedAction={selectedAction}
                walletImages={walletImages}
                hasMetadataError={featuredWalletMetadata.hasError}
                onSelect={handleSelectFeaturedWallet}
                onOpenWalletConnect={handleOpenWalletConnect}
                onRetryMetadata={featuredWalletMetadata.retry}
                onShowAllWallets={() => {
                  setErrorMessage(null)
                  setView('allWallets')
                }}
              />
            </>
          )}

          {view === 'allWallets' && (
            <AllWalletsContent
              selectedWalletId={selectedDirectoryWalletId}
              isConnecting={selectedAction != null}
              onSelectWallet={handleSelectDirectoryWallet}
            />
          )}

          {view === 'walletConnect' && (
            <WalletConnectContent
              wallet={walletConnectWallet}
              wcUri={walletConnectState.wcUri}
              wcError={walletConnectState.wcError}
              copyMessage={copyMessage}
              onCopy={handleCopyWalletConnectUri}
              onRetry={handleRetryWalletConnect}
            />
          )}

          {view === 'externalWallet' && externalWalletConnection != null && (
            <ExternalWalletContent
              wallet={externalWalletConnection.wallet}
              connectorName={externalWalletConnection.connector.name}
              onRetry={handleRetryExternalWallet}
            />
          )}

          {view === 'socialWallet' && socialConnection != null && (
            <SocialWalletContent
              socialConnection={socialConnection}
              onRetry={() => {
                void startSocialLogin(socialConnection.provider)
              }}
            />
          )}

          {errorMessage != null && (
            <p className='rounded-14 bg-gray-lighten px-12 py-10 text-center text-12 font-semibold text-gray-darker'>
              {errorMessage}
            </p>
          )}
        </section>
      </BottomSheet>
    </Dimmed>
  )
}

function SocialLoginOptions({
  selectedAction,
  onSelect,
}: {
  selectedAction: ConnectActionId | null
  onSelect: (wallet: SocialProvider) => void
}) {
  const [googleOption, ...shortcutOptions] = SOCIAL_OPTIONS
  const isDisabled = selectedAction != null
  const isGoogleSelected = selectedAction === googleOption.id

  return (
    <div className='flex flex-col gap-12'>
      <button
        className={clsx(
          'flex h-52 w-full items-center justify-center gap-10 rounded-24 bg-[#F2F3F5] px-16 active-press-duration active:bg-gray/80',
          isGoogleSelected && 'bg-gray/90',
          isDisabled && !isGoogleSelected && 'cursor-not-allowed opacity-50',
        )}
        disabled={isDisabled}
        aria-label='Google로 로그인'
        onClick={() => onSelect(googleOption.id)}>
        {isGoogleSelected ? <LoadingSpinner size='large' /> : googleOption.icon}
        <span className='text-16 font-medium text-black-darken'>Continue with google</span>
      </button>

      <div className='grid grid-cols-4 gap-10'>
        {shortcutOptions.map((option) => {
          const isSelected = selectedAction === option.id
          const isOptionDisabled = selectedAction != null

          return (
            <button
              key={option.id}
              className={clsx(
                'group flex h-54 items-center justify-center rounded-18 bg-[#F2F3F5] active-press-duration active:scale-95 active:bg-gray/80',
                isSelected && 'bg-gray/90',
                isOptionDisabled && !isSelected && 'cursor-not-allowed opacity-50 active:scale-100',
              )}
              disabled={isOptionDisabled}
              aria-label={`${option.label}로 로그인`}
              onClick={() => onSelect(option.id)}>
              <span
                className={clsx(
                  'flex h-34 w-34 items-center justify-center rounded-full transition-transform group-active:scale-95',
                  option.iconBackground,
                  option.iconClassName,
                )}>
                {isSelected ? <LoadingSpinner /> : option.icon}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function OrDivider() {
  return (
    <div className='flex items-center gap-12'>
      <span className='h-1 flex-1 bg-gray' />
      <span className='text-14 font-medium text-gray-darker'>or</span>
      <span className='h-1 flex-1 bg-gray' />
    </div>
  )
}

function WalletOptions({
  selectedAction,
  walletImages,
  hasMetadataError,
  onSelect,
  onOpenWalletConnect,
  onRetryMetadata,
  onShowAllWallets,
}: {
  selectedAction: ConnectActionId | null
  walletImages: WalletImageMap
  hasMetadataError: boolean
  onSelect: (option: FeaturedWalletOption) => void
  onOpenWalletConnect: () => void
  onRetryMetadata: () => void
  onShowAllWallets: () => void
}) {
  const isAnyDisabled = selectedAction != null

  return (
    <div className='flex flex-col gap-8'>
      <WalletRow
        label='WalletConnect'
        badge='QR CODE'
        icon={<WalletConnectIcon />}
        isSelected={selectedAction === 'walletConnect'}
        disabled={isAnyDisabled && selectedAction !== 'walletConnect'}
        onClick={onOpenWalletConnect}
      />

      {FEATURED_WALLET_OPTIONS.map((option) => (
        <WalletRow
          key={option.id}
          label={option.label}
          icon={<ReownWalletImage imageUrl={walletImages[option.walletId]} label={option.label} />}
          isSelected={selectedAction === option.id}
          disabled={isAnyDisabled && selectedAction !== option.id}
          onClick={() => onSelect(option)}
        />
      ))}

      <WalletRow
        label='Search Wallet'
        badge='560+'
        icon={<SearchWalletIcon />}
        isSelected={false}
        disabled={selectedAction != null}
        onClick={onShowAllWallets}
      />

      {hasMetadataError && (
        <InlineRetryMessage message='지갑 정보를 불러오지 못했어요.' onRetry={onRetryMetadata} />
      )}
    </div>
  )
}

function WalletRow({
  label,
  badge,
  icon,
  isSelected,
  disabled,
  onClick,
}: {
  label: string
  badge?: string
  icon: ReactNode
  isSelected: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      className={clsx(
        'group flex h-54 w-full items-center gap-12 rounded-16 bg-[#F2F3F5] px-12 text-left active-press-duration active:bg-gray/80',
        isSelected && 'bg-gray/90',
        disabled && 'cursor-not-allowed opacity-50',
      )}
      disabled={disabled}
      aria-label={`${label}로 연결`}
      onClick={onClick}>
      <span className='flex h-38 w-38 shrink-0 items-center justify-center overflow-hidden rounded-9'>{isSelected ? <LoadingSpinner /> : icon}</span>
      <span className='min-w-0 flex-1 truncate text-16 font-medium text-black-darken'>{label}</span>
      {badge != null && <span className='rounded-7 bg-[#E7F2FF] px-7 py-3 text-12 font-medium text-[#1283F8]'>{badge}</span>}
    </button>
  )
}

function InlineRetryMessage({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className='flex items-center justify-between gap-10 rounded-14 bg-gray-lighten px-12 py-10'>
      <span className='min-w-0 text-12 font-semibold text-gray-darker'>{message}</span>
      <button
        className='shrink-0 rounded-8 bg-white px-9 py-5 text-12 font-semibold text-primary active-press-duration active:bg-gray/60'
        onClick={onRetry}>
        다시 시도
      </button>
    </div>
  )
}

function WalletConnectContent({
  wallet,
  wcUri,
  wcError,
  copyMessage,
  onCopy,
  onRetry,
}: {
  wallet: WcWallet | null
  wcUri?: string
  wcError?: boolean
  copyMessage: string | null
  onCopy: () => void
  onRetry: () => void
}) {
  const isReady = wcUri != null && !wcError

  return (
    <div className='flex min-h-0 flex-1 flex-col items-center justify-between gap-16 overflow-hidden'>
      <div className='flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-18'>
        <div className='flex aspect-square w-full max-w-[260px] items-center justify-center rounded-28 bg-[#F2F3F5] p-10'>
          {isReady ? (
            <WalletConnectQrCode uri={wcUri} wallet={wallet} />
          ) : (
            <WalletConnectQrSkeleton />
          )}
        </div>

        <div className='flex flex-col items-center gap-6 text-center'>
          <p className='text-16 font-semibold text-black-darken'>
            {wcError ? '연결을 완료하지 못했어요' : '휴대폰 지갑으로 QR을 스캔해 주세요'}
          </p>
          <p className='max-w-[280px] text-13 font-medium leading-[1.45] text-gray-darker'>
            {wcError ? '이전 요청이 만료되었거나 취소되었어요.' : 'WalletConnect 지원 지갑에서 연결 요청을 승인하면 로그인돼요.'}
          </p>
        </div>
      </div>

      <div className='flex w-full flex-col gap-8'>
        {wcError ? (
          <button
            className='flex h-48 w-full items-center justify-center rounded-16 bg-primary text-15 font-semibold text-white active-press-duration active:bg-primary-darken'
            onClick={onRetry}>
            다시 시도
          </button>
        ) : (
          <button
            className={clsx(
              'flex h-48 w-full items-center justify-center gap-8 rounded-16 bg-[#F2F3F5] text-15 font-semibold text-black-darken active-press-duration active:bg-gray/80',
              !isReady && 'cursor-not-allowed opacity-50',
            )}
            disabled={!isReady}
            onClick={onCopy}>
            <FiCopy size={18} />
            Copy link
          </button>
        )}

        {copyMessage != null && (
          <p className='text-center text-12 font-medium text-gray-darker' aria-live='polite'>
            {copyMessage}
          </p>
        )}
      </div>
    </div>
  )
}

function ExternalWalletContent({
  wallet,
  connectorName,
  onRetry,
}: {
  wallet: WcWallet
  connectorName: string
  onRetry: () => void
}) {
  const walletName = wallet.name || connectorName

  return (
    <div className='flex min-h-0 flex-1 flex-col items-center justify-between gap-16 overflow-hidden'>
      <div className='flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-18 text-center'>
        <div className='relative flex h-86 w-86 items-center justify-center rounded-26 bg-[#F2F3F5]'>
          <span className='flex h-62 w-62 items-center justify-center overflow-hidden rounded-18 bg-white'>
            <WalletMetadataImage wallet={wallet} size={62} />
          </span>
          <span className='absolute -bottom-6 -right-6 flex h-26 w-26 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.16)]'>
            <LoadingSpinner />
          </span>
        </div>

        <div className='flex flex-col items-center gap-6'>
          <p className='text-17 font-semibold text-black-darken'>{walletName} 연결 대기 중</p>
          <p className='max-w-[280px] text-13 font-medium leading-[1.45] text-gray-darker'>
            지갑 앱이나 브라우저 확장 프로그램에서 연결 요청을 승인해 주세요.
          </p>
        </div>
      </div>

      <button
        className='flex h-48 w-full items-center justify-center rounded-16 bg-[#F2F3F5] text-15 font-semibold text-black-darken active-press-duration active:bg-gray/80'
        onClick={onRetry}>
        연결 요청 다시 보내기
      </button>
    </div>
  )
}

function SocialWalletContent({
  socialConnection,
  onRetry,
}: {
  socialConnection: SocialConnectionState
  onRetry: () => void
}) {
  const option = getSocialOption(socialConnection.provider)
  const isBlocked = socialConnection.popupBlocked
  const hasError = socialConnection.errorMessage != null
  const title = isBlocked
    ? '팝업이 차단됐어요'
    : hasError
      ? '로그인을 완료하지 못했어요'
      : `${option?.label ?? '소셜'} 로그인 진행 중`
  const description =
    socialConnection.errorMessage ??
    `${option?.label ?? '소셜'} 인증 창에서 로그인을 완료해 주세요. 이 화면은 인증 결과를 기다리고 있어요.`
  const buttonLabel = isBlocked ? '팝업 허용 후 다시 시도' : '로그인 창 다시 열기'

  return (
    <div className='flex min-h-0 flex-1 flex-col items-center justify-between gap-16 overflow-hidden'>
      <div className='flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-18 text-center'>
        <div className='relative flex h-86 w-86 items-center justify-center rounded-26 bg-[#F2F3F5]'>
          <span className={clsx('flex h-62 w-62 items-center justify-center rounded-18', option?.iconBackground, option?.iconClassName)}>
            {option?.icon}
          </span>
          {!isBlocked && !hasError && (
            <span className='absolute -bottom-6 -right-6 flex h-26 w-26 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.16)]'>
              <LoadingSpinner />
            </span>
          )}
        </div>

        <div className='flex flex-col items-center gap-6'>
          <p className='text-17 font-semibold text-black-darken'>{title}</p>
          <p className='max-w-[300px] text-13 font-medium leading-[1.45] text-gray-darker'>{description}</p>
        </div>
      </div>

      {(isBlocked || hasError) && (
        <button
          className='flex h-48 w-full items-center justify-center rounded-16 bg-[#F2F3F5] text-15 font-semibold text-black-darken active-press-duration active:bg-gray/80'
          onClick={onRetry}>
          {buttonLabel}
        </button>
      )}
    </div>
  )
}

function WalletConnectQrSkeleton() {
  return (
    <WalletConnectQrFrame>
      <div
        className='relative h-full w-full'
        role='img'
        aria-label='WalletConnect QR Code loading'>
        <div
          className='absolute animate-pulse rounded-10 bg-[#EEF1F5]'
          style={{ inset: QR_SKELETON_QUIET_ZONE_INSET }}
        />
      </div>
    </WalletConnectQrFrame>
  )
}

function WalletConnectQrCode({ uri, wallet }: { uri: string; wallet: WcWallet | null }) {
  const walletImage = wallet == null ? undefined : AssetUtil.getWalletImage(wallet)
  const qrPath = useMemo(() => {
    const qr = QRCode.create(uri, { errorCorrectionLevel: 'H' })
    const size = qr.modules.size
    const margin = QR_CODE_MARGIN_MODULES
    const viewBoxSize = size + margin * 2
    const path = buildQrPath(qr.modules.data, size, margin)

    return { path, viewBoxSize }
  }, [uri])

  return (
    <WalletConnectQrFrame>
      <svg
        className='h-full w-full'
        viewBox={`0 0 ${qrPath.viewBoxSize} ${qrPath.viewBoxSize}`}
        role='img'
        aria-label={`${wallet?.name ?? 'WalletConnect'} QR Code`}
        shapeRendering='crispEdges'>
        <rect width={qrPath.viewBoxSize} height={qrPath.viewBoxSize} fill='white' />
        <path d={qrPath.path} fill='#141414' />
      </svg>
      <WalletConnectQrCenterIcon imageUrl={walletImage} walletName={wallet?.name} />
    </WalletConnectQrFrame>
  )
}

function WalletConnectQrFrame({ children }: { children: ReactNode }) {
  return (
    <div className='relative flex h-full w-full items-center justify-center rounded-24 bg-white p-6 shadow-[0_0_0_1px_#E5E7EB]'>
      {children}
    </div>
  )
}

function WalletConnectQrCenterIcon({ imageUrl, walletName }: { imageUrl?: string; walletName?: string }) {
  return (
    <span className='absolute left-1/2 top-1/2 flex h-42 w-42 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-12 bg-white shadow-[0_0_0_8px_white]'>
      {imageUrl != null ? (
        <Image
          src={imageUrl}
          alt={`${walletName ?? 'Wallet'} 아이콘`}
          width={34}
          height={34}
          unoptimized
          className='h-34 w-34 rounded-8 object-contain'
        />
      ) : (
        <SiWalletconnect size={30} className='text-[#3B99FC]' />
      )}
    </span>
  )
}

function buildQrPath(data: Uint8Array, size: number, margin: number) {
  let path = ''

  for (let y = 0; y < size; y += 1) {
    let x = 0

    while (x < size) {
      const start = x

      while (x < size && data[y * size + x] === 1) {
        x += 1
      }

      if (x > start) {
        path += `M${start + margin} ${y + margin}h${x - start}v1H${start + margin}z`
      }

      x += 1
    }
  }

  return path
}

function AllWalletsContent({
  selectedWalletId,
  isConnecting,
  onSelectWallet,
}: {
  selectedWalletId: string | null
  isConnecting: boolean
  onSelectWallet: (wallet: WcWallet) => void
}) {
  const scrollRootRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [badge, setBadge] = useState<WalletBadge>(undefined)
  const { wallets, isLoading, isLoadingMore, canLoadMore, loadMore, errorMessage, retry } = useReownWalletDirectory({
    enabled: true,
    query,
    badge,
  })
  const firstViewportImages = usePreloadedWalletImages(wallets, isLoading)
  const shouldShowSkeletonGrid = isLoading || !firstViewportImages.isReady

  useEffect(() => {
    scrollRootRef.current?.scrollTo({ top: 0 })
  }, [badge, query])

  useEffect(() => {
    const root = scrollRootRef.current
    const sentinel = sentinelRef.current
    if (root == null || sentinel == null || !canLoadMore || shouldShowSkeletonGrid || isLoadingMore) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        void loadMore()
      }
    }, { root, rootMargin: '160px' })

    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [canLoadMore, isLoadingMore, loadMore, shouldShowSkeletonGrid])

  return (
    <div className='flex min-h-0 flex-1 flex-col gap-14'>
      <div className='flex gap-8'>
        <label className='flex h-44 min-w-0 flex-1 items-center gap-8 rounded-18 bg-[#F2F3F5] px-12'>
          <MagnifierIcon size={20} color={colors.gray.darker} />
          <input
            className='min-w-0 flex-1 bg-transparent text-14 font-medium text-black-darken outline-none placeholder:text-gray-darker'
            value={query}
            placeholder='Search wallet'
            autoComplete='off'
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <button
          className={clsx(
            'flex h-44 w-44 shrink-0 items-center justify-center rounded-16 active-press-duration active:bg-gray/80',
            badge === 'certified' ? 'bg-[#E7F2FF] text-[#1283F8]' : 'bg-[#F2F3F5] text-gray-darker',
          )}
          aria-label='WalletConnect certified filter'
          aria-pressed={badge === 'certified'}
          onClick={() => setBadge((prev) => (prev === 'certified' ? undefined : 'certified'))}>
          <SiWalletconnect size={24} />
        </button>
      </div>

      <div
        ref={scrollRootRef}
        className='min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [overflow-anchor:none] [scrollbar-gutter:stable]'>
        <div className='grid grid-cols-3 gap-10'>
          {shouldShowSkeletonGrid ? (
            <WalletDirectoryPlaceholder count={INITIAL_WALLET_SKELETON_COUNT} />
          ) : (
            wallets.map((wallet, index) => {
              const isFirstViewportWallet = index < INITIAL_WALLET_SKELETON_COUNT
              const imageUrl = firstViewportImages.images[wallet.id]

              return (
                <WalletDirectoryItem
                  key={wallet.id}
                  wallet={wallet}
                  imageUrl={imageUrl}
                  disableImageFetch={isFirstViewportWallet && imageUrl == null}
                  isSelected={selectedWalletId === wallet.id}
                  disabled={isConnecting && selectedWalletId !== wallet.id}
                  onClick={() => onSelectWallet(wallet)}
                />
              )
            })
          )}

          {!shouldShowSkeletonGrid && isLoadingMore && (
            <WalletDirectoryPlaceholder count={LOAD_MORE_WALLET_SKELETON_COUNT} />
          )}
        </div>

        {!shouldShowSkeletonGrid && errorMessage != null && (
          <div className='mt-10'>
            <InlineRetryMessage message={errorMessage} onRetry={retry} />
          </div>
        )}

        {!shouldShowSkeletonGrid && errorMessage == null && wallets.length === 0 && (
          <div className='mt-10 flex h-96 items-center justify-center rounded-18 bg-[#F2F3F5] text-14 font-medium text-gray-darker'>
            No Wallet found
          </div>
        )}

        <div ref={sentinelRef} className='h-1' />
        <div className='h-36' />
      </div>
    </div>
  )
}

function WalletDirectoryItem({
  wallet,
  imageUrl,
  disableImageFetch,
  isSelected,
  disabled,
  onClick,
}: {
  wallet: WcWallet
  imageUrl?: string
  disableImageFetch?: boolean
  isSelected: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      className={clsx(
        'flex h-92 min-w-0 flex-col items-center justify-center gap-7 rounded-16 bg-[#F2F3F5] px-8 active-press-duration active:scale-95 active:bg-gray/80 [contain:layout_paint_style]',
        isSelected && 'bg-gray/90',
        disabled && 'cursor-not-allowed opacity-50 active:scale-100',
      )}
      disabled={disabled}
      aria-label={`${wallet.name}로 연결`}
      onClick={onClick}>
      <span className='flex h-44 w-44 shrink-0 items-center justify-center overflow-hidden rounded-12 bg-white'>
        {isSelected ? (
          <LoadingSpinner />
        ) : (
          <WalletMetadataImage wallet={wallet} imageUrl={imageUrl} disableFetch={disableImageFetch} size={44} />
        )}
      </span>
      <span className='w-full truncate text-center text-12 font-semibold text-black-darken'>{wallet.name}</span>
    </button>
  )
}

function WalletDirectoryPlaceholder({ count }: { count: number }) {
  return Array.from({ length: count }).map((_, index) => (
    <div
      key={index}
      className='flex h-92 flex-col items-center justify-center gap-7 rounded-16 bg-[#F2F3F5] px-8 [contain:layout_paint_style]'>
      <span className='h-44 w-44 animate-pulse rounded-12 bg-gray' />
      <span className='h-12 w-56 animate-pulse rounded-4 bg-gray' />
    </div>
  ))
}

function ReownWalletImage({ imageUrl, label }: { imageUrl?: string; label: string }) {
  if (imageUrl == null) {
    return <span className='h-38 w-38 rounded-9 bg-gray' />
  }

  return <Image src={imageUrl} alt={`${label} 아이콘`} width={38} height={38} unoptimized className='rounded-9' />
}

function WalletMetadataImage({
  wallet,
  imageUrl: preloadedImageUrl,
  disableFetch,
  size,
}: {
  wallet: WcWallet
  imageUrl?: string
  disableFetch?: boolean
  size: number
}) {
  const imageUrl = useWalletMetadataImage(wallet, preloadedImageUrl, disableFetch)

  if (imageUrl == null) {
    return <WalletInitial name={wallet.name} size={size} />
  }

  return (
    <Image
      src={imageUrl}
      alt={`${wallet.name} 아이콘`}
      width={size}
      height={size}
      unoptimized
      className='h-full w-full object-contain'
    />
  )
}

function WalletInitial({ name, size }: { name: string; size: number }) {
  return (
    <span
      className='flex items-center justify-center rounded-12 bg-gray text-16 font-bold text-gray-darker'
      style={{ width: size, height: size }}>
      {name.trim().charAt(0).toUpperCase()}
    </span>
  )
}

function WalletConnectIcon() {
  return (
    <span className='flex h-38 w-38 items-center justify-center rounded-8 bg-[#3B99FC] text-white'>
      <SiWalletconnect size={24} />
    </span>
  )
}

function SearchWalletIcon() {
  return (
    <span className='flex h-38 w-38 items-center justify-center rounded-8 bg-[#E9EAEC]'>
      <MagnifierIcon size={22} color={colors.gray.darker} />
    </span>
  )
}

function LoadingSpinner({ size = 'default' }: { size?: 'default' | 'large' }) {
  return (
    <span
      className={clsx(
        'animate-spin rounded-full border-2 border-gray border-t-primary',
        size === 'large' ? 'h-20 w-20' : 'h-18 w-18',
      )}
    />
  )
}

function useReownFeaturedWallets(wallets: FeaturedWalletOption[]): FeaturedWalletMetadataState {
  const walletIds = useMemo(() => wallets.map((wallet) => wallet.walletId), [wallets])
  const [walletMap, setWalletMap] = useState<FeaturedWalletMap>({})
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const retry = useCallback(() => setRetryCount((prev) => prev + 1), [])

  useEffect(() => {
    let cancelled = false

    async function fetchWallets() {
      try {
        const { data } = await ApiController.fetchWallets({
          page: 1,
          entries: walletIds.length,
          include: walletIds,
        })

        const featuredWallets = await data.reduce<Promise<FeaturedWalletMap>>(async (prevPromise, wallet) => {
          const prev = await prevPromise
          const imageUrl = await getWalletImage(wallet)

          prev[wallet.id] = {
            ...wallet,
            image_url: imageUrl ?? wallet.image_url,
          }

          return prev
        }, Promise.resolve({}))

        if (!cancelled) {
          setWalletMap(featuredWallets)
          setHasError(data.length < walletIds.length)
        }
      } catch {
        if (!cancelled) {
          setWalletMap({})
          setHasError(true)
        }
      }
    }

    void fetchWallets()

    return () => {
      cancelled = true
    }
  }, [retryCount, walletIds])

  return { wallets: walletMap, hasError, retry }
}

function getWalletImagesFromMap(wallets: FeaturedWalletMap) {
  return Object.values(wallets).reduce<WalletImageMap>((acc, wallet) => {
    if (wallet != null) {
      const imageUrl = wallet.image_url ?? AssetUtil.getWalletImage(wallet)
      if (imageUrl != null) {
        acc[wallet.id] = imageUrl
      }
    }

    return acc
  }, {})
}

function getFeaturedWallet(option: FeaturedWalletOption, wallets: FeaturedWalletMap): WcWallet {
  return (
    wallets[option.walletId] ?? {
      id: option.walletId,
      name: option.label,
    }
  )
}

function useWalletMetadataImage(wallet: WcWallet, preloadedImageUrl?: string, disableFetch?: boolean) {
  const [imageUrl, setImageUrl] = useState(() => preloadedImageUrl ?? wallet.image_url ?? AssetUtil.getWalletImage(wallet))

  useEffect(() => {
    let cancelled = false
    if (preloadedImageUrl != null) {
      setImageUrl(preloadedImageUrl)
      return
    }

    if (disableFetch) {
      setImageUrl(undefined)
      return
    }

    const cachedImageUrl = wallet.image_url ?? AssetUtil.getWalletImage(wallet)

    if (cachedImageUrl != null) {
      setImageUrl(cachedImageUrl)
      return
    }

    async function fetchImage() {
      const fetchedImageUrl = await AssetUtil.fetchWalletImage(wallet.image_id)
      if (!cancelled) {
        setImageUrl(fetchedImageUrl)
      }
    }

    void fetchImage()

    return () => {
      cancelled = true
    }
  }, [disableFetch, preloadedImageUrl, wallet])

  return imageUrl
}

function usePreloadedWalletImages(wallets: WcWallet[], isLoading: boolean) {
  const preloadWallets = useMemo(() => wallets.slice(0, INITIAL_WALLET_SKELETON_COUNT), [wallets])
  const preloadKey = useMemo(
    () =>
      preloadWallets
        .map((wallet) => `${wallet.id}:${wallet.image_id ?? ''}:${wallet.image_url ?? AssetUtil.getWalletImage(wallet) ?? ''}`)
        .join('|'),
    [preloadWallets],
  )
  const [state, setState] = useState<{ key: string; isReady: boolean; images: WalletImageMap }>({
    key: '',
    isReady: false,
    images: {},
  })

  useEffect(() => {
    let cancelled = false

    if (isLoading) {
      setState({ key: preloadKey, isReady: false, images: {} })
      return
    }

    if (preloadWallets.length === 0) {
      setState({ key: preloadKey, isReady: true, images: {} })
      return
    }

    setState((prev) => (prev.key === preloadKey && prev.isReady ? prev : { key: preloadKey, isReady: false, images: {} }))

    async function preloadImages() {
      const entries = await Promise.all(
        preloadWallets.map(async (wallet): Promise<[string, string | undefined]> => {
          const imageUrl = await getWalletImage(wallet)

          if (imageUrl == null) {
            return [wallet.id, undefined]
          }

          const didLoad = await preloadImage(imageUrl)
          return [wallet.id, didLoad ? imageUrl : undefined]
        }),
      )

      if (cancelled) return

      const images = entries.reduce<WalletImageMap>((acc, [walletId, imageUrl]) => {
        if (imageUrl != null) {
          acc[walletId] = imageUrl
        }

        return acc
      }, {})

      setState({ key: preloadKey, isReady: true, images })
    }

    void preloadImages()

    return () => {
      cancelled = true
    }
  }, [isLoading, preloadKey, preloadWallets])

  return {
    isReady: state.key === preloadKey && state.isReady,
    images: state.images,
  }
}

function useWalletConnectState(enabled: boolean): WalletConnectSheetState {
  const [state, setState] = useState<WalletConnectSheetState>(readWalletConnectState)

  useEffect(() => {
    if (!enabled) return

    const update = () => setState(readWalletConnectState())
    update()

    const unsubscribers = [
      ConnectionController.subscribeKey('wcUri', update),
      ConnectionController.subscribeKey('wcError', update),
      ConnectionController.subscribeKey('status', update),
    ]

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe())
  }, [enabled])

  return state
}

function useReownWalletDirectory({
  enabled,
  query,
  badge,
}: {
  enabled: boolean
  query: string
  badge: WalletBadge
}) {
  const [apiState, setApiState] = useState(readWalletDirectoryState)
  const [isInitialLoading, setIsInitialLoading] = useState(false)
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isExhausted, setIsExhausted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const loadMoreInFlightRef = useRef(false)
  const lastRequestedPageRef = useRef(ApiController.state.page)
  const loadMoreCooldownUntilRef = useRef(0)
  const searchRequestIdRef = useRef(0)

  const searchQuery = query.trim()
  const isSearchMode = searchQuery.length >= 2 || badge != null
  const retry = useCallback(() => {
    setErrorMessage(null)
    setRetryCount((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (!enabled) return

    loadMoreInFlightRef.current = false
    lastRequestedPageRef.current = ApiController.state.page
    loadMoreCooldownUntilRef.current = 0
    setIsExhausted(false)
  }, [badge, enabled, isSearchMode, searchQuery])

  useEffect(() => {
    if (!enabled) return

    const update = () => {
      const nextState = readWalletDirectoryState()
      setApiState((prev) => (isSearchMode ? { ...nextState, search: prev.search } : nextState))
    }
    update()

    return subscribeWalletDirectory(update)
  }, [enabled, isSearchMode])

  useEffect(() => {
    if (!enabled) return

    let cancelled = false

    async function initializeWalletDirectory() {
      setIsInitialLoading(true)
      setErrorMessage(null)
      try {
        setIsExhausted(false)
        ConnectorController.setFilterByNamespace('eip155')
        await ApiController.prefetch({ fetchConnectorImages: false, fetchNetworkImages: false })
        if (ApiController.state.wallets.length === 0) {
          await ApiController.fetchWalletsByPage({ page: 1 })
        }
      } catch {
        if (!cancelled) {
          setIsExhausted(true)
          setErrorMessage('지갑 목록을 불러오지 못했어요.')
        }
      } finally {
        if (!cancelled) {
          lastRequestedPageRef.current = ApiController.state.page
          setIsInitialLoading(false)
          setApiState(readWalletDirectoryState())
        }
      }
    }

    void initializeWalletDirectory()

    return () => {
      cancelled = true
    }
  }, [enabled, retryCount])

  useEffect(() => {
    if (!enabled) return

    if (!isSearchMode) {
      searchRequestIdRef.current += 1
      setIsSearchLoading(false)
      setErrorMessage(null)
      return
    }

    let cancelled = false
    const requestId = searchRequestIdRef.current + 1
    searchRequestIdRef.current = requestId
    setIsSearchLoading(true)
    setErrorMessage(null)

    const timeoutId = window.setTimeout(async () => {
      let nextState = readWalletDirectoryState()
      let nextErrorMessage: string | null = null

      try {
        await ApiController.searchWallet({ search: searchQuery, badge })
        nextState = readWalletDirectoryState()
      } catch {
        nextState = { ...readWalletDirectoryState(), search: [] }
        nextErrorMessage = '지갑 검색 결과를 불러오지 못했어요.'
      } finally {
        if (!cancelled && requestId === searchRequestIdRef.current) {
          setIsSearchLoading(false)
          setErrorMessage(nextErrorMessage)
          setApiState(nextState)
        }
      }
    }, 250)

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [badge, enabled, isSearchMode, retryCount, searchQuery])

  const wallets = useMemo(() => {
    if (isSearchMode) {
      return uniqueWallets(apiState.search)
    }

    const directoryWallets =
      apiState.filteredWallets.length > 0
        ? [...apiState.featured, ...apiState.recommended, ...apiState.filteredWallets]
        : [...apiState.featured, ...apiState.recommended, ...apiState.wallets]

    return uniqueWallets(directoryWallets)
  }, [apiState, isSearchMode])

  const canLoadMore = !isSearchMode && !isExhausted && apiState.count > 0 && apiState.wallets.length < apiState.count

  const loadMore = useCallback(async () => {
    if (isSearchMode || loadMoreInFlightRef.current || !canLoadMore) return

    const now = Date.now()
    if (now < loadMoreCooldownUntilRef.current) return

    const currentPage = ApiController.state.page
    const nextPage = currentPage + 1
    if (nextPage <= lastRequestedPageRef.current) return

    const previousWalletIds = getWalletIdSet(ApiController.state.wallets)

    loadMoreInFlightRef.current = true
    lastRequestedPageRef.current = nextPage
    setIsLoadingMore(true)

    try {
      await ApiController.fetchWalletsByPage({ page: nextPage })

      const nextState = readWalletDirectoryState()
      const nextWalletIds = getWalletIdSet(nextState.wallets)
      const hasNewWallet = hasNewWalletId(nextWalletIds, previousWalletIds)

      if (!hasNewWallet || nextState.wallets.length >= nextState.count) {
        setIsExhausted(true)
      }

      setApiState(nextState)
    } catch {
      lastRequestedPageRef.current = ApiController.state.page
      loadMoreCooldownUntilRef.current = Date.now() + 1500
      setErrorMessage('지갑 목록을 더 불러오지 못했어요.')
    } finally {
      loadMoreInFlightRef.current = false
      setIsLoadingMore(false)
      setApiState(readWalletDirectoryState())
    }
  }, [canLoadMore, isSearchMode])

  return {
    wallets,
    isLoading: isInitialLoading || isSearchLoading,
    isLoadingMore,
    canLoadMore,
    errorMessage,
    loadMore,
    retry,
  }
}

function readWalletDirectoryState() {
  return {
    count: ApiController.state.count,
    page: ApiController.state.page,
    featured: [...ApiController.state.featured],
    recommended: [...ApiController.state.recommended],
    wallets: [...ApiController.state.wallets],
    filteredWallets: [...ApiController.state.filteredWallets],
    search: [...ApiController.state.search],
  }
}

function subscribeWalletDirectory(update: () => void) {
  const unsubscribers = [
    ApiController.subscribeKey('count', update),
    ApiController.subscribeKey('featured', update),
    ApiController.subscribeKey('recommended', update),
    ApiController.subscribeKey('wallets', update),
    ApiController.subscribeKey('filteredWallets', update),
    ApiController.subscribeKey('page', update),
  ]

  return () => unsubscribers.forEach((unsubscribe) => unsubscribe())
}

function readWalletConnectState(): WalletConnectSheetState {
  return {
    wcUri: ConnectionController.state.wcUri,
    wcError: ConnectionController.state.wcError,
    status: ConnectionController.state.status,
  }
}

function hasWalletConnectUri() {
  return typeof ConnectionController.state.wcUri === 'string' && ConnectionController.state.wcUri.length > 0
}

function uniqueWallets(wallets: WcWallet[]) {
  const map = new Map<string, WcWallet>()

  wallets.forEach((wallet) => {
    if (!map.has(wallet.id)) {
      map.set(wallet.id, wallet)
    }
  })

  return Array.from(map.values())
}

function getWalletIdSet(wallets: WcWallet[]) {
  return new Set(wallets.map((wallet) => wallet.id))
}

function hasNewWalletId(nextWalletIds: Set<string>, previousWalletIds: Set<string>) {
  return Array.from(nextWalletIds).some((walletId) => !previousWalletIds.has(walletId))
}

function getSocialOption(provider?: SocialProvider) {
  return SOCIAL_OPTIONS.find((option) => option.id === provider)
}

function openSocialLoginPopup() {
  try {
    return window.open(SOCIAL_LOGIN_LOADING_URL, 'popupWindow', SOCIAL_LOGIN_POPUP_FEATURES)
  } catch {
    return null
  }
}

function getTrustedSocialResultUri(event: MessageEvent) {
  if (event.origin !== SOCIAL_LOGIN_ORIGIN) return undefined

  const data = event.data

  if (typeof data !== 'object' || data == null || !('resultUri' in data)) {
    return undefined
  }

  const resultUri = data.resultUri
  return typeof resultUri === 'string' ? resultUri : undefined
}

function isDirectExternalConnector(connector: Connector, wallet: WcWallet) {
  if (wallet.id === WALLET_ID_COINBASE_WALLET || connector.id.toLowerCase().includes('coinbase')) {
    return false
  }

  if (connector.type !== 'ANNOUNCED' && connector.type !== 'INJECTED') {
    return false
  }

  if (connector.id === 'injected' && wallet.rdns == null) {
    return false
  }

  return connector.provider != null || connector.info != null
}

async function getWalletImage(wallet: WcWallet) {
  try {
    return wallet.image_url ?? AssetUtil.getWalletImage(wallet) ?? (await AssetUtil.fetchWalletImage(wallet.image_id))
  } catch {
    return undefined
  }
}

function preloadImage(src: string) {
  return new Promise<boolean>((resolve) => {
    const image = new window.Image()
    image.onload = () => resolve(true)
    image.onerror = () => resolve(false)
    image.src = src
  })
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      const didCopy = document.execCommand('copy')
      document.body.removeChild(textarea)
      return didCopy
    } catch {
      return false
    }
  }
}
