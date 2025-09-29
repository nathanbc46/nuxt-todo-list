<script setup lang="ts">
const { addTodo } = useTodo()
const toast = useToast()
const title = ref<string>('')

function onTodoCreate() {
    if (!title.value) return
    addTodo(title.value)
    toast.add({
        title: 'Success',
        description: 'Your action was completed successfully.',
        color: 'success',
        duration: 1000,
        icon: 'i-lucide-check'
    })
    title.value = ''
}
</script>
<template>
    <form @submit.prevent="onTodoCreate()">
        <div class="flex gap-2">
            <UInput v-model="title" class="w-full" placeholder="Enter todo list name" />
            <UButton color="primary" type="submit"><Icon name="material-symbols:add" /> Create</UButton>
        </div>
    </form>


</template>