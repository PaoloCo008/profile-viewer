export const BASE_ENDPOINT = 'http://localhost:3001'
export const JSON_PLACEHOLDER_ENDPOINT = 'https://jsonplaceholder.typicode.com'

export const zipcodePatters = [
  /^[0-9]{5}(-[0-9]{4})?$/,
  /^[A-Za-z]\d[A-Za-z][\s-]?\d[A-Za-z]\d$/,
  /^[0-9]{4,5}$/,
  /^[A-Za-z0-9\s-]{3,12}$/,
]

export const phonePatterns = [
  /^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
  /^\+[1-9]\d{1,14}$/,
  /^[\+]?[(]?[\+]?\d{1,4}[)]?[\s\-]?[(]?\d{1,6}[)]?[\s\-]?\d{1,6}[\s\-]?\d{1,6}[\s\-]?\d{0,6}$/,
  /^\d{7,15}$/,
]

export const websitePatterns = [
  /^https?:\/\/[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}(\/[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=%-]*)?$/,
  /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/,
  /^https?:\/\/localhost(:[0-9]+)?(\/.*)?$/,
  /^https?:\/\/127\.0\.0\.1(:[0-9]+)?(\/.*)?$/,
]
