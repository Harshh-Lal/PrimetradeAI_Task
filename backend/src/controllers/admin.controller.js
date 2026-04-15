import prisma from '../config/prisma.js'

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ success: true, count: users.length, users })
  } catch (err) {
    next(err)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } })
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' })

    await prisma.user.delete({ where: { id: parseInt(req.params.id) } })
    res.json({ success: true, message: 'User deleted successfully' })
  } catch (err) {
    next(err)
  }
}

export const getAllTasksAdmin = async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    })
    res.json({ success: true, count: tasks.length, tasks })
  } catch (err) {
    next(err)
  }
}