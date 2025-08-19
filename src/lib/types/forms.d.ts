export interface UserForm {
  name: string
  username: string
  email: string
  street: string
  suite: string
  city: string
  zipcode: string
  phone: string
  website: string
  companyName: string
  catchPhrase: string
  bs: string
}

export interface ValidationError {
  message: string
  field: string
}

export type ValidationErrors = Record<string, string[]>
