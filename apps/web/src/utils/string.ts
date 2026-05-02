export function padStart(value: number, length = 2) {
  return String(value).padStart(length, '0')
}
