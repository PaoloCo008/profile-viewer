<script lang="ts" setup>
import { computed, reactive, ref, provide, onUnmounted, type InjectionKey } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { UserForm } from '@/lib/types/forms'
import { useUserStore } from '@/stores/UserStore'

const OperationStateKey: InjectionKey<{
  isOperationInProgress: () => boolean
}> = Symbol('OperationState')

const props = defineProps<{ userId?: string }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

const userStore = useUserStore()

const user = props.userId ? userStore.getUserById(props.userId) : undefined
const isEditting = computed(() => !!props.userId)

const isSubmitting = ref(false)
const abortController = ref<AbortController | null>(null)

provide(OperationStateKey, {
  isOperationInProgress: () => isSubmitting.value || userStore.loading,
})

const userFormRef = ref<FormInstance>()
const userForm = reactive<UserForm>({
  name: user?.name || 'test',
  username: user?.username || 'test',
  email: user?.email || 'test',
  street: user?.address.street || 'test',
  suite: user?.address.suite || 'test',
  city: user?.address.city || 'test',
  zipcode: user?.address.zipcode || 'test',
  phone: user?.phone || 'test',
  website: user?.website || 'test',
  companyName: user?.company.name || 'test',
  catchPhrase: user?.company.catchPhrase || 'test',
  bs: user?.company.bs || 'test',
})

const rules = reactive<FormRules<UserForm>>({
  name: [{ required: true, message: 'Please enter your name.', trigger: 'blur' }],
  username: [{ required: true, message: 'Please enter your username.', trigger: 'change' }],
  email: [{ required: true, message: 'Please enter your email.', trigger: 'change' }],
  street: [{ required: true, message: 'Please enter your street address.', trigger: 'change' }],
  suite: [{ required: true, message: 'Please enter your suite.', trigger: 'change' }],
  city: [{ required: true, message: 'Please enter your city.', trigger: 'change' }],
  zipcode: [{ required: true, message: 'Please enter your zipcode.', trigger: 'change' }],
  phone: [{ required: true, message: 'Please enter your phone number.', trigger: 'change' }],
  website: [{ required: true, message: 'Please enter your website.', trigger: 'blur' }],
  companyName: [{ required: true, message: 'Please enter your company name.', trigger: 'blur' }],
  catchPhrase: [
    { required: true, message: 'Please enter your companies catch phrase.', trigger: 'blur' },
  ],
  bs: [
    { required: true, message: 'Please enter your business speak / strategy.', trigger: 'blur' },
  ],
})

async function submitForm(formEl: FormInstance | undefined) {
  if (!formEl || isSubmitting.value) return

  try {
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
      await userStore.createUser({ ...userForm }, abortController.value)
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

onUnmounted(() => {
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
              <el-input v-model="userForm.city" :disabled="isSubmitting || userStore.loading" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Zipcode" prop="zipcode">
              <el-input v-model="userForm.zipcode" :disabled="isSubmitting || userStore.loading" />
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
