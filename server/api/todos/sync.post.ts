import { z } from "zod"

const schema = z.object({
    id: z.uuid(),
    title: z.string(),
    items: z.array(z.object({
        id: z.string(),
        title: z.string(),
        done: z.boolean()
    }))
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

    const data = parsed.data
    const count = await prisma.todoList.count({
        where: {
            id: data.id
        }
    })
    if (count > 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Todo list with this ID already exists'
        })
    }

    await prisma.todoList.create({
        data: {
            id: data.id,
            title: data.title,
            userId: user.id ,
            items: {
                createMany: { data: data.items }
            }
        }
    })
    return { message: `Todo list synced (${data.title})` }
})