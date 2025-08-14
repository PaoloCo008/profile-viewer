import type { StringValidatorOptions } from '../types/validators'

export function stringValidator(
  fieldName: string,
  {
    minLength = 0,
    maxLength = Infinity,
    pattern,
    patternMessage = `${fieldName} contains invalid characters`,
    required = true,
  }: StringValidatorOptions = {},
) {
  return (rule: any, value: any, callback: any) => {
    const trimmed = value?.trim() || ''

    if (!required && trimmed.length === 0) {
      callback()
      return
    }

    if (required && trimmed.length === 0) {
      callback(new Error(`${fieldName} cannot be empty or contain only spaces.`))
    } else if (minLength && trimmed.length < minLength) {
      callback(
        new Error(`${fieldName} must be at least ${minLength} characters (excluding spaces).`),
      )
    } else if (maxLength && trimmed.length > maxLength) {
      callback(new Error(`${fieldName} cannot exceed ${maxLength} characters.`))
    } else if (pattern) {
      let isValid

      if (Array.isArray(pattern)) {
        isValid = pattern.some((p) => p.test(trimmed))
      } else {
        isValid = pattern.test(trimmed)
      }

      if (!isValid) {
        callback(new Error(patternMessage))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
}
