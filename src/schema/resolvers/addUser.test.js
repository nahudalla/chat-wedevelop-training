/* global jest, it, expect, describe */

import addUserResolver from './addUser'
import models from '../../models'

jest.mock('../../models')

it('should export an object by default', () => {
  expect(addUserResolver).toBeInstanceOf(Object)
})

describe('default export', () => {
  it('should have a Mutation property of Object type', () => {
    expect(addUserResolver).toHaveProperty('Mutation', expect.any(Object))
  })

  describe('Mutation property', () => {
    it('should have an addUser function', () => {
      expect(addUserResolver.Mutation).toHaveProperty('addUser', expect.any(Function))
    })

    describe('addUser ', function () {
      it('should call User#create on models', () => {
        const data = { username: 'test', firstName: 'test', lastName: 'test', password: 'test' }
        const options = { fields: ['username', 'firstName', 'lastName', 'password'] }

        addUserResolver.Mutation.addUser(null, data)

        const userCreate = models.user.create

        expect(userCreate).toHaveBeenCalledTimes(1)
        expect(userCreate).toHaveBeenCalledWith(data, options)
      })
    })
  })
})
