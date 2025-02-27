import dbClient from '../utils/dbClient.js'

/**
 * Create a new Cohort in the database
 * @returns {Cohort}
 */
export async function createCohort() {
  const createdCohort = await dbClient.cohort.create({
    data: {}
  })

  return new Cohort(createdCohort.id)
}

export class Cohort {
  constructor(id = null, deliveryLogs = null, users = null) {
    this.id = id
    this.deliveryLogs = deliveryLogs
    this.users = users
  }

  toJSON() {
    return {
      cohort: {
        id: this.id,
        deliveryLogs: this.deliveryLogs,
        users: this.users
      }
    }
  }

  static fromDb(cohort) {
    return new Cohort(cohort.id, cohort.deliveryLogs, cohort.users)
  }

  static async findAll() {
    return Cohort._findMany()
  }

  static async findById(id) {
    return Cohort._findByUnique('id', id)
  }

  static async _findByUnique(key, value) {
    const foundCohort = await dbClient.cohort.findUnique({
      where: {
        [key]: value
      },
      include: {
        deliveryLogs: true,
        users: true
      }
    })

    if (foundCohort) {
      return Cohort.fromDb(foundCohort)
    }

    return null
  }

  static async _findMany(key, value) {
    const query = {
      include: {
        deliveryLogs: true,
        users: true
      }
    }

    const foundCohorts = await dbClient.cohort.findMany(query)

    return foundCohorts.map((cohort) => Cohort.fromDb(cohort))
  }
}
