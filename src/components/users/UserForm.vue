<script lang="ts" setup>
import { watch, computed, reactive, ref, provide, onUnmounted, type InjectionKey } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { UserForm } from '@/lib/types/forms'
import { useUserStore } from '@/stores/UserStore'
import { stringValidator } from '@/lib/validators'
import { phonePatterns, zipcodePatters } from '@/lib/constants'
import { trimFormValues } from '@/lib/helpers'

const OperationState: InjectionKey<{
  isOperationInProgress: () => boolean
}> = Symbol('OperationState')

const props = defineProps<{ userId?: string }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

const userStore = useUserStore()

const user = props.userId ? userStore.getUserById(props.userId) : undefined
const isEditting = computed(() => !!props.userId)

const isSubmitting = ref(false)
const abortController = ref<AbortController | null>(null)

provide(OperationState, {
  isOperationInProgress: () => isSubmitting.value || userStore.loading,
})

const userFormRef = ref<FormInstance>()
const userForm = reactive<UserForm>({
  name: user?.name || 'Paolo Co',
  username: user?.username || 'test',
  email: user?.email || 'paolohenry008@gmail.com',
  street: user?.address.street || '38 Silver Road',
  suite: user?.address.suite || 'test',
  city: user?.address.city || 'test',
  zipcode: user?.address.zipcode || 'test',
  phone: user?.phone || '09178777471',
  website: user?.website || 'facebook.com',
  companyName: user?.company.name || 'test',
  catchPhrase: user?.company.catchPhrase || '',
  bs: user?.company.bs || '',
})

const rules = reactive<FormRules<UserForm>>({
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

  zipcode: [
    { required: true, message: 'Please enter your zipcode.', trigger: 'change' },
    {
      validator: stringValidator('Zipcode', {
        minLength: 3,
        maxLength: 12,
        pattern: zipcodePatters,
        patternMessage: 'Please enter a valid zipcode format.',
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

async function submitForm(formEl: FormInstance | undefined) {
  if (!formEl || isSubmitting.value) return

  try {
    trimFormValues(userForm)

    try {
      await formEl.validate()
    } catch {
      return
    }

    abortController.value = new AbortController()
    isSubmitting.value = true

    if (isEditting.value) {
      await userStore.updateUser(props.userId as string, { ...userForm }, abortController.value)
      ElMessage({
        type: 'success',
        message: 'User successfully updated',
      })
    } else {
      await userStore.createUser(
        { ...userForm, zipcode: userForm.zipcode.toUpperCase() },
        abortController.value,
      )
      ElMessage({
        type: 'success',
        message: 'User successfully created',
      })
    }

    emit('complete')
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      ElMessage({
        type: 'info',
        message: 'Operation cancelled',
      })
      return
    }

    let errorMessage = 'An unexpected error occurred. Please try again.'

    if (error instanceof Error) {
      if (error.message?.includes('Network error')) {
        errorMessage = 'Unable to connect. Please check your internet connection.'
      } else if (error.message?.includes('User not found')) {
        errorMessage = 'User not found. Please refresh and try again.'
      } else if (error.message?.includes('Server error')) {
        errorMessage = 'Server is temporarily unavailable. Please try again later.'
      } else if (error.message) {
        errorMessage = error.message
      }
    }

    ElMessage({
      type: 'error',
      message: errorMessage,
    })
  } finally {
    isSubmitting.value = false
    abortController.value = null
  }
}

function resetForm(formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl.resetFields()
}

// function cancelOperation() {
//   if (abortController.value) {
//     abortController.value.abort()
//     abortController.value = null
//     isSubmitting.value = false
//   }
// }
import { useGlobalCitySearch } from '@/composables/useGlobalCitySearch'

const { searchCityPostalCodes, loading: citySearchLoading } = useGlobalCitySearch()
const postalCodeSuggestions = ref<any[]>([])

// Watch city input and fetch postal codes
watch(
  () => userForm.city,
  async (newCity) => {
    if (newCity && newCity.length > 2) {
      const results = await searchCityPostalCodes(newCity)
      postalCodeSuggestions.value = results

      // Auto-fill if exact match found
      const exactMatch = results.find((r) => r.placeName.toLowerCase() === newCity.toLowerCase())
      if (exactMatch && results.length === 1) {
        userForm.zipcode = exactMatch.postalCode
      }
    }
  },
  { debounce: 500 },
)

// Function to select postal code from suggestions
const selectPostalCode = (suggestion: any) => {
  userForm.zipcode = suggestion.postalCode
  userForm.city = suggestion.placeName
  // Optionally set country/state too
}

onUnmounted(() => {
  console.log('Log from onUnmounted')

  if (abortController.value) {
    abortController.value.abort()
  }
})
</script>

<template>
  <div class="form-container">
    <el-form
      ref="userFormRef"
      :model="userForm"
      :rules="rules"
      label-width="auto"
      @submit.prevent="submitForm(userFormRef)"
      label-position="top"
    >
      <div class="form-section">
        <h3>Personal Information</h3>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Name" prop="name">
              <el-input v-model="userForm.name" :disabled="isSubmitting || userStore.loading" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Username" prop="username">
              <el-input v-model="userForm.username" :disabled="isSubmitting || userStore.loading" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Email" prop="email">
          <el-input v-model="userForm.email" :disabled="isSubmitting || userStore.loading" />
        </el-form-item>
      </div>

      <div class="form-section">
        <h3>Address</h3>

        <el-row :gutter="16">
          <el-col :span="18">
            <el-form-item label="Street" prop="street">
              <el-input v-model="userForm.street" :disabled="isSubmitting || userStore.loading" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Suite" prop="suite">
              <el-input v-model="userForm.suite" :disabled="isSubmitting || userStore.loading" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="18">
            <el-form-item label="City" prop="city">
              <el-input
                v-model="userForm.city"
                :disabled="isSubmitting || userStore.loading"
                placeholder="Enter city name"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Zipcode" prop="zipcode">
              <el-autocomplete
                v-model="userForm.zipcode"
                :fetch-suggestions="
                  (query, cb) => {
                    const suggestions = postalCodeSuggestions.map((item) => ({
                      value: item.postalCode,
                      label: `${item.postalCode} - ${item.fullAddress}`,
                    }))
                    cb(suggestions)
                  }
                "
                :disabled="isSubmitting || userStore.loading"
                placeholder="Enter zipcode or select from suggestions"
                @select="(item) => (userForm.zipcode = item.value)"
                style="width: 100%"
              >
                <template #default="{ item }">
                  <div>
                    <strong>{{ item.value }}</strong>
                    <br />
                    <small>{{ item.label.split(' - ')[1] }}</small>
                  </div>
                </template>
              </el-autocomplete>

              <div v-if="citySearchLoading" class="text-sm text-gray-500 mt-1">
                Searching postal codes...
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="form-section">
        <h3>Contact</h3>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Phone" prop="phone">
              <el-input v-model="userForm.phone" :disabled="isSubmitting || userStore.loading" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Website" prop="website">
              <el-input v-model="userForm.website" :disabled="isSubmitting || userStore.loading" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="form-section">
        <h3>Company</h3>

        <el-form-item label="Company name" prop="companyName">
          <el-input v-model="userForm.companyName" :disabled="isSubmitting || userStore.loading" />
        </el-form-item>

        <el-form-item label="Company Catch Phrase" prop="catchPhrase">
          <el-input
            v-model="userForm.catchPhrase"
            type="textarea"
            :disabled="isSubmitting || userStore.loading"
          />
        </el-form-item>

        <el-form-item label="Company Business Speak / Strategy" prop="bs">
          <el-input
            v-model="userForm.bs"
            type="textarea"
            :disabled="isSubmitting || userStore.loading"
          />
        </el-form-item>
      </div>

      <el-form-item>
        <el-button
          class="primary button"
          native-type="submit"
          :loading="isSubmitting || userStore.loading"
          :disabled="isSubmitting || userStore.loading"
        >
          <span v-if="!(isSubmitting || userStore.loading)">
            {{ isEditting ? 'Edit' : 'Create' }}
          </span>
          <span v-else>
            {{ isEditting ? 'Editing' : 'Creating' }}
          </span>
        </el-button>

        <el-button
          class="button"
          @click="resetForm(userFormRef)"
          :disabled="isSubmitting || userStore.loading"
        >
          Reset
        </el-button>

        <!-- <el-button v-if="isSubmitting" class="button danger" @click="cancelOperation">
          Cancel Operation
        </el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.primary {
  background: #1a1a1a;
  color: white;
}

.danger {
  background: #dc2626;
  color: white;
}

.form-container {
  padding: 1rem 0.5rem;
}

.form-section {
  margin-bottom: 2rem;
  border-radius: 8px;
}

.form-section h3 {
  margin: 0 0 1rem 0;
  color: #495057;
  font-size: 1rem;
  font-weight: 600;
}

.button {
  width: 150px;
  margin-left: 8px;
}
</style>
