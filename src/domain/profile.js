import dbClient from '../utils/dbClient.js'

export default class Profile {
  /**
   * This is JSDoc - a way for us to tell other developers what types functions/methods
   * take as inputs, what types they return, and other useful information that JS doesn't have built in
   * @tutorial https://www.valentinog.com/blog/jsdoc
   *
   * @param { { id: int, profile: { firstName: string, lastName: string, bio: string, githubUrl: string, username: string, mobile: string } } } profile
   * @returns {Profile}
   */
  static fromDb(profile) {
    return new Profile(
      profile.id,
      profile.userId,
      profile.profile.firstName,
      profile.profile.lastName,
      profile.profile?.bio,
      profile.profile?.githubUrl,
      profile.profile?.username,
      profile.profile?.mobile
    )
  }

  static async fromJson(json) {
    // eslint-disable-next-line camelcase
    const {
      userId,
      firstName,
      lastName,
      biography,
      githubUrl,
      username,
      mobile
    } = json

    return new Profile(
      null,
      userId,
      firstName,
      lastName,
      biography,
      githubUrl,
      username,
      mobile
    )
  }

  constructor(
    id,
    userId,
    firstName,
    lastName,
    bio,
    githubUrl,
    username,
    mobile
  ) {
    this.id = id
    this.userId = userId
    this.firstName = firstName
    this.lastName = lastName
    this.bio = bio
    this.githubUrl = githubUrl
    this.username = username
    this.mobile = mobile
  }

  toJSON() {
    return {
      profile: {
        id: this.id,
        userId: this.userId,
        firstName: this.firstName,
        lastName: this.lastName,
        biography: this.bio,
        githubUrl: this.githubUrl,
        username: this.username,
        mobile: this.mobile
      }
    }
  }

  /**
   * @returns {Profile}
   *  A profile instance containing an ID, representing the profile data created in the database
   */
  async save() {
    const createdProfile = await dbClient.profile.create({
      userId: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      biography: this.bio,
      githubUrl: this.githubUrl,
      username: this.username,
      mobile: this.mobile
    })

    return Profile.fromDb(createdProfile)
  }

  static async findById(id) {
    return Profile._findByUnique('id', id)
  }

  static async findManyByFirstName(firstName) {
    return Profile._findMany('firstName', firstName)
  }

  static async findAll() {
    return Profile._findMany()
  }

  static async _findByUnique(key, value) {
    const foundProfile = await dbClient.profile.findUnique({
      where: {
        [key]: value
      }
    })

    if (foundProfile) {
      return Profile.fromDb(foundProfile)
    }

    return null
  }
}
