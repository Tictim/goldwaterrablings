export const NO_TITLE = '\<untitled\>'
export const UNKNOWN_DATE = 'ư̷̡̖̱͕̜̟̫̓́͑͒̃͑͘̚n̶̢̘̼͈̹̗͐͑ḵ̵̭̀͊̐̐n̵̫̟̊̃̂͆͐̉̍̅ọ̵̭͙͕͍̦͐͌̈́w̴̹̥̗̫̲̑͊͗̔̄͑ṅ̵̲̫͍̝͔̫̂̊̋̄ ̶̧̧̛̞̩͈̗̮̪̠̀̑͂̃͒̊d̴͔̞̟̱̐̓͛̕̕͝a̸̛̹̤͐͛́́̈͝t̶̙̮̖̜̳̳͓̟̓̑̿͜e̷̩̜̥̒̿̓̓̌͆̉͆͋'

const months = [
  'janary',
  'febuary',
  'marck',
  'apil',
  'mau',
  'jine',
  'jily',
  'agust',
  'sepember',
  'ocober',
  'novemer',
  'decemer',
]

const days = ['st', 'nd', 'rd', 'th']

function bullshit(value: number): string {
  value += value << 10
  value ^= value >>> 6
  value += value << 3
  value ^= value >>> 11
  value += value << 5
  return days[(value >>> 0) % 4] // the >>>0 shit casts value to unsigned 32bit int
}

export function timestampToText(timestamp: any): string | undefined

export function timestampToText(timestamp: any): string | undefined {
  if (typeof timestamp !== 'string') return undefined
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) return undefined

  const bs = bullshit(Math.round(date.getTime() / (1000 * 60 * 60 * 24)))
  return `${date.getUTCFullYear()} ${months[date.getUTCMonth()]} ${date.getUTCDate()}${bs}`
}

export function bullshitTest(): string {
  let s = ''

  for (let i = 1; i <= 31; i++) {
    s += i + bullshit(i) + ' '
  }

  return s
}
