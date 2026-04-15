import bcrypt from 'bcryptjs'
import prisma from './src/config/prisma.js'

async function seedAdmin() {
  const email = 'admin@primetrade.ai'
  const password = 'adminpassword'
  
  const existingAdmin = await prisma.user.findUnique({ where: { email } })
  if (existingAdmin) {
    console.log('Admin already exists. Email: admin@primetrade.ai, Password: adminpassword')
    process.exit(0)
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email,
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('Admin created successfully!')
  console.log('Email:', admin.email)
  console.log('Password:', password)
  process.exit(0)
}

seedAdmin().catch((err) => {
  console.error(err)
  process.exit(1)
})
