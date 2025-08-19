<script lang="ts" setup>
import {
  watch,
  computed,
  reactive,
  ref,
  provide,
  onUnmounted,
  onMounted,
  type InjectionKey,
} from 'vue'
import { ElMessage, ElIcon, type FormInstance } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { useDebounceFn } from '@vueuse/core'
import type { UserForm } from '@/lib/types/forms'
import { useUserStore } from '@/stores/UserStore'
import { trimFormValues } from '@/lib/helpers'
import { useGlobalCitySearch } from '@/composables/useGlobalCitySearch'
import type { PostalCodeSuggestion } from '@/lib/types/geoNames'
import { userFormRules } from '@/lib/validation'

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

const isFormValid = ref(false)
const validationErrors = ref<Record<string, string[]>>({})

const {
  searchCityPostalCodes,
  loading: citySearchLoading,
  error: searchError,
} = useGlobalCitySearch()
const postalCodeSuggestions = ref<PostalCodeSuggestion[]>([])
const showPostalCodeSuggestions = ref(false)
const showSearchError = ref(false)
const lastSearchedCity = ref('')

const canSubmit = computed(() => {
  const isCityValid = () => {
    if (!userForm.city || userForm.city.length <= 2) return false

    if (showSearchError.value && searchError.value) return false

    if (userForm.zipcode && userForm.zipcode.trim().length > 0) return true

    return false
  }

  return (
    isFormValid.value &&
    !isSubmitting.value &&
    !userStore.loading &&
    !citySearchLoading.value &&
    Object.keys(validationErrors.value).length === 0 &&
    isCityValid()
  )
})

provide(OperationState, {
  isOperationInProgress: () => isSubmitting.value || userStore.loading,
})

const userFormRef = ref<FormInstance>()
const userForm = reactive<UserForm>({
  name: user?.name || 'Paolo Coñuelo',
  username: user?.username || 'test',
  email: user?.email || 'paolohenry008@gmail.com',
  street: user?.address.street || '38 Silver Road',
  suite: user?.address.suite || 'test',
  city: user?.address.city || '',
  zipcode: user?.address.zipcode || '',
  phone: user?.phone || '09178777471',
  website: user?.website || 'facebook.com',
  companyName: user?.company.name || 'test',
  catchPhrase: user?.company.catchPhrase || '',
  bs: user?.company.bs || '',
})

function clearError() {
  searchError.value = null
  showSearchError.value = false
}

const updateValidationStatus = async () => {
  if (!userFormRef.value) {
    isFormValid.value = false
    return
  }

  try {
    await userFormRef.value.validate()
    isFormValid.value = true
    validationErrors.value = {}
  } catch (errors) {
    isFormValid.value = false
    validationErrors.value = errors as Record<string, string[]>
  }
}

const debouncedValidationUpdate = useDebounceFn(updateValidationStatus, 300)

watch(
  [userForm, showSearchError, searchError, citySearchLoading],
  () => {
    debouncedValidationUpdate()
  },
  { deep: true, immediate: false },
)

const debouncedCitySearch = useDebounceFn(async (cityName: string) => {
  if (!cityName || cityName.length <= 2) {
    postalCodeSuggestions.value = []
    showPostalCodeSuggestions.value = false
    userForm.zipcode = ''
    clearError()
    return
  }

  try {
    clearError()
    lastSearchedCity.value = cityName

    const results = await searchCityPostalCodes(cityName)

    if (lastSearchedCity.value === cityName) {
      postalCodeSuggestions.value = results
      showPostalCodeSuggestions.value = results.length > 0

      const exactMatch = results.find((r) => r.placeName.toLowerCase() === cityName.toLowerCase())
      if (exactMatch && results.length === 1) {
        userForm.zipcode = exactMatch.postalCode
        showPostalCodeSuggestions.value = false
      } else if (results.length > 0) {
        userForm.zipcode = results[0].postalCode
      } else {
        userForm.zipcode = ''
        if (cityName.length > 2) {
          searchError.value = 'No postal codes found for this city'
          showSearchError.value = true
        }
      }
    }
  } catch (error) {
    if (lastSearchedCity.value === cityName) {
      console.warn('City search failed:', error)
      userForm.zipcode = ''
      showSearchError.value = true
    }
  }
}, 800)

watch(
  () => userForm.city,
  (newCity) => {
    if (newCity !== lastSearchedCity.value) {
      clearError()
      showPostalCodeSuggestions.value = false
    }
    debouncedCitySearch(newCity)
  },
  { immediate: false },
)

const selectPostalCode = (suggestion: PostalCodeSuggestion): void => {
  userForm.zipcode = suggestion.postalCode
  userForm.city = suggestion.placeName
  showPostalCodeSuggestions.value = false
  clearError()
  lastSearchedCity.value = suggestion.placeName
}

async function submitForm(formEl: FormInstance | undefined) {
  if (!formEl || isSubmitting.value || !canSubmit.value) return

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
  postalCodeSuggestions.value = []
  showPostalCodeSuggestions.value = false
  clearError()
  lastSearchedCity.value = ''
  setTimeout(() => {
    updateValidationStatus()
  }, 100)
}

onMounted(() => {
  setTimeout(() => {
    updateValidationStatus()
  }, 100)
})

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
      :rules="userFormRules"
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

              <!-- City suggestions dropdown -->
              <div
                v-if="showPostalCodeSuggestions && postalCodeSuggestions.length > 0"
                class="postal-suggestions"
              >
                <div class="suggestion-header">
                  <small>Found postal codes for this city (GeoNames):</small>
                </div>
                <div
                  v-for="suggestion in postalCodeSuggestions.slice(0, 5)"
                  :key="`${suggestion.postalCode}-${suggestion.placeName}`"
                  class="suggestion-item"
                  @click="selectPostalCode(suggestion)"
                >
                  <strong>{{ suggestion.postalCode }}</strong>
                  <span class="suggestion-address">{{ suggestion.fullAddress }}</span>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Zipcode" prop="zipcode">
              <el-input
                v-model="userForm.zipcode"
                :disabled="true"
                :loading="citySearchLoading"
                placeholder="Select city first"
                readonly
              >
                <template #suffix>
                  <el-icon v-if="citySearchLoading" class="is-loading">
                    <Loading />
                  </el-icon>
                </template>
              </el-input>

              <div
                v-if="
                  showSearchError &&
                  searchError &&
                  !citySearchLoading &&
                  userForm.city &&
                  userForm.city.length > 2
                "
                class="search-error"
              >
                <small
                  >{{ searchError }} - Submit button disabled until valid city is selected</small
                >
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
          :disabled="!canSubmit"
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
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.primary {
  background: #1a1a1a;
  color: white;
}

.primary:disabled {
  background: #ccc;
  color: #999;
  cursor: not-allowed;
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

/* Postal code suggestions styling */
.postal-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
}

.suggestion-header {
  padding: 8px 12px;
  background: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}

.suggestion-item {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.suggestion-item:hover {
  background-color: #f5f7fa;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-address {
  display: block;
  color: #606266;
  font-size: 0.9em;
  margin-top: 2px;
}

.search-status {
  margin-top: 4px;
  color: #409eff;
}

.search-error {
  margin-top: 4px;
  color: #f56c6c;
  font-size: 0.875rem;
}

.is-loading {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
