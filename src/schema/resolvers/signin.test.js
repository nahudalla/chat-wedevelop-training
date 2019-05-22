/* global jest, it, expect, describe, beforeAll, afterAll */

import 'dotenv/config'

import resolver from './signin'

jest.mock('../../models')
jest.mock('../../JWTBuilder')

const apolloContext = require('../../apolloContextBuilder')()
const Models = jest.requireActual('../../models')

it('should export an Object by default', () => {
  expect(resolver).toBeInstanceOf(Object)
})

it('should export an Object assigned to the "Mutation" key', () => {
  expect(resolver).toHaveProperty('Mutation', expect.any(Object))
})

describe('Mutation#signin', () => {
  const userCredentials = { username: 'test', password: 'test' }
  const user = Models.user.build(userCredentials, { raw: true })

  jest.spyOn(user, 'passwordMatches')
  jest.spyOn(user, 'get')

  it('should exist and be a function', () => {
    expect(resolver.Mutation).toHaveProperty('signin', expect.any(Function))
  })

  describe('calling it with valid credentials', () => {
    const { password, ...userWithoutPassword } = user.get({ plain: true })
    user.get.mockClear()

    const fakeToken = 'fake token'

    let result
    beforeAll(async () => {
      apolloContext.models.user.findOne.mockReturnValueOnce(Promise.resolve(user))
      user.passwordMatches.mockReturnValueOnce(Promise.resolve(true))
      apolloContext.createTokenForUser.mockReturnValueOnce(fakeToken)

      result = await resolver.Mutation.signin(null, { data: userCredentials }, apolloContext)
    })

    afterAll(() => {
      apolloContext.models.user.findOne.mockReset()
      apolloContext.createTokenForUser.mockReset()
      user.passwordMatches.mockReset()
      user.get.mockReset()
    })

    it('should call User#findOne only once', () => {
      expect(apolloContext.models.user.findOne).toHaveBeenCalledTimes(1)
    })

    it('should call User#findOne with a where clause searching for the passed username', () => {
      const options = { where: { username: userCredentials.username } }
      expect(apolloContext.models.user.findOne).toHaveBeenCalledWith(options)
    })

    it('should call User#get only once', () => {
      expect(user.get).toHaveBeenCalledTimes(1)
    })

    it('should call User#get with "plain" option set to true', () => {
      expect(user.get).toHaveBeenCalledWith({ plain: true })
    })

    it('should call User#passwordMatches only once', () => {
      expect(user.passwordMatches).toHaveBeenCalledTimes(1)
    })

    it('should call User#passwordMatches with the given password', () => {
      expect(user.passwordMatches).toHaveBeenCalledWith(userCredentials.password)
    })

    it('should call context#createTokenForUser only once', () => {
      expect(apolloContext.createTokenForUser).toHaveBeenCalledTimes(1)
    })

    it('should call context#createTokenForUser with the obtained user data, without its password', () => {
      expect(apolloContext.createTokenForUser).toHaveBeenCalledWith(userWithoutPassword)
    })

    it('should return an object', () => {
      expect(result).toBeInstanceOf(Object)
    })

    it('should return the obtained user data in a "user" key, without its password', () => {
      expect(result.user).toEqual(userWithoutPassword)
    })

    it('should return the token created in a "jwt" key', () => {
      expect(result.jwt).toBe(fakeToken)
    })

    it('should not have an "error" property', () => {
      expect(result).not.toHaveProperty('error')
    })
  })

  describe('calling it with a non existent username', () => {
    let result
    beforeAll(async () => {
      apolloContext.models.user.findOne.mockReturnValueOnce(Promise.resolve(null))
      result = await resolver.Mutation.signin(null, { data: userCredentials }, apolloContext)
    })

    afterAll(() => {
      apolloContext.models.user.findOne.mockReset()
    })

    it('should call User#findOne only once', () => {
      expect(apolloContext.models.user.findOne).toHaveBeenCalledTimes(1)
    })

    it('should call User#findOne with a where clause filtering by username', () => {
      const options = { where: { username: userCredentials.username } }
      expect(apolloContext.models.user.findOne).toHaveBeenCalledWith(options)
    })

    it('should return an object', () => {
      expect(result).toBeInstanceOf(Object)
    })

    it('should return an "error" property of type String', () => {
      expect(result).toHaveProperty('error', expect.any(String))
    })

    it('should not have a "user" property', () => {
      expect(result).not.toHaveProperty('user')
    })

    it('should not have a "jwt" property', () => {
      expect(result).not.toHaveProperty('jwt')
    })
  })

  describe('calling it with an invalid password', () => {
    let result
    beforeAll(async () => {
      apolloContext.models.user.findOne.mockReturnValueOnce(Promise.resolve(user))
      user.passwordMatches.mockReturnValueOnce(Promise.resolve(false))
      result = await resolver.Mutation.signin(null, { data: userCredentials }, apolloContext)
    })

    it('should call User#findOne only once', () => {
      expect(apolloContext.models.user.findOne).toHaveBeenCalledTimes(1)
    })

    it('should call User#findOne with a where clause filtering by username', () => {
      const options = { where: { username: userCredentials.username } }
      expect(apolloContext.models.user.findOne).toHaveBeenCalledWith(options)
    })

    it('should call User#passwordMatches only once', () => {
      expect(user.passwordMatches).toHaveBeenCalledTimes(1)
    })

    it('should call User#passwordMatches with the password from the client', () => {
      expect(user.passwordMatches).toHaveBeenCalledWith(userCredentials.password)
    })

    it('should not call User#get', () => {
      expect(user.get).not.toHaveBeenCalled()
    })

    it('should return an Object', () => {
      expect(result).toBeInstanceOf(Object)
    })

    it('should return an "error" property of type String', () => {
      expect(result).toHaveProperty('error', expect.any(String))
    })

    it('should not return a "user" property', () => {
      expect(result).not.toHaveProperty('user')
    })

    it('should not return a "jwt" property', () => {
      expect(result).not.toHaveProperty('jwt')
    })
  })
})
