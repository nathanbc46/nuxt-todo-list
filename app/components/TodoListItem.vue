<script setup lang="ts">
const { getTodo } = useTodo()
const toast = useToast()

const props = defineProps<{
    todo: TodoList
}>()

const currentTodo = getTodo(props.todo.id)

function onItemTitleUpdated (id: string, newTitle: string) {
    currentTodo.updateItemTitle(id, newTitle)
    toast.add({ title: 'Item updated', color: 'success', duration: 1000 })
}

function onToggleItem(id: string, done: boolean | 'indeterminate') {
    if (done === 'indeterminate') return
    currentTodo.updateItemDone(id, done)
    toast.add({ title: 'Item updated', color: 'success', duration: 1000 })
}

function onRemoveItem(id: string) {
    currentTodo.removeItem(id)
    toast.add({ title: 'Item removed', color: 'success', duration: 1000 })
}

</script>
<template>
    <div>
        <ul>
            <li v-for="item in currentTodo.todo.items" :key="item.id">
                <div class="flex item-center gap-1">
                    <UCheckbox :model-value="item.done" @update:model-value="onToggleItem(item.id, $event)">
                        <template #label>
                            <span :class="{ 'line-through text-gray-400': item.done }">{{ item.title }}</span>
                        </template>
                    </UCheckbox>
                       <ModalUpdateTitle 
                        header-title="Edit Todo List Items" 
                        :previous-title="item.title"
                        description="Update todo list Items name" 
                        placeholder="Enter todo list Items name" 
                        @update="onItemTitleUpdated(item.id, $event)">
                           <Icon size="1.25em" name="material-symbols:edit" class="text-blue-500 min-w-6 cursor-pointer" />
                        </ModalUpdateTitle>  
                        
                        <ModalConfirm
                            description="Are you sure you want to delete this todo list item?"
                            :title="item.title"
                            confirm-color="error"
                            @confirmed="onRemoveItem(item.id)" >
                            <Icon 
                            size="1.25em" name="material-symbols:delete-forever-rounded" 
                            class="text-red-500 min-w-6 cursor-pointer"
                            />
                        </ModalConfirm>
                    
                </div>
            </li>
        </ul>
    </div>
</template>