<script setup lang="ts">
const props = defineProps<{
    headerTitle : string,
    previousTitle : string,
    description : string,
    placeholder : string,
}>()

const emit = defineEmits<{
    update: [newtitle: string]
}>()

const title = ref(props.previousTitle)
const open = ref(false)

const onUpdate = () => {
    emit('update', title.value) //ส่งข้อมูล title ไปยัง Parent
    open.value = false
}


</script>
<template>
    <UModal 
    v-model:open="open" :title="props.headerTitle" 
    :description="props.description" 
    :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full'
    }" :ui="{
            content: 'max-w-sm'
        }">

        <slot />
        <template #body>
            <form @submit.prevent="onUpdate">
                <div class="flex gap-1">
                    <UInput v-model="title" class="w-full" :placeholder="props.placeholder" />
                    <UButton color="primary" type="submit">Update</UButton>
                </div>

            </form>
        </template>
    </UModal>
</template>