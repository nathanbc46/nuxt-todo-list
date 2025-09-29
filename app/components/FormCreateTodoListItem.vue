<script setup lang="ts">
const { getTodo } = useTodo()
const toast = useToast()
const title = ref<string>('')

const props = defineProps<{
    todoId: string
}>()

const currentTodo = getTodo(props.todoId)

function onTodoItemCreate() {
    currentTodo.addItem(title.value)
    if (!title.value) return
    toast.add({
        title: 'Success',
        description: 'Your action was completed successfully.',
        color: 'success',
        duration: 1000,
        icon: 'i-lucide-check'
    })
    title.value = ''
}


/* function onTodoCreate() {
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
} */
</script>
<template>
    <form @submit.prevent="onTodoItemCreate()">
        <div class="flex gap-2">
            <UInput v-model="title" class="w-full" placeholder="Enter todo list Item name" />
            <UButton  color="primary" type="submit"><Icon name="material-symbols:add" />Item</UButton>
        </div>
    </form>


</template>