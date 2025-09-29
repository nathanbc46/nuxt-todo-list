import { z } from 'zod'


const schema = z.object({
    title: z.string(),
    userId: z.string().optional()
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
   
    const data = await prisma.todoList.create({ 
        data: { 
            title: parsed.data.title,
            userId: user.id ,
        }
     })
    return data
})