<script setup lang="ts">

const toast = useToast()

const input = ref({
    email: '',
    password: '',
    name: ''
})

const loading = ref(false)

async function onSignUp() {
   loading.value = true
   const { data, error } = await authClient.signUp.email({
        ...input.value
    })
    if (error) {
        toast.add({
            title: 'Error',
            icon: 'i-lucide-alert-triangle',
            description: error.message,
            color: 'error'
        })
    }
    if (data) {
        toast.add({
            title: 'Success',
            icon: 'i-lucide-check',
            description: `Your account was created successfully.You can sign in now with ${data.user.email}.`,
            color: 'success'
        })
        await navigateTo('/login')
    }
    loading.value = false
}
</script>
<template>
    <div>
        <h1 class="text-2xl m-2">
            <UIcon name="i-lucide-user-plus" /> Sign Up
        </h1>
        <div class="flex items-center justify-center">
            <UForm class="w-full space-y-4 max-w-xs p-6 rounded-lg shadow" @submit.prevent="onSignUp">
                <UFormField label="Name" name="name">
                    <UInput v-model="input.name" class="w-full" type="text" placeholder="Enter your name" />
                </UFormField>
                <UFormField label="Email" name="email">
                    <UInput v-model="input.email" class="w-full" type="email" placeholder="Enter your email" />
                </UFormField>
                <UFormField label="Password" name="password">
                    <UInput v-model="input.password" class="w-full" type="password" placeholder="Enter your password" />
                </UFormField>
                <UButton color="primary" :loading="loading" type="submit" block>Sign Up</UButton>
            </UForm>
        </div>
    </div>
</template>