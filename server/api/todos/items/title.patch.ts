import { z } from 'zod'
const schema = z.object({
    id: z.uuid(),
    title: z.string().min(1).max(100)
})

export default defineEventHandler(async (event) => {
    const user = await getCurrentUser(event)
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }
    const body = await readBody(event)
    const parseResult = schema.safeParse(body)
    if (!parseResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid request body',
            data: parseResult.error
        })
    }

    const data = await prisma.todoListItem.update({
        where: { id: parseResult.data.id, todoList: { userId: user.id } },
        data: { title: parseResult.data.title }
    })
 
    return { data }
})