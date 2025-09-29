<script setup lang="ts">
const toast = useToast()
const { login } = useUser()

const input = ref({
    email: '',
    password: ''
})

const loading = ref(false)

async function onSignIn() {
    try {
        loading.value = true
        const data = await login(input.value.email, input.value.password)
        toast.add({
            title: 'Success',
            icon: 'i-lucide-check',
            description: `You are signed in as ${data.user.email}.`,
            color: 'success'
        })
        await navigateTo('/')
    } catch (error) {
        toast.add({
            title: 'Error',
            icon: 'i-lucide-alert-triangle',
            description: (error as Error).message,
            color: 'error'
        })  
    }
    finally {
        loading.value = false
    }
}
</script>
<template>
    <div>
        <h1 class="text-2xl m-2">
            <UIcon name="i-lucide-log-in" /> Sign In
        </h1>
        <div class="flex items-center justify-center">
            <UForm class="w-full space-y-4 max-w-xs p-6 rounded-lg shadow" @submit.prevent="onSignIn">
                <UFormField label="Email" name="email">
                    <UInput v-model="input.email" class="w-full" type="email" placeholder="Enter your email" />
                </UFormField>
                <UFormField label="Password" name="password">
                    <UInput v-model="input.password" class="w-full" type="password" placeholder="Enter your password" />
                </UFormField>
                <UButton :loading="loading" color="primary" type="submit" block>Sign In</UButton>
            </UForm>
        </div>
    </div>
</template>