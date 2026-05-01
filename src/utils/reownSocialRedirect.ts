export type ReownSocialProvider = 'google' | 'x' | 'discord' | 'apple' | 'github'

const PENDING_SOCIAL_PROVIDER_KEY = 'openrun:reown-social-provider'

export function storePendingReownSocialProvider(provider: ReownSocialProvider) {
  window.sessionStorage.setItem(PENDING_SOCIAL_PROVIDER_KEY, provider)
}

export function consumePendingReownSocialProvider() {
  const provider = window.sessionStorage.getItem(PENDING_SOCIAL_PROVIDER_KEY)
  window.sessionStorage.removeItem(PENDING_SOCIAL_PROVIDER_KEY)
  return isReownSocialProvider(provider) ? provider : undefined
}

export function hasPendingReownSocialRedirect() {
  if (typeof window === 'undefined') return false

  const url = new URL(window.location.href)
  return url.searchParams.has('result_uri') && isReownSocialProvider(window.sessionStorage.getItem(PENDING_SOCIAL_PROVIDER_KEY))
}

export function buildReownSocialRedirectUri(uri: string, appReturnUrl = getCleanCurrentUrl()) {
  const valueToInject = `--${encodeURIComponent(appReturnUrl)}`
  const stateParam = 'state='
  const parsedUrl = new URL(uri)

  if (parsedUrl.host === 'auth.magic.link') {
    const providerParam = 'provider_authorization_url='
    const providerParamIndex = uri.indexOf(providerParam)

    if (providerParamIndex === -1) {
      throw new Error('provider_authorization_url parameter not found')
    }

    const providerUrl = uri.substring(providerParamIndex + providerParam.length)
    const resultUrl = injectIntoUrl(decodeURIComponent(providerUrl), stateParam, valueToInject)
    return uri.replace(providerUrl, encodeURIComponent(resultUrl))
  }

  return injectIntoUrl(uri, stateParam, valueToInject)
}

function getCleanCurrentUrl() {
  const url = new URL(window.location.href)
  url.searchParams.delete('result_uri')
  return url.toString()
}

function injectIntoUrl(url: string, key: string, appendString: string) {
  const keyIndex = url.indexOf(key)

  if (keyIndex === -1) {
    throw new Error(`${key} parameter not found`)
  }

  const keyEndIndex = url.indexOf('&', keyIndex)
  const keyParamEnd = keyEndIndex !== -1 ? keyEndIndex : url.length
  const beforeKeyValue = url.substring(0, keyIndex + key.length)
  const currentKeyValue = url.substring(keyIndex + key.length, keyParamEnd)
  const afterKeyValue = keyEndIndex !== -1 ? url.substring(keyEndIndex) : ''

  return beforeKeyValue + currentKeyValue + appendString + afterKeyValue
}

function isReownSocialProvider(provider: string | null): provider is ReownSocialProvider {
  return provider === 'google' || provider === 'x' || provider === 'discord' || provider === 'apple' || provider === 'github'
}
