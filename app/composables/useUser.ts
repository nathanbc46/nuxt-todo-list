import type { User } from 'better-auth'

export function useUser() {
    const user = useState<User | null>('user', () => null)

    async function getCurrentUser() {
        //HTTP Client เรียกต่อหลายครั้ง 
        //Web browser (cookie) ==> https://localhost:3000/ (Nuxt)
        //Nuxt (Cookie) ==> Better Auth (Cookie)
        //Better Auth ==> Database
        try {
            const session = await authClient.getSession({
                fetchOptions: {
                    headers: useRequestHeaders(['cookie'])
                }
            })
            if (session.error || !session.data) {
                user.value = null
                return
            } else {
                user.value = session.data.user
            }
        } catch (error) {
            console.error(error)
            user.value = null
            return
        }
    }

    async function login(email: string, password: string) {
        const { data, error } = await authClient.signIn.email({ email, password })
        if (error) {
            throw new Error(error.message || 'Login failed')
        }
        await getCurrentUser()
        const { loadTodoListFromOnline } = useTodo()
        await loadTodoListFromOnline()
        return data
    }

    async function logout() {
        await authClient.signOut()
        user.value = null
        const { clearTodoListOnline } = useTodo()
        clearTodoListOnline()
    }

    return {
        user,
        getCurrentUser,
        login,
        logout
    }
}