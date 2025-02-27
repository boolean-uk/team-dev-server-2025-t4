import User from '../domain/user.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const rawPassword = req.body.password
  const userToCreate = await User.fromJson(req.body)

  // validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(userToCreate.email)) {
    return sendDataResponse(res, 400, { email: 'Invalid email format' })
  }

  // validate password format
  // - At least 8 characters in length
  // - Contains at least one uppercase letter
  // - Contains at least one number
  // - Contains at least one special character
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
  if (!passwordRegex.test(rawPassword)) {
    return sendDataResponse(res, 400, {
      password:
        'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character'
    })
  }

  try {
    const existingUser = await User.findByEmail(userToCreate.email)

    if (existingUser) {
      return sendDataResponse(res, 400, { email: 'Email already in use' })
    }

    const createdUser = await userToCreate.save()

    return sendDataResponse(res, 201, createdUser)
  } catch (error) {
    return sendMessageResponse(res, 500, 'Unable to create new user')
  }
}

export const getById = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const foundUser = await User.findById(id)

    if (!foundUser) {
      return sendDataResponse(res, 404, { id: 'User not found' })
    }

    return sendDataResponse(res, 200, foundUser)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to get user')
  }
}

export const getStudentsByName = async (req, res) => {
  try {
    const { name } = req.params
    if (!name) {
      return sendMessageResponse(res, 400, 'Search query is required')
    }

    const usersByFirstName = await User.findManyThatContainsFirstName(name)
    const usersByLastName = await User.findManyThatContainsLastName(name)

    const uniqueUsers = [...usersByFirstName, ...usersByLastName]
      .reduce((acc, user) => {
        acc.set(user.id, user) // Using a Map to remove duplicates
        return acc
      }, new Map())
      .values()

    return sendDataResponse(res, 200, [...uniqueUsers]) // Convert back to array
  } catch (error) {
    console.error('Error fetching users:', error)
    return sendMessageResponse(res, 500, 'Unable to get users')
  }
}

export const getAll = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { first_name: firstName } = req.query

  let foundUsers

  if (firstName) {
    foundUsers = await User.findManyByFirstName(firstName)
  } else {
    foundUsers = await User.findAll()
  }

  const formattedUsers = foundUsers.map((user) => {
    return {
      ...user.toJSON().user
    }
  })

  return sendDataResponse(res, 200, { users: formattedUsers })
}

export const updateById = async (req, res) => {
  const { cohort_id: cohortId } = req.body

  if (!cohortId) {
    return sendDataResponse(res, 400, { cohort_id: 'Cohort ID is required' })
  }

  return sendDataResponse(res, 201, { user: { cohort_id: cohortId } })
}
