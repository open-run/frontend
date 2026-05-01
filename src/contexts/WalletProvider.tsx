'use client'

import { createAppKit } from '@reown/appkit/react'
import { base, baseSepolia, type AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { type ReactNode } from 'react'
import { type State, WagmiProvider } from 'wagmi'
import { FEATURED_WALLET_IDS, REOWN_PROJECT_ID } from '@constants/wallet'

const projectId = REOWN_PROJECT_ID
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
  featuredWalletIds: FEATURED_WALLET_IDS,
  features: {
    analytics: false,
    email: false,
    emailShowWallets: true,
    socials: ['google', 'apple', 'discord', 'x', 'github'],
  },
  metadata: {
    name: 'Open Run',
    description: 'Open Run App',
    url: 'https://open-run.vercel.app',
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
