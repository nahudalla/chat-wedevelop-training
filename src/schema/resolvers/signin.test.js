/* global jest, it, expect, describe, beforeAll, afterAll */

import 'dotenv/config'

import resolver from './signin'
import InvalidCredentialsError from '../../errors/InvalidCredentialsError'
import mockedModels from '../../models'

jest.mock('../../models')

const testUserCredentials = { username: 'test', password: 'test' }

it('should export an Object by default', () => {
  expect(resolver).toBeInstanceOf(Object)
})

it('should export an Object assigned to the "Mutation" key', () => {
  expect(resolver).toHaveProperty('Mutation', expect.any(Object))
})

describe('Mutation#signin', () => {
  it('should exist and be a function', () => {
    expect(resolver.Mutation).toHaveProperty('signin', expect.any(Function))
  })

  describe('calling it with valid credentials', testSigninWithValidCredentials)
  describe('calling it with invalid credentials', testSigninWithInvalidCredentials)
})

function testSigninWithValidCredentials () {
  const fakeResult = { user: { }, jwt: 'fake token' }

  let result
  beforeAll(async () => {
    mockedModels.user.signin.mockReturnValueOnce(Promise.resolve(fakeResult))

    result = await callSignin()
  })

  testShouldCallUserSignin()

  it('should return the object returned by User#signin', () => {
    expect(result).toBe(fakeResult)
  })
}

function testSigninWithInvalidCredentials () {
  const error = new InvalidCredentialsError()

  let result
  beforeAll(async () => {
    mockedModels.user.signin.mockReturnValueOnce(Promise.reject(error))

    result = await callSignin()
  })

  testShouldCallUserSignin()

  it('should return an object with an "authError" property', () => {
    expect(result).toHaveProperty('authError', error.message)
  })

  it('should return an object without a "jwt" property', () => {
    expect(result).not.toHaveProperty('jwt')
  })

  it('should return an object without a "user" property', () => {
    expect(result).not.toHaveProperty('user')
  })
}

function testShouldCallUserSignin () {
  const { username, password } = testUserCredentials

  afterAll(() => {
    mockedModels.user.signin.mockReset()
  })

  it('should call User#signin once', () => {
    expect(mockedModels.user.signin).toHaveBeenCalledTimes(1)
  })

  it('should call User#signin with the given credentials', () => {
    expect(mockedModels.user.signin).toHaveBeenCalledWith(username, password)
  })
}

function callSignin () {
  const fakeDataFromClient = { data: testUserCredentials }
  const fakeContext = { models: mockedModels }

  return resolver.Mutation.signin(null, fakeDataFromClient, fakeContext)
}
