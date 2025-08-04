<script lang="ts" setup>
import { reactive, ref } from 'vue'

import type { FormInstance, FormRules } from 'element-plus'

interface UserForm {
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

const userFormRef = ref<FormInstance>()
const userForm = reactive<UserForm>({
  name: '',
  username: '',
  email: '',

  street: '',
  suite: '',
  city: '',
  zipcode: '',

  phone: '',
  website: '',

  companyName: '',
  catchPhrase: '',
  bs: '',
})

const rules = reactive<FormRules<UserForm>>({
  name: [{ required: true, message: 'Please enter your name.', trigger: 'blur' }],

  username: [
    {
      required: true,
      message: 'Please enter your username.',
      trigger: 'change',
    },
  ],

  email: [
    {
      required: true,
      message: 'Please enter your email.',
      trigger: 'change',
    },
  ],

  street: [
    {
      type: 'date',
      required: true,
      message: 'Please enter your complete street name.',
      trigger: 'change',
    },
  ],

  suite: [
    {
      type: 'date',
      required: true,
      message: 'Please enter your suite.',
      trigger: 'change',
    },
  ],

  city: [
    {
      required: true,
      message: 'Please enter your city.',
      trigger: 'change',
    },
  ],

  zipcode: [
    {
      type: 'array',
      required: true,
      message: 'Please enter your zipcode.',
      trigger: 'change',
    },
  ],

  phone: [
    {
      required: true,
      message: 'Please enter your phone number.',
      trigger: 'change',
    },
  ],

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
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<template>
  <el-form
    ref="userFormRef"
    style="max-width: 600px"
    :model="userForm"
    :rules="rules"
    label-width="auto"
    @submit.prevent="submitForm(userFormRef)"
  >
    <el-form-item label="Name" prop="name">
      <el-input v-model="userForm.name" />
    </el-form-item>

    <el-form-item label="Username" prop="username">
      <el-input v-model="userForm.username" />
    </el-form-item>

    <el-form-item label="Email" prop="email">
      <el-input v-model="userForm.email" />
    </el-form-item>

    <el-form-item label="Street" prop="street">
      <el-input v-model="userForm.street" />
    </el-form-item>

    <el-form-item label="Suite" prop="suite">
      <el-input v-model="userForm.suite" />
    </el-form-item>

    <el-form-item label="City" prop="city">
      <el-input v-model="userForm.city" />
    </el-form-item>

    <el-form-item label="Zipcode" prop="zipcode">
      <el-input v-model="userForm.zipcode" />
    </el-form-item>

    <el-form-item label="Phone" prop="phone">
      <el-input v-model="userForm.phone" />
    </el-form-item>

    <el-form-item label="Website" prop="website">
      <el-input v-model="userForm.website" />
    </el-form-item>

    <el-form-item label="Company name" prop="companyName">
      <el-input v-model="userForm.companyName" />
    </el-form-item>

    <el-form-item label="Company Catch Phrase" prop="catchPhrase">
      <el-input v-model="userForm.catchPhrase" type="textarea" />
    </el-form-item>

    <el-form-item label="Company Buisiness Speak / Strategy " prop="bs">
      <el-input v-model="userForm.bs" type="textarea" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" native-type="submit"> Create </el-button>
      <el-button @click="resetForm(userFormRef)">Reset</el-button>
    </el-form-item>
  </el-form>
</template>
