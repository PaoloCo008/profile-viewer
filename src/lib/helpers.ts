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

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function createNameFromEmail(email: string): string {
  const emailUsername = email.split('@')[0]

  let firstName: string
  let lastName: string

  if (emailUsername.includes('.') || emailUsername.includes('_')) {
    const parts = emailUsername.split(/[._]/)
    firstName = parts[0]
    lastName = parts[1] || emailUsername.split('@')[1]?.split('.')[0] || 'User'
  } else {
    firstName = emailUsername
    lastName = email.split('@')[1]?.split('.')[0] || 'User'
  }

  const capitalize = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  return `${capitalize(firstName)} ${capitalize(lastName)}`
}

export function randomCommentCount(maxComments: number) {
  const random = Math.random()
  if (random < 0.2) return 0
  if (random < 0.4) return Math.floor(Math.random() * 2) + 1
  if (random < 0.7) return Math.floor(Math.random() * 3) + 2
  return Math.floor(Math.random() * (maxComments - 2)) + 3
}

export async function fetchWithErrorHandling(
  url: string,
  errorMessage: string,
  controller: AbortController,
) {
  const res = await fetch(url, { signal: controller?.signal })
  if (!res.ok) {
    handleApiError(res, errorMessage)
    return null
  }
  return res.json()
}

export function toSingleDecimal(num: number) {
  while (num >= 1) {
    num = num / 10
  }
  return Math.round(num * 10) / 10
}
