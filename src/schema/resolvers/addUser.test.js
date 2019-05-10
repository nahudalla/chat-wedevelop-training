/* global jest, it, expect, describe, beforeAll */

import addUserResolver from './addUser'
import { user as User } from '../../models'

jest.mock('../../models')

it('should export an object by default', () => {
  expect(addUserResolver).toBeInstanceOf(Object)
})

it('should have a Mutation property of Object type', () => {
  expect(addUserResolver).toHaveProperty('Mutation', expect.any(Object))
})

describe('Mutation#addUser', () => {
  it('should exist and be a function', () => {
    expect(addUserResolver.Mutation).toHaveProperty('addUser', expect.any(Function))
  })

  describe('calling it', function () {
    const data = { username: 'test', firstName: 'test', lastName: 'test', password: 'test' }
    const options = { fields: ['username', 'firstName', 'lastName', 'password'] }
    const userCreateMockReturnValue = { id: 'new-user-id', ...data, password: undefined }

    const Mutation = addUserResolver.Mutation

    let returnValue
    beforeAll(() => {
      User.create.mockReturnValueOnce(Promise.resolve(userCreateMockReturnValue))
      returnValue = Mutation.addUser(null, data)
    })

    it('should call User#create only once', () => {
      expect(User.create).toHaveBeenCalledTimes(1)
    })

    it('should call User#create with the right arguments', () => {
      expect(User.create).toHaveBeenCalledWith(data, options)
    })

    it('should return a Promise-like object', () => {
      expect(returnValue).toMatchObject(Promise.prototype)
    })

    it('should return the new user data', () => {
      expect(returnValue).resolves.toEqual(userCreateMockReturnValue)
    })

    it('should return a Promise rejection when User#create rejects', () => {
      User.create.mockReturnValueOnce(Promise.reject(new Error('test-rejection')))

      const returnValue = Mutation.addUser(null, data)

      expect(returnValue).rejects.toBeInstanceOf(Error)
    })
  })
})
