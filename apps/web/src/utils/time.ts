import { format, toZonedTime } from 'date-fns-tz'
import { ko } from 'date-fns/locale'
import { padStart } from './string'

export function currentDate() {
  return new Date()
}

export function convertUTCtoLocaleDate(date: string | number | Date) {
  const utcDate = new Date(date + 'Z')
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const zonedDate = toZonedTime(utcDate, timeZone)
  return zonedDate
}

export function formatDate({
  date,
  formatStr,
  convertUTCtoLocale,
}: {
  date: string | number | Date
  formatStr: string
  convertUTCtoLocale?: boolean
}) {
  if (!convertUTCtoLocale) {
    return format(date, formatStr, { locale: ko })
  }

  return format(convertUTCtoLocaleDate(date), formatStr, { locale: ko })
}

export function timezoneFormatDate(date: string | number | Date, formatStr: string) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return format(date, formatStr, { locale: ko, timeZone })
}

export function timerFormat({
  days,
  hours,
  minutes,
  seconds,
}: {
  days: number
  hours: number
  minutes: number
  seconds: number
}) {
  if (days > 0) {
    return `D-${days}`
  }

  return `${padStart(days)} : ${padStart(hours)} : ${padStart(minutes)} : ${padStart(seconds)}`
}
