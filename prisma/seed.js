import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()

async function seed() {
  const specialism = await createSpecialism('Software Developer')
  const cohort = await createCohort(specialism.id, 'January 2025', 'June 2025')

  const student = await createUser(
    'student@test.com',
    'Testpassword1!',
    cohort.id,
    'Joe',
    'Bloggs',
    'Hello, world!',
    'student1',
    'username',
    'mobile'
  )
  const teacher = await createUser(
    'teacher@test.com',
    'Testpassword1!',
    null,
    'Rick',
    'Sanchez',
    'Hello there!',
    'teacher1',
    'username',
    'mobile',
    'TEACHER'
  )

  await createPost(student.id, 'My first post!')
  await createPost(teacher.id, 'Hello, students')

  process.exit(0)
}

async function createPost(userId, content) {
  const post = await prisma.post.create({
    data: {
      userId,
      content
    },
    include: {
      user: true
    }
  })

  console.info('Post created', post)

  return post
}

async function createCohort(specialismId, startDate, endDate, jobTitle) {
  const cohort = await prisma.cohort.create({
    data: {
      specialismId,
      startDate,
      endDate,
      jobTitle
    }
  })

  console.info('Cohort created', cohort)

  return cohort
}

async function createSpecialism(specialismName) {
  const specialism = await prisma.specialism.create({
    data: {
      specialismName
    }
  })

  console.info('Specialism created', specialism)

  return specialism
}

async function createUser(
  email,
  password,
  cohortId,
  firstName,
  lastName,
  bio,
  githubUrl,
  username,
  mobile,
  role = 'STUDENT'
) {
  const user = await prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 8),
      role,
      cohortId,
      profile: {
        create: {
          firstName,
          lastName,
          bio,
          githubUrl,
          username,
          mobile
        }
      }
    },
    include: {
      profile: true
    }
  })

  console.info(`${role} created`, user)

  return user
}

seed().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
