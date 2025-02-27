import { sendDataResponse } from '../utils/responses.js'
import Profile from '../domain/profile.js'
import User from '../domain/user.js'

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
