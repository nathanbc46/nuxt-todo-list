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

    const count = await prisma.todoList.count({
        where: {
            id: parseResult.data.id,
            userId: user.id
        }
    })

    if (count === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Todo list not found'
        })
    }
    // Create a new todo item
    const data = await prisma.todoListItem.create({
        data: {
            todoListId: parseResult.data.id,
            title: parseResult.data.title,
            done: false
        }
    })

    return { data }
})