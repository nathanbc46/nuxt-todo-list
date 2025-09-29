<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
const { user, logout } = useUser()
const toast = useToast()
const { start, finish } = useLoadingIndicator()
const logoutLoading = ref(false)

const items = [
    {
        label: 'Todo List',
        icon: 'i-lucide-house',
        to: '/',
    },
    {
        label: 'About',
        icon: 'i-lucide-info',
        to: '/about',
    }
] satisfies NavigationMenuItem[]

// 🔑 ซ่อนเมนู Sign In เมื่อ user ล็อกอินแล้ว
// const filteredItems = computed(() =>
//     user.value
//         ? items.filter(i => !['Sign Up', 'Sign In'].includes(i.label))
//         : items
// )

async function onLogout() {
    //if (confirm('Are you sure you want to logout?')) {
    logoutLoading.value = true
    start({ force: true })
    try {
        logout()
        toast.add({
            title: 'Logged out',
            description: 'You have been logged out successfully.',
            color: 'success',
            duration: 1000,
        })
        await navigateTo('/')
    } catch (error) {
        console.error(error)
        toast.add({
            title: 'Error',
            description: 'Failed to logout.',
            color: 'error',
            duration: 1000,
        })
    }
    finally {
        logoutLoading.value = false
        finish()
    }
}

</script>
<template>
    <div class="p-5">
        <UHeader title="Todo List">
            <!-- <UNavigationMenu :items="items" class="w-full justify-center">
                <template #components-trailing>
                    <ColorModeButton />
                </template>
</UNavigationMenu> -->

            <UNavigationMenu :items="items" />
            <template #right>
                <UAvatar v-if="user" :image="user.image" />
                {{ user?.name }}
                <UTooltip v-if="user" text="Logout" :kbds="['meta', 'L']">
                    <UButton 
                    color="neutral" variant="ghost" icon="i-lucide-log-out" aria-label="Logout"
                        :loading="logoutLoading"
                        @click="onLogout" />
                </UTooltip>
                <UButton 
                    v-if="!user"
                    color="neutral" variant="ghost" icon="i-lucide-user-plus" aria-label="Sign Up"
                        to="/sign-up" />
                <UButton 
                    v-if="!user"
                    color="neutral" variant="ghost" icon="i-lucide-key-round" aria-label="Login In"
                        to="/login" />
                <UColorModeButton />

                <!-- <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
                    <UButton 
                    color="neutral" variant="ghost" to="https://github.com/nuxt/ui" target="_blank"
                        icon="i-simple-icons-github" aria-label="GitHub" />
                </UTooltip> -->
            </template>
        </UHeader>
        <UContainer>
            <main>
                <slot />
            </main>
            <footer>
                @ {{ new Date().getFullYear() }} Nuxt.js
            </footer>
        </UContainer>
    </div>
</template>