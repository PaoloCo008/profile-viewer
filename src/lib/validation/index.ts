import { type FormRules } from 'element-plus'
import type { UserForm } from '@/lib/types/forms'
import { stringValidator } from '@/lib/validators'
import { phonePatterns } from '@/lib/constants'
import { reactive } from 'vue'

export const userFormRules = reactive<FormRules<UserForm>>({
  name: [
    { required: true, message: 'Please enter your name.', trigger: 'change' },
    {
      validator: stringValidator('Name', {
        minLength: 2,
        maxLength: 50,
        pattern: /^[\p{L}\s'-]+$/u,
        patternMessage: 'Name can only contain letters, spaces, hyphens, and apostrophes.',
      }),
      trigger: 'change',
    },
  ],

  username: [
    { required: true, message: 'Please enter your username.', trigger: 'change' },
    {
      validator: stringValidator('Username', {
        minLength: 3,
        maxLength: 20,
        pattern: /^[a-zA-Z0-9_-]+$/,
        patternMessage: 'Username can only contain letters, numbers, underscores, and hyphens.',
      }),
      trigger: 'change',
    },
  ],

  email: [
    { required: true, message: 'Please enter your email.', trigger: 'change' },
    {
      validator: stringValidator('Email', {
        minLength: 5,
        maxLength: 254,
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        patternMessage: 'Please enter a valid email format.',
      }),
      trigger: 'change',
    },
  ],

  street: [
    { required: true, message: 'Please enter your street address.', trigger: 'change' },
    {
      validator: stringValidator('Street Address', {
        minLength: 5,
        maxLength: 150,
        pattern: /^[\p{L}\p{N}\s,.-]+$/u,
        patternMessage:
          'Street Address can only contain letters, numbers, commas, periods, and hyphens.',
      }),
      trigger: 'change',
    },
  ],

  suite: [
    {
      validator: stringValidator('Suite/apartment number', {
        maxLength: 20,
        pattern: /^[\p{L}\p{N}\s#-.,]+$/u,
        patternMessage:
          'Suite/apartment number can only contain letters, numbers, spaces, hyphens, #, periods, and commas.',
        required: false,
      }),
      trigger: 'change',
    },
  ],

  city: [
    { required: true, message: 'Please enter your city.', trigger: 'change' },
    {
      validator: stringValidator('City', {
        minLength: 2,
        maxLength: 50,
        pattern: /^[\p{L}\s'.-]+$/u,
        patternMessage: 'City can only contain letters, spaces, hyphens, apostrophes, and periods.',
      }),
      trigger: 'change',
    },
  ],

  phone: [
    { required: true, message: 'Please enter your phone number.', trigger: 'change' },
    {
      validator: stringValidator('Phone Number', {
        minLength: 7,
        maxLength: 25,
        pattern: phonePatterns,
        patternMessage:
          'Please enter a valid phone number (7-25 characters, digits and basic formatting allowed).',
      }),
      trigger: 'change',
    },
  ],

  website: [
    {
      validator: stringValidator('Website URL', {
        maxLength: 200,
        pattern: /^(https?:\/\/)?([a-zA-Z0-9.-]+\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/i,
        patternMessage: 'Please enter a valid website URL.',
        required: false,
      }),
      trigger: 'change',
    },
  ],

  companyName: [
    { required: true, message: 'Please enter your company name.', trigger: 'change' },
    {
      validator: stringValidator('Company name', {
        minLength: 2,
        maxLength: 100,
        pattern: /^[\p{L}\p{N}\s&.,'-]+$/u,
        patternMessage: 'Company name contains invalid characters.',
      }),
      trigger: 'change',
    },
  ],

  catchPhrase: [
    {
      validator: stringValidator('Company catch phrase', {
        maxLength: 200,
        required: false,
      }),
      trigger: 'change',
    },
    {
      validator: (rule, value, callback) => {
        if (value && value.trim().split(' ').length < 3) {
          callback(new Error('Catch phrase should contain at least 3 words.'))
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],

  bs: [
    {
      validator: stringValidator('Business speak/strategy', {
        maxLength: 300,
        required: false,
      }),
      trigger: 'change',
    },
    {
      validator: (rule, value, callback) => {
        if (value && value.trim().split(' ').length < 5) {
          callback(new Error('Business strategy should be more descriptive (at least 5 words).'))
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
})
