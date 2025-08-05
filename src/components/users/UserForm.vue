<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { UserForm } from '@/lib/types/forms'
import { useUserStore } from '@/stores/UserStore'

const props = defineProps<{ userId?: string }>()
const emit = defineEmits<{ (e: 'complete'): void }>()

const userStore = useUserStore()

const user = props.userId ? userStore.getUserById(props.userId) : undefined
const buttonLoading = ref(false)

const isEditting = computed(() => !!props.userId)

const userFormRef = ref<FormInstance>()
const userForm = reactive<UserForm>({
  name: user?.name || 'Test',
  username: user?.username || 'Test',
  email: user?.email || 'Test',
  street: user?.address.street || 'Test',
  suite: user?.address.suite || 'Test',
  city: user?.address.city || 'Test',
  zipcode: user?.address.zipcode || 'Test',
  phone: user?.phone || 'Test',
  website: user?.website || 'Test',
  companyName: user?.company.name || 'Test',
  catchPhrase: user?.company.catchPhrase || 'Test',
  bs: user?.company.bs || 'Test',
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

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  try {
    buttonLoading.value = true

    try {
      await formEl.validate()
    } catch (validationError) {
      return
    }

    if (isEditting.value) {
      await userStore.updateUser(props.userId as string, { ...userForm })
      ElMessage({
        type: 'success',
        message: 'User successfully updated',
      })
    } else {
      await userStore.createUser({ ...userForm })
      ElMessage({
        type: 'success',
        message: 'User successfully created',
      })
    }

    emit('complete')
  } catch (error) {
    let errorMessage = 'An unexpected error occurred. Please try again.'

    if (error.message?.includes('Network error')) {
      errorMessage = 'Unable to connect. Please check your internet connection.'
    } else if (error.message?.includes('User not found')) {
      errorMessage = 'User not found. Please refresh and try again.'
    } else if (error.message?.includes('Server error')) {
      errorMessage = 'Server is temporarily unavailable. Please try again later.'
    } else if (error.message) {
      errorMessage = error.message
    }

    ElMessage({
      type: 'error',
      message: errorMessage,
    })

    emit('complete')
  } finally {
    buttonLoading.value = false
  }
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
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
      <!-- Personal Information -->
      <div class="form-section">
        <h3>Personal Information</h3>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Name" prop="name">
              <el-input v-model="userForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Username" prop="username">
              <el-input v-model="userForm.username" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Email" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>
      </div>

      <!-- Address Information -->
      <div class="form-section">
        <h3>Address</h3>

        <el-row :gutter="16">
          <el-col :span="18">
            <el-form-item label="Street" prop="street">
              <el-input v-model="userForm.street" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Suite" prop="suite">
              <el-input v-model="userForm.suite" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="18">
            <el-form-item label="City" prop="city">
              <el-input v-model="userForm.city" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Zipcode" prop="zipcode">
              <el-input v-model="userForm.zipcode" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Contact Information -->
      <div class="form-section">
        <h3>Contact</h3>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Phone" prop="phone">
              <el-input v-model="userForm.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Website" prop="website">
              <el-input v-model="userForm.website" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- Company Information -->
      <div class="form-section">
        <h3>Company</h3>

        <el-form-item label="Company name" prop="companyName">
          <el-input v-model="userForm.companyName" />
        </el-form-item>

        <el-form-item label="Company Catch Phrase" prop="catchPhrase">
          <el-input v-model="userForm.catchPhrase" type="textarea" />
        </el-form-item>

        <el-form-item label="Company Business Speak / Strategy" prop="bs">
          <el-input v-model="userForm.bs" type="textarea" />
        </el-form-item>
      </div>

      <el-form-item>
        <el-button class="primary button" native-type="submit" :loading="buttonLoading">
          <span v-if="!buttonLoading">
            {{ isEditting ? 'Edit' : 'Create' }}
          </span>
          <span v-else>
            {{ isEditting ? 'Editing' : 'Creating' }}
          </span>
        </el-button>
        <el-button class="button" @click="resetForm(userFormRef)">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.primary {
  background: #1a1a1a;
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
}
</style>
