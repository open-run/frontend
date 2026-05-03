export function setCookie(name: string, value: string, maxAgeSeconds?: number) {
  if (typeof document === 'undefined') return
  let cookie = `${name}=${encodeURIComponent(value)}; path=/`
  if (maxAgeSeconds != null) cookie += `; max-age=${maxAgeSeconds}`
  document.cookie = cookie
}

export function removeCookie(name: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; path=/; max-age=0`
}

export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))
  if (!match) return undefined
  const value = match.slice(name.length + 1)
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}
