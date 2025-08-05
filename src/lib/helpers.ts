import type { FormatAddress } from './types/helpers'

export function formatAddress({ suite, street, city, zipcode }: FormatAddress) {
  return `${suite}, ${street}, ${city}, ${zipcode}`
}

export function handleApiError(res: Response, action: string) {
  if (res.status === 404) {
    throw new Error('User not found')
  } else if (res.status === 403) {
    throw new Error('Permission denied')
  } else if (res.status >= 500) {
    throw new Error('Server error')
  } else if (res.status === 409) {
    throw new Error('User already exists')
  } else {
    throw new Error(`${action} failed`)
  }
}
