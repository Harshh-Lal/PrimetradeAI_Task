import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { createRequire } from 'module'
import authRoutes from './routes/auth.route.js'
import taskRoutes from './routes/task.route.js'
import adminRoutes from './routes/admin.route.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { swaggerSpec } from './config/swagger.js'

dotenv.config()

const require = createRequire(import.meta.url)
const swaggerUi = require('swagger-ui-express')

const app = express()

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors())
app.use(express.json())

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/tasks', taskRoutes)
app.use('/api/v1/admin', adminRoutes)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Primetrade API is running 🚀' })
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📄 Swagger docs at http://localhost:${PORT}/api-docs`)
})
// trigger restart