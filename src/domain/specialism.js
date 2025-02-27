import dbClient from '../utils/dbClient.js'

/**
 * Create a new specialism in the database
 * @returns {Specialism}
 */
export async function createSpecialism() {
  const createdSpecialism = await dbClient.specialism.create({
    data: {}
  })

  return new Specialism(createdSpecialism.id)
}

export class Specialism {
  constructor(id = null, specialismName, cohorts = null) {
    this.id = id
    this.specialismName = specialismName
    this.cohorts = cohorts
  }

  toJSON() {
    return {
      specialism: {
        id: this.id,
        specialismName: this.specialismName,
        cohorts: this.cohorts
      }
    }
  }

  static fromDb(specialism) {
    return new Specialism(
      specialism.id,
      specialism.specialismName,
      specialism.cohorts
    )
  }

  static async findAll() {
    return Specialism._findMany()
  }

  static async findById(id) {
    return Specialism._findByUnique('id', id)
  }

  static async _findByUnique(key, value) {
    const foundSpecialism = await dbClient.specialism.findUnique({
      where: {
        [key]: value
      }
    })

    if (foundSpecialism) {
      return Specialism.fromDb(foundSpecialism)
    }

    return null
  }
}
