'use client'

import { createAppKit } from '@reown/appkit/react'
import { base, baseSepolia, type AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { type ReactNode } from 'react'
import { type State, WagmiProvider } from 'wagmi'

const WALLET_ID_METAMASK = 'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96'
const WALLET_ID_TRUST_WALLET = '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0'
const WALLET_ID_BINANCE_WALLET = 'c03dfee351b6fcc421b4494ea33b9d4b5a73a16eb3a21e3e44f81d2fde2c1e4e'
const WALLET_ID_COINBASE_WALLET = 'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
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
  featuredWalletIds: [
    WALLET_ID_METAMASK,
    WALLET_ID_TRUST_WALLET,
    WALLET_ID_BINANCE_WALLET,
    WALLET_ID_COINBASE_WALLET,
  ],
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
