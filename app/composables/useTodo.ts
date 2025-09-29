import { v4 as uuidv4 } from 'uuid'

export interface TodoListItems {
    id: string
    title: string
    done: boolean
}

export interface TodoList {
    id: string
    onlinemode: boolean
    title: string
    items: TodoListItems[]
}

let todos: Ref<TodoList[]>

export function useTodo() {

    const { user } = useUser()
    const { start, finish } = useLoadingIndicator()

    //singleton pattern
    if (!todos) {
        todos = useState<TodoList[]>('todo', () => [])
        // Save to local storage
        watch(todos, (newtodos) => {
            const offlineNewtodos = newtodos.filter((todo) => !todo.onlinemode)
            const data = JSON.stringify(offlineNewtodos)
            localStorage.setItem('todo', data)
            //console.log(newtodos)
        }, { deep: true })
    }

    function loadTodoListFromLocalStorage() {
        const data = localStorage.getItem('todo')
        if (data) {
            // validate data
            todos.value = JSON.parse(data)
        }
    }

    async function loadTodoListFromOnline() {
        if (!user.value) {
            return
        }
        start({ force: true })
        const { data } = await $fetch<{ data: TodoList[] }>('/api/todos')
        
        const offlineTodos = todos.value.filter((todo) => !todo.onlinemode)
        todos.value = data.map((todo) => ({
            id: todo.id,
            onlinemode: true,
            title: todo.title,
            items: todo.items.map((item) => ({
                id: item.id,
                title: item.title,
                done: item.done
            }))
        })).concat(offlineTodos)
        finish()
    }

    function clearTodoListOnline() {
        todos.value = todos.value.filter((todo) => !todo.onlinemode)
    }

    async function addTodo(title: string) {
        if (!title) return

        if (user.value) {
            // Create todo in the backend
            start({ force: true })
            const todo = await $fetch('/api/todos/create', {
                method: 'POST',
                body: { title }
            })
            finish()
            todos.value.push({
                ...todo,
                onlinemode: true,
                items: []
            })
        } else {
            // Offline mode   
            todos.value.push({
                id: uuidv4(),
                onlinemode: user.value ? true : false,
                title,
                items: []
            })
        }

    }

    async function removeTodo(id: string) {
        const todo = todos.value.find((item) => item.id === id)
        if (!todo) return

        if (user.value && todo.onlinemode) {
            start({ force: true })
            await $fetch('/api/todos', {
                method: 'DELETE',
                body: { id }
            })
            finish()
        }
        todos.value = todos.value.filter((item) => item.id !== id)
    }

    async function updateTodoTitle(id: string, newTitle: string) {
        if (!newTitle) return

        const todo = todos.value.find((item) => item.id === id)
        if (!todo) {
            return
        }

        if (user.value && todo.onlinemode) {
            start({ force: true })
            await $fetch<{ data: TodoList }>('/api/todos/title', {
                method: 'PATCH',
                body: { id, title: newTitle }
            })
            finish()
        }

        todo.title = newTitle

    }

    // getTodo สำหรับ การดึงข้อมูล todo Items
    function getTodo(id: string) {
        const todo = todos.value.find((item) => item.id === id)

        if (!todo) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Todo not found'
            })
        }

        const addItem = async (title: string) => {
            if (!title) return

            if (user.value && todo.onlinemode) {
                // Create item in the backend
                start({ force: true })
                const { data } = await $fetch('/api/todos/items', {
                    method: 'POST',
                    body: { id, title }
                })
                finish()

                todo.items.push({
                    id: data.id,
                    title: data.title,
                    done: data.done
                })
            } else {
                todo.items.push({
                    id: uuidv4(),
                    title,
                    done: false
                })
            }

        }

        const removeItem = async (id: string) => {
            const item = todo.items.find((item) => item.id === id)
            if (!item) return

            if (user.value && todo.onlinemode) {
                // Remove item in the backend
                start({ force: true })
                await $fetch('/api/todos/items', {
                    method: 'DELETE',
                    body: { id }
                })
                finish()
            }
            todo.items = todo.items.filter((item) => item.id !== id)
        }

        const updateItemTitle = async (id: string, newTitle: string) => {
            if (!newTitle) return

            const item = todo.items.find((item) => item.id === id)
            if (!item) return

            if (user.value && todo.onlinemode) {
                // Update item in the backend
                start({ force: true })
                await $fetch('/api/todos/items/title', {
                    method: 'PATCH',
                    body: { id, title: newTitle }
                })
                finish()

            }
            todo.items = todo.items.map((item) => {
                if (item.id === id) {
                    item.title = newTitle
                }
                return item
            })
        }

        const updateItemDone = (id: string, done: boolean) => {

            const item = todo.items.find((item) => item.id === id)
            if (!item) return

            if (user.value && todo.onlinemode) {
                start({ force: true })
                // Update item in the backend
                $fetch('/api/todos/items/done', {
                    method: 'PATCH',
                    body: { id, done }
                })
                finish()
            }

            todo.items = todo.items.map((item) => {
                if (item.id === id) {
                    item.done = done
                }
                return item
            })
        }

        return { todo, addItem, removeItem, updateItemTitle, updateItemDone }
    }

    async function syncTodo(id: string) {
        const { todo } = getTodo(id)

        console.log('Syncing todo:', todo)

        if (todo.onlinemode) {
            //throw new Error('Todo is already in online mode')
            return
        }
        if (!user.value) {
            //throw new Error('User not logged in')
            return
        }
        start({ force: true })
        const { message } = await $fetch('/api/todos/sync', {
            method: 'POST',
            body: {
                id,
                title: todo.title,
                items: todo.items
            }
        })
        finish()

        //Return to online mode
        todo.onlinemode = true

        return { message }
    }

    return {
        todos,
        addTodo,
        removeTodo,
        updateTodoTitle,
        getTodo,
        loadTodoListFromLocalStorage,
        syncTodo,
        loadTodoListFromOnline,
        clearTodoListOnline
    }
}