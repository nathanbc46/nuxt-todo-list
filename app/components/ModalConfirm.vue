<script setup lang="ts">

const open = ref(false)

const props = defineProps<{
   title: string,
   description?: string,
   confirmColor?: "success" | "primary" | "secondary" | "info" | "warning" | "error" | "neutral",
}>()

const emit = defineEmits<{
    confirmed: []
}>()

function onConfirm () {
    open.value = false
    emit('confirmed')
}

</script>

<template>
    <UModal 
    v-model:open="open" 
    :title="props.title" 
    :description="props?.description"
    :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full'
    }" :ui="{
        content: 'max-w-sm'
    }">
        <slot />
        <!-- <UButton color="error" class="px-2 py-1 text-xs">Delete</UButton> -->
        <template #body>
            <div class="text-sm mb-5">{{ props.title }}</div>
            <div class="flex gap-2 justify-end">
                <UButton :color="confirmColor" class="px-2 py-1 text-xs" @click="onConfirm">Confirm</UButton>
                <UButton color="secondary" class="px-2 py-1 text-xs" @click="open = false">Cancel</UButton>
            </div>

        </template>
    </UModal>
</template>