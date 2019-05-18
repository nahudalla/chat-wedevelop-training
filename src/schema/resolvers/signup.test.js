/* global jest, it, expect, describe, beforeAll, afterAll */

import 'dotenv/config'

import resolver from './signup'

it('should export an object by default', () => {
  expect(resolver).toBeInstanceOf(Object)
})

it('should have a Mutation property of type Object', () => {
  expect(resolver).toHaveProperty('Mutation', expect.any(Object))
})

describe('Mutation#signup', () => {
  const userUsername = { username: 'test' }
  const userPersonalDetails = { firstName: 'test', lastName: 'test' }
  const userFromDBWithoutPassword = { id: 123, ...userUsername, ...userPersonalDetails }
  const userFromDB = { ...userFromDBWithoutPassword, password: 'hashed password' }
  const userFromClient = { ...userUsername, ...userPersonalDetails, password: 'test' }

  jest.mock('../../models')
  jest.mock('../../JWTBuilder')

  const context = require('../../apolloContextBuilder')()
  const { models: { user: User }, createTokenForUser } = context

  const signupResolver = resolver && resolver.Mutation && resolver.Mutation.signup

  it('should exist and be a Function', () => {
    expect(resolver.Mutation).toHaveProperty('signup', expect.any(Function))
  })

  describe('calling it with a non-existent username', () => {
    const fakeToken = 'fake token'

    let result
    beforeAll(async () => {
      const userCreated = true

      User.findOrCreate.mockReturnValueOnce([userFromDB, userCreated])
      createTokenForUser.mockReturnValueOnce(fakeToken)

      result = await signupResolver(null, { data: userFromClient }, context)
    })

    afterAll(() => {
      User.findOrCreate.mockReset()
      createTokenForUser.mockReset()
    })

    it('should call User#findOrCreate only once', () => {
      expect(User.findOrCreate).toHaveBeenCalledTimes(1)
    })

    it('should call User#findOrCreate with the new user data', () => {
      const options = {
        where: userUsername,
        defaults: userFromClient
      }
      expect(User.findOrCreate).toHaveBeenCalledWith(options)
    })

    it('should call createTokenForUser from the context only once', () => {
      expect(createTokenForUser).toHaveBeenCalledTimes(1)
    })

    it('should call createTokenForUser with the new user without its password', () => {
      expect(createTokenForUser).toHaveBeenCalledWith(userFromDBWithoutPassword)
    })

    it('should return an Object', () => {
      expect(result).toBeInstanceOf(Object)
    })

    it('should return the new user without its password, associated to the key "user"', () => {
      expect(result.user).toEqual(userFromDBWithoutPassword)
    })

    it('should return the token built by createTokenForUser, associated to the key "jwt"', () => {
      expect(result.jwt).toBe(fakeToken)
    })
  })

  describe('calling it with an existent username', () => {
    let result
    beforeAll(async () => {
      const created = false
      User.findOrCreate.mockReturnValueOnce([userFromDB, created])

      result = await signupResolver(null, { data: userFromClient }, context)
    })

    it('should call User#findOrCreate only once', () => {
      expect(User.findOrCreate).toHaveBeenCalledTimes(1)
    })

    it('should call User#findOrCreate with the new user data', () => {
      const options = {
        where: userUsername,
        defaults: userFromClient
      }
      expect(User.findOrCreate).toHaveBeenCalledWith(options)
    })

    it('should not call createTokenForUser from context', () => {
      expect(createTokenForUser).toHaveBeenCalledTimes(0)
    })

    it('should return an Object', () => {
      expect(result).toBeInstanceOf(Object)
    })

    it('should return an error message in an "authError" key', () => {
      expect(result).toHaveProperty('authError', expect.any(String))
    })
  })
})
