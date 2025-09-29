<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
const {user, logout } = useUser()
const toast = useToast()

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
    },
    {
        label: 'Sign Up',
        icon: 'i-lucide-user-plus',
        to: '/sign-up',
    },
    {
        label: 'Sign In',
        icon: 'i-lucide-log-in',
        to: '/login',
    }
] satisfies NavigationMenuItem[]

// 🔑 ซ่อนเมนู Sign In เมื่อ user ล็อกอินแล้ว
const filteredItems = computed(() =>
  user.value
     ? items.filter(i => !['Sign Up', 'Sign In'].includes(i.label))
    : items
)

async function onLogout() {
    //if (confirm('Are you sure you want to logout?')) {
        logout()
        await navigateTo('/')
        toast.add({
            title: 'Logged out',
            description: 'You have been logged out successfully.',
            color: 'success',
            duration: 1000,
        })
    //}
}

</script>
<template>
    <div class="p-5">
        <UHeader title="Nathan Todo List">
            <!-- <UNavigationMenu :items="items" class="w-full justify-center">
                <template #components-trailing>
                    <ColorModeButton />
                </template>
            </UNavigationMenu> -->
            
            <UNavigationMenu :items="filteredItems" />
            <template #right>
                <UAvatar v-if="user" :image="user.image" />
                {{  user?.name }}
                <UTooltip v-if="user" text="Logout" :kbds="['meta', 'L']" >
                <UButton 
                    color="neutral" variant="ghost" 
                        icon="i-lucide-log-out" aria-label="Logout"
                        @click="onLogout" />
                    </UTooltip>
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