/* global jest, it, expect, describe, beforeAll, afterAll */

import 'dotenv/config'
import { Model } from 'sequelize'
import jwtBuilder from '../JWTBuilder'
import { buildUserModel } from './user.js'
import models from '../models'
import InvalidCredentialsError from '../errors/InvalidCredentialsError'

jest.mock('../JWTBuilder')

const testUserData = {
  username: 'test',
  firstName: 'test',
  lastName: 'test',
  password: 'test'
}

describe('User model', () => {
  let User
  beforeAll(() => {
    User = buildUserModel(models)
  })

  it('should be a class', () => {
    expect(User).toHaveProperty('constructor', expect.any(Function))
  })

  it('should extend Sequelize\'s Model class', () => {
    expect(User.prototype).toBeInstanceOf(Model)
  })

  describe('User#findByUsername static method', testUserFindByUsername)
  describe('User#signin static method', testUserSignin)
  describe('User#generateJWT instance method', testUserGenerateJWT)
  describe('User#getAsPlainObject instance method', testUserGetAsPlainObject)
  describe('User#validatePassword instance method', testUserValidatePassword)
})

function testUserSignin () {
  it('should exist and be a Function', () => {
    expect(models.user).toHaveProperty('signin', expect.any(Function))
  })

  describe('calling it with valid credentials', testUserSigninWithValidCredentials)
  describe('calling it with invalid password', testUserSigninWithInvalidPassword)
  describe('calling it with invalid username', testUserSigninWithInvalidUsername)
}

function testUserSigninWithValidCredentials () {
  const { username, password } = testUserData
  const fakeToken = 'fake token'
  const fakeUserInstance = { generateJWT: jest.fn() }
  const User = models.user

  testSigninValidatesCredentials(fakeUserInstance)

  let result
  beforeAll(async () => {
    fakeUserInstance.validatePassword.mockReturnValueOnce(Promise.resolve(true))
    fakeUserInstance.generateJWT.mockReturnValueOnce(Promise.resolve(fakeToken))

    result = await User.signin(username, password)
  })

  it('should call User#generateJWT once on the instance', () => {
    expect(fakeUserInstance.generateJWT).toHaveBeenCalledTimes(1)
  })

  it('should return an object containing User instance in a "user" key', () => {
    expect(result).toHaveProperty('user', fakeUserInstance)
  })

  it('should return an object containing the JWT in a "jwt" key', () => {
    expect(result).toHaveProperty('jwt', fakeToken)
  })
}

function testUserSigninWithInvalidPassword () {
  const { username, password } = testUserData
  const fakeUserInstance = { generateJWT: jest.fn() }
  const User = models.user

  testSigninValidatesCredentials(fakeUserInstance)

  let error
  beforeAll(async () => {
    fakeUserInstance.validatePassword.mockReturnValueOnce(
      Promise.reject(new InvalidCredentialsError())
    )

    try {
      await User.signin(username, password)
    } catch (e) {
      error = e
    }
  })

  it('should not call User#generateJWT on the instance', () => {
    expect(fakeUserInstance.generateJWT).not.toHaveBeenCalled()
  })

  it('should reject to an instance of InvalidCredentialsError', () => {
    expect(error).toBeInstanceOf(InvalidCredentialsError)
  })
}

function testUserSigninWithInvalidUsername () {
  const { username, password } = testUserData
  const User = models.user

  testSigninValidatesCredentials()

  let error
  beforeAll(async () => {
    try {
      await User.signin(username, password)
    } catch (e) {
      error = e
    }
  })

  it('should reject to an instance of InvalidCredentialsError', () => {
    expect(error).toBeInstanceOf(InvalidCredentialsError)
  })
}

function testSigninValidatesCredentials (fakeUserInstance) {
  const { username } = testUserData
  const User = models.user

  beforeAll(() => {
    jest.spyOn(User, 'findByUsername')

    let userPromise
    if (fakeUserInstance) {
      userPromise = Promise.resolve(fakeUserInstance)
    } else {
      userPromise = Promise.reject(new InvalidCredentialsError())
    }

    User.findByUsername.mockReturnValueOnce(userPromise)
  })

  afterAll(() => {
    User.findByUsername.mockRestore()
  })

  it('should call User#findByUsername once', () => {
    expect(User.findByUsername).toHaveBeenCalledTimes(1)
  })

  it('should call User#findByUsername with the given username', () => {
    expect(User.findByUsername).toHaveBeenCalledWith(username)
  })

  if (fakeUserInstance) {
    testSigninValidatesPassword(fakeUserInstance)
  }
}

function testSigninValidatesPassword (fakeUserInstance) {
  const { password } = testUserData

  fakeUserInstance.validatePassword = jest.fn()

  it('should call User#validatePassword once on the instance', () => {
    expect(fakeUserInstance.validatePassword).toHaveBeenCalledTimes(1)
  })

  it('should call User#validatePassword with the given password', () => {
    expect(fakeUserInstance.validatePassword).toHaveBeenCalledWith(password)
  })
}

function testUserGenerateJWT () {
  let userInstance
  beforeAll(async () => {
    userInstance = await models.user.build(testUserData)
  })

  it('should exist and be a Function', () => {
    expect(userInstance).toHaveProperty('generateJWT', expect.any(Function))
  })

  describe('calling it', () => {
    const fakeToken = 'fake token'

    let result
    beforeAll(async () => {
      jest.spyOn(userInstance, 'getAsPlainObject')

      userInstance.getAsPlainObject.mockReturnValueOnce(testUserData)
      jwtBuilder.mockReturnValueOnce(fakeToken)

      result = await userInstance.generateJWT()
    })

    afterAll(() => {
      jwtBuilder.mockClear()
    })

    it('should call User#getAsPlainObject once', () => {
      expect(userInstance.getAsPlainObject).toHaveBeenCalledTimes(1)
    })

    it('should call JWTBuilder only once', () => {
      expect(jwtBuilder).toHaveBeenCalledTimes(1)
    })

    it('should call JWTBuilder with the object from User#getAsPlainObject, without password', () => {
      const { password, ...userWithoutPassword } = testUserData

      expect(jwtBuilder).toHaveBeenCalledWith(userWithoutPassword)
    })

    it('should return the return value of JWTBuilder', () => {
      expect(result).toBe(fakeToken)
    })
  })
}

function testUserGetAsPlainObject () {
  let userInstance
  beforeAll(async () => {
    userInstance = await createTestUserInstance()
  })

  it('should exist and be a Function', () => {
    expect(userInstance).toHaveProperty('getAsPlainObject', expect.any(Function))
  })

  describe('calling it', () => {
    const fakePlainObject = { }

    let result
    beforeAll(async () => {
      jest.spyOn(userInstance, 'get')

      userInstance.get.mockReturnValueOnce(Promise.resolve(fakePlainObject))

      result = await userInstance.getAsPlainObject()
    })

    it('should call User#get only once', () => {
      expect(userInstance.get).toHaveBeenCalledTimes(1)
    })

    it('should call User#get with the "plain" option set to true', () => {
      const options = { plain: true }
      expect(userInstance.get).toHaveBeenCalledWith(options)
    })

    it('should return the object returned by User#get', () => {
      expect(result).toBe(fakePlainObject)
    })
  })
}

function testUserFindByUsername () {
  it('should exist and be a Function', () => {
    expect(models.user).toHaveProperty('findByUsername', expect.any(Function))
  })

  describe('calling it', () => {
    beforeAll(() => {
      jest.spyOn(models.user, 'findOne')
    })

    afterAll(() => {
      models.user.findOne.mockRestore()
    })

    describe('with an existing username', () => {
      afterAll(() => {
        models.user.findOne.mockClear()
      })

      testUserFindByUsernameValid()
    })
    describe('with a non existent username', testUserFindByUsernameInvalid)
  })
}

function testUserFindByUsernameValid () {
  const { username } = testUserData
  const User = models.user
  const fakeUser = {}

  let result
  beforeAll(async () => {
    User.findOne.mockReturnValueOnce(Promise.resolve(fakeUser))

    result = await User.findByUsername(username)
  })

  testShouldCallFindOne()

  it('should return the user returned by User#findOne', () => {
    expect(result).toBe(fakeUser)
  })
}

function testUserFindByUsernameInvalid () {
  const User = models.user
  const { username } = testUserData

  let error
  beforeAll(async () => {
    User.findOne.mockReturnValueOnce(Promise.resolve(null))

    try {
      await User.findByUsername(username)
    } catch (e) {
      error = e
    }
  })

  testShouldCallFindOne()

  it('should throw an instance of InvalidCredentialsError', () => {
    expect(error).toBeInstanceOf(InvalidCredentialsError)
  })
}

function testShouldCallFindOne () {
  const { username } = testUserData

  it('should call User#findOne only once', () => {
    expect(models.user.findOne).toHaveBeenCalledTimes(1)
  })

  it('should call User#findOne with a where clause filtering by the given username', () => {
    const options = { where: { username } }
    expect(models.user.findOne).toHaveBeenCalledWith(options)
  })
}

function testUserValidatePassword () {
  let userInstance
  beforeAll(async () => {
    userInstance = createTestUserInstance()
  })

  it('should exist and be a function', () => {
    expect(userInstance).toHaveProperty('validatePassword', expect.any(Function))
  })

  describe('calling it with a valid password', testUserValidatePasswordValid)
  describe('calling it with an invalid password', testUserValidatePasswordInvalid)
}

function testUserValidatePasswordValid () {
  const { password } = testUserData
  const userInstance = createTestUserInstance()

  testShouldCallPasswordMatches(userInstance)

  let result
  beforeAll(async () => {
    userInstance.passwordMatches.mockReturnValueOnce(Promise.resolve(true))

    result = await userInstance.validatePassword(password)
  })

  it('should return nothing', () => {
    expect(result).toBeUndefined()
  })
}

function testUserValidatePasswordInvalid () {
  const { password } = testUserData
  const userInstance = createTestUserInstance()

  testShouldCallPasswordMatches(userInstance)

  let error
  beforeAll(async () => {
    userInstance.passwordMatches.mockReturnValueOnce(Promise.resolve(false))

    try {
      await userInstance.validatePassword(password)
    } catch (e) {
      error = e
    }
  })

  it('should throw an instance of InvalidCredentialsError', () => {
    expect(error).toBeInstanceOf(InvalidCredentialsError)
  })
}

function testShouldCallPasswordMatches (userInstance) {
  const { password } = testUserData

  beforeAll(async () => {
    jest.spyOn(userInstance, 'passwordMatches')
  })

  it('should call User#passwordMatches once', () => {
    expect(userInstance.passwordMatches).toHaveBeenCalledTimes(1)
  })

  it('should call User#passwordMatches with the given password', () => {
    expect(userInstance.passwordMatches).toHaveBeenCalledWith(password)
  })
}

function createTestUserInstance () {
  return models.user.build(testUserData)
}
