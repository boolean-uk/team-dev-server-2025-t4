import dbClient from '../utils/dbClient.js'
import bcrypt from 'bcrypt'

export default class User {
  /**
   * This is JSDoc - a way for us to tell other developers what types functions/methods
   * take as inputs, what types they return, and other useful information that JS doesn't have built in
   * @tutorial https://www.valentinog.com/blog/jsdoc
   *
   * @param { { id: int, cohortId: int, email: string } } user
   * @returns {User}
   */
  static fromDb(user) {
    return new User(
      user.id,
      user.cohortId,
      user.email,
      user.profile,
      user.password,
      user.role
    )
  }

  static async fromJson(json) {
    // eslint-disable-next-line camelcase
    const { email, cohortId, profile, password } = json

    const passwordHash = await bcrypt.hash(password, 8)

    return new User(null, cohortId, email, profile, passwordHash)
  }

  constructor(
    id,
    cohortId,
    email,
    profile = null,
    passwordHash = null,
    role = 'STUDENT'
  ) {
    this.id = id
    this.cohortId = cohortId
    this.email = email
    this.profile = profile
    this.passwordHash = passwordHash
    this.role = role
  }

  toJSON() {
    return {
      user: {
        id: this.id,
        cohort_id: this.cohortId,
        role: this.role,
        email: this.email,
        profile: this.profile
      }
    }
  }

  /**
   * @returns {User}
   *  A user instance containing an ID, representing the user data created in the database
   */
  async save() {
    const data = {
      email: this.email,
      password: this.passwordHash,
      role: this.role,
      cohortId: this.cohortId,
      profile: this.profile ? { connect: { id: this.profile.id } } : undefined
    }

    const createdUser = await dbClient.user.create({
      data
    })

    return User.fromDb(createdUser)
  }

  static async findByEmail(email) {
    return User._findByUnique('email', email)
  }

  static async findById(id) {
    return User._findByUnique('id', id)
  }

  static async findManyByFirstName(firstName) {
    return User._findMany('firstName', firstName)
  }

  static async findManyThatContainsFirstName(firstName) {
    return User._findManyContains('firstName', firstName)
  }

  static async findManyThatContainsLastName(lastName) {
    return User._findManyContains('lastName', lastName)
  }

  static async findManyThatContainsBothNames(firstName, lastName) {
    return User._findManyContainsTwoKeys(
      'firstName',
      firstName,
      'lastName',
      lastName
    )
  }

  static async findAll() {
    return User._findMany()
  }

  static async _findByUnique(key, value) {
    const foundUser = await dbClient.user.findUnique({
      where: {
        [key]: value
      },
      include: {
        profile: true
      }
    })

    if (foundUser) {
      return User.fromDb(foundUser)
    }

    return null
  }

  static async _findMany(key, value) {
    const query = {
      include: {
        profile: true
      }
    }

    if (key !== undefined && value !== undefined) {
      query.where = {
        profile: {
          [key]: value
        }
      }
    }

    const foundUsers = await dbClient.user.findMany(query)

    return foundUsers.map((user) => User.fromDb(user))
  }

  static async _findManyContains(key, value) {
    const foundUsers = await dbClient.user.findMany({
      where: {
        profile: {
          [key]: {
            contains: value,
            mode: 'insensitive'
          }
        }
      },
      include: {
        profile: true
      }
    })

    return foundUsers.map((user) => User.fromDb(user))
  }

  static async _findManyContainsTwoKeys(key1, value1, key2, value2) {
    const whereConditions = {
      profile: {}
    }

    if (value1) {
      whereConditions.profile[key1] = {
        contains: value1,
        mode: 'insensitive'
      }
    }

    if (value2) {
      whereConditions.profile[key2] = {
        contains: value2,
        mode: 'insensitive'
      }
    }

    const foundUsers = await dbClient.user.findMany({
      where: whereConditions,
      include: {
        profile: true
      }
    })

    return foundUsers.map((user) => User.fromDb(user))
  }
}
