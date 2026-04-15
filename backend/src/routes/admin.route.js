import { Router } from 'express'
import { getAllUsers, deleteUser, getAllTasksAdmin } from '../controllers/admin.controller.js'
import { protect } from '../middlewares/auth.middleware.js'
import { adminOnly } from '../middlewares/admin.middleware.js'

const router = Router()
router.use(protect)
router.use(adminOnly)

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: List of users }
 */
router.get('/users', getAllUsers)

/**
 * @swagger
 * /api/v1/admin/users/{id}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User deleted }
 */
router.delete('/users/:id', deleteUser)

/**
 * @swagger
 * /api/v1/admin/tasks:
 *   get:
 *     summary: Get all tasks with user info (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: All tasks }
 */
router.get('/tasks', getAllTasksAdmin)

export default router