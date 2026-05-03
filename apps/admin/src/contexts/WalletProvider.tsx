'use client'

import { createAppKit } from '@reown/appkit/react'
import { base, baseSepolia, type AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { type ReactNode } from 'react'
import { type State, WagmiProvider } from 'wagmi'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim() || ''
const networks = [base, baseSepolia] as [AppKitNetwork, ...AppKitNetwork[]]

const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
  ssr: true,
})

createAppKit({
  projectId,
  networks,
  defaultNetwork: baseSepolia,
  adapters: [wagmiAdapter],
  allWallets: 'SHOW',
  showWallets: true,
  features: {
    analytics: false,
    email: false,
    emailShowWallets: false,
    socials: false,
  },
  metadata: {
    name: 'Open Run Admin',
    description: 'Open Run Admin Console',
    url: 'https://open-run-admin.vercel.app',
    icons: [],
  },
})

export function WalletProvider(props: { children: ReactNode; initialState?: State }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={props.initialState}>
      {props.children}
    </WagmiProvider>
  )
}
