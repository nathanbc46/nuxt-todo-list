<script setup lang="ts">
const { user } = useUser() // ดึงข้อมูล user จาก composable
const { todos, updateTodoTitle, removeTodo, syncTodo } = useTodo()
const toast = useToast()

// Props // รับข้อมูลมาจาก Parent
const props = defineProps<{
    title: string,
    subtitle: string
}>()

function onTodoTitleUpdated(id: string, newTitle: string) {
    updateTodoTitle(id, newTitle)
    toast.add({ title: 'Todo updated', color: 'success', duration: 1000 })
}

function onRemoveTodo(id: string) {
    removeTodo(id)
    toast.add({ title: 'Todo removed', color: 'success', duration: 1000 })
}

const syncBtnLoading = ref(false)

async function onSyncTodo(id: string) {
    // Call syncTodo from useTodo composable
    syncBtnLoading.value = true
    try {
        const res = await syncTodo(id)
        if (res) {
            toast.add({ title: res.message , color: 'success' })
        }

    } catch (error) {
        toast.add({ title: (error as Error).message || 'Failed to sync todo', color: 'error', duration: 2000 })
    }
    syncBtnLoading.value = false
}

</script>
<template>
    <div>
        <h1 class="text-2xl">
            <Icon name='material-symbols:checklist' /> {{ props.title }} : <small>{{ props.subtitle }}</small>
        </h1>
        <ClientOnly>
            <ul v-if="todos.length > 0" class="flex flex-col gap-2 mt-4">
                <li v-for="item in todos" :key="item.id" class="shadow-lg p-2 rounded-md">
                    <header class="flex justify-between">
                        <span class="font-bold">{{ item.title }}</span>
                        <div class="flex gap-1 items-center">
                            <div class="text-xs mr-1">
                                <span>Mode :</span>
                                <span :class="item.onlinemode ? 'text-green-500' : 'text-red-500'">
                                    {{ item.onlinemode ? 'Online' : 'Offline' }}</span>

                            </div>
                            <UButton 
                            v-if="!item.onlinemode && user" color="secondary" class="px-2 py-1 text-xs ml-2"
                                :loading="syncBtnLoading" @click="onSyncTodo(item.id)">Sync</UButton>
                            <ModalUpdateTitle 
                            header-title="Edit Todo List" :previous-title="item.title"
                                description="Update todo list name" placeholder="Enter todo list name"
                                @update="onTodoTitleUpdated(item.id, $event)">
                                <UButton color="secondary" class="px-2 py-1 text-xs">Updata Title</UButton>
                            </ModalUpdateTitle>

                            <ModalConfirm 
                            description="Are you sure you want to delete this todo?" :title="item.title"
                                confirm-color="error" @confirmed="onRemoveTodo(item.id)">
                                <UButton color="error" class="px-2 py-1 text-xs">Delete</UButton>
                            </ModalConfirm>

                        </div>
                    </header>
                    <main class="mt-2">
                        <TodoListItem :todo="item" />
                        <div class="mt-4">
                            <FormCreateTodoListItem :todo-id="item.id" />
                        </div>
                    </main>
                </li>
            </ul>

            <p v-else class="mt-4 italic text-gray-500">
                <Icon name="material-symbols:info-rounded" /> No todo list found.
            </p>
        </ClientOnly>

        <div class="p-5 mt-4">
            <h2 class="text-2xl mb-2">
                <Icon name='material-symbols:add' /> Create Todo List
            </h2>
            <FormCreateTodoList />
        </div>

        <DevOnly>
            <ClientOnly>
                <pre class="mt-4 p-4 bg-gray-100 rounded-lg overflow-x-auto">
                {{ todos }}
            </pre>
            </ClientOnly>
        </DevOnly>
    </div>
</template>