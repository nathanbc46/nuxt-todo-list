import { z } from "zod"

const schema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Title cannot be empty')
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
    const parsed = await schema.safeParseAsync(body)
    if (parsed.error) {
        console.error(parsed.error)
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid request body',
            data: parsed.error
        })
    }
    const data = await prisma.todoList.update({
        where: {
            id: parsed.data.id,
            userId: user.id
        },
        data: {
            title: parsed.data.title
        }
    })
    return { data }
})