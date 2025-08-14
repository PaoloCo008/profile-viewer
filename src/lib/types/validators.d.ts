export interface StringValidatorOptions {
  minLength?: number
  maxLength?: number
  pattern?: RegExp | RegExp[]
  patternMessage?: string
  required?: boolean
}
