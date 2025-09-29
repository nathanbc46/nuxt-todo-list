export default defineEventHandler(async (event) => {
    const user = await getCurrentUser(event)
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }
    const data = await prisma.todoList.findMany({
        where: {
            userId: user.id
        },
        include: {
            items: true
        }
    })
    return { data };
});