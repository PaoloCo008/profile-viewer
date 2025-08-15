export const BASE_ENDPOINT = 'http://localhost:3001'
export const JSON_PLACEHOLDER_ENDPOINT = 'https://jsonplaceholder.typicode.com'

export const zipcodePatters = [
  /^[0-9]{5}(-[0-9]{4})?$/,

  /^[A-Za-z]\d[A-Za-z][\s-]?\d[A-Za-z]\d$/,

  /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,

  /^\d{4}\s?[A-Z]{2}$/i,

  /^[0-9]{4,5}$/,

  /^[A-Z0-9]{3,10}(\s?[A-Z0-9]{2,4})?$/i,
]

export const phonePatterns = [
  /^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
  /^\+[1-9]\d{1,14}$/,
  /^[\+]?[(]?[\+]?\d{1,4}[)]?[\s\-]?[(]?\d{1,6}[)]?[\s\-]?\d{1,6}[\s\-]?\d{1,6}[\s\-]?\d{0,6}$/,
  /^\d{7,15}$/,
]
