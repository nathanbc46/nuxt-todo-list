import { z } from 'zod'
const schema = z.object({
    id: z.uuid()
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

    const data = await prisma.todoListItem.delete({
        where: { id: parseResult.data.id, todoList: { userId: user.id } }
    })

    return { data }
})