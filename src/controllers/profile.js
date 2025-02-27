import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import User from '../domain/user.js'

export const createProfile = async (req, res) => {
  const paramId = parseInt(req.params.id)
  const user = await User.findById(paramId)

  if (user == null) {
    return sendDataResponse(res, 404, 'user not found!')
  }

  const profile = await User.fromJson(req.body)
  const createdProfile = await profile.createProfile(paramId)

  return sendDataResponse(res, 201, createdProfile)
}

export const updateProfile = async (req, res) => {
  
}