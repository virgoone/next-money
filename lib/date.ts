import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

export function getDate(timezone = 'Asia/Shanghai'): dayjs.Dayjs {
  return dayjs().tz(timezone)
}

export function formatDate(
  date?: string | number | Date | dayjs.Dayjs | null | undefined,
  format = 'YYYY-MM-DD HH:mm:ss',
) {
  return dayjs(date).format(format)
}

export function formatUTCDate(
  date?: string | number | Date | dayjs.Dayjs | null | undefined,
  format = 'YYYY-MM-DD HH:mm:ss',
  timezone = 'Asia/Shanghai',
) {
  return dayjs.utc(date).tz(timezone).format(format)
}
