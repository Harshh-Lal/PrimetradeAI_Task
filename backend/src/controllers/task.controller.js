import { z } from 'zod'
import prisma from '../config/prisma.js'

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
})

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
})

export const createTask = async (req, res, next) => {
  try {
    const parsed = createTaskSchema.safeParse(req.body)
    if (!parsed.success)
      return res.status(400).json({ success: false, message: parsed.error.errors[0].message })

    const task = await prisma.task.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        status: parsed.data.status || 'PENDING',
        userId: req.user.id,
      },
    })
    res.status(201).json({ success: true, task })
  } catch (err) {
    next(err)
  }
}

export const getTasks = async (req, res, next) => {
  try {
    const where = req.user.role === 'ADMIN' ? {} : { userId: req.user.id }
    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
    res.json({ success: true, count: tasks.length, tasks })
  } catch (err) {
    next(err)
  }
}

export const getTask = async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: parseInt(req.params.id) } })
    if (!task)
      return res.status(404).json({ success: false, message: 'Task not found' })

    if (req.user.role !== 'ADMIN' && task.userId !== req.user.id)
      return res.status(403).json({ success: false, message: 'Access denied' })

    res.json({ success: true, task })
  } catch (err) {
    next(err)
  }
}

export const updateTask = async (req, res, next) => {
  try {
    const parsed = updateTaskSchema.safeParse(req.body)
    if (!parsed.success)
      return res.status(400).json({ message: parsed.error.issues?.[0]?.message || "Validation failed" })

    const task = await prisma.task.findUnique({ where: { id: parseInt(req.params.id) } })
    if (!task)
      return res.status(404).json({ success: false, message: 'Task not found' })

    if (req.user.role !== 'ADMIN' && task.userId !== req.user.id)
      return res.status(403).json({ success: false, message: 'Access denied' })

    const updated = await prisma.task.update({
      where: { id: parseInt(req.params.id) },
      data: parsed.data,
    })
    res.json({ success: true, task: updated })
  } catch (err) {
    next(err)
  }
}

export const deleteTask = async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: parseInt(req.params.id) } })
    if (!task)
      return res.status(404).json({ success: false, message: 'Task not found' })

    if (req.user.role !== 'ADMIN' && task.userId !== req.user.id)
      return res.status(403).json({ success: false, message: 'Access denied' })

    await prisma.task.delete({ where: { id: parseInt(req.params.id) } })
    res.json({ success: true, message: 'Task deleted successfully' })
  } catch (err) {
    next(err)
  }
}