import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import User from '../domain/user.js'
import dbClient from '../utils/dbClient.js'
import Profile from '../domain/profile.js'

export const createProfile = async (req, res) => {
  const paramId = parseInt(req.params.id)
  const user = await User.findById(paramId)

  if (user == null) {
    return sendDataResponse(res, 404, 'user not found!')
  }

  const profile = await Profile.fromJson(req.body)
  const createdProfile = await profile.save(paramId)

  return sendDataResponse(res, 201, createdProfile)
}

export const updateProfile = async (req, res) => {
  const paramId = parseInt(req.params.id)

  try {
    const user = await User.findById(paramId)

    if (!user) {
      return sendDataResponse(res, 404, { error: 'User not found' })
    }

    console.log(user)

    if (!user.profile) {
      return sendDataResponse(res, 404, {
        error: 'User has no profile. Create one first'
      })
    }

    const { firstName, lastName, bio, githubUrl, username, mobile } = req.body

    const updatedProfile = await dbClient.profile.update({
      where: { userId: paramId },
      data: {
        firstName: firstName || user.profile.firstName,
        lastName: lastName || user.profile.lastName,
        bio: bio ?? user.profile.bio,
        githubUrl: githubUrl ?? user.profile.githubUrl,
        username: username ?? user.profile.username,
        mobile: mobile ?? user.profile.mobile
      }
    })

    return sendDataResponse(res, 200, updatedProfile)
  } catch (error) {
    console.error(error)
    return sendMessageResponse(res, 500, 'Unable to update profile')
  }
}
