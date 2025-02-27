import { Cohort, createCohort } from '../domain/cohort.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  try {
    const createdCohort = await createCohort()

    return sendDataResponse(res, 201, createdCohort)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to create cohort')
  }
}

export const getAll = async (req, res) => {
  const foundCohorts = await Cohort.findAll()

  const formattedCohorts = foundCohorts.map((cohort) => {
    return {
      ...cohort.toJSON().cohort
    }
  })

  return sendDataResponse(res, 200, { cohorts: formattedCohorts })
}

export const getById = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const foundCohort = await Cohort.findById(id)

    if (!foundCohort) {
      return sendDataResponse(res, 404, { id: 'Cohort not found' })
    }

    return sendDataResponse(res, 200, foundCohort)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to get cohort')
  }
}
