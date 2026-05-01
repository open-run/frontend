export const REOWN_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'ad41cd1ed822293016042e1a5bc4b5f2'

export const WALLET_ID_METAMASK = 'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96'
export const WALLET_ID_TRUST_WALLET = '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0'
// The native app currently lists c03d..., but Reown's web wallet directory does not return
// metadata for that id. Use the web directory id so icon and connection metadata resolve.
export const WALLET_ID_BINANCE_WALLET = '8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4'
export const WALLET_ID_COINBASE_WALLET = 'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa'

export const FEATURED_WALLET_IDS = [
  WALLET_ID_METAMASK,
  WALLET_ID_TRUST_WALLET,
  WALLET_ID_BINANCE_WALLET,
  WALLET_ID_COINBASE_WALLET,
]
