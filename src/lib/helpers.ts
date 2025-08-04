import type { FormatAddress } from './types/helpers'

export function formatAddress({ suite, street, city, zipcode }: FormatAddress) {
  return `${suite}, ${street}, ${city}, ${zipcode}`
}
