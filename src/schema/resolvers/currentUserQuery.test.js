/* global jest, expect, it, describe, beforeAll, afterAll */

import 'dotenv/config'
import contextBuilder from '../../apolloContextBuilder'
import resolver from './currentUserQuery'

it('should export an object by default', () => {
  expect(resolver).toBeInstanceOf(Object)
})

it('should have an Object associated to key "Query"', () => {
  expect(resolver).toHaveProperty('Query', expect.any(Object))
})

describe('Qery#currentUser', () => {
  it('should exist and be a Function', () => {
    expect(resolver.Query.currentUser).toBeInstanceOf(Function)
  })

  describe('calling it', () => {
    const context = contextBuilder()
    const fakeUserFromDB = { }

    let result
    beforeAll(async () => {
      jest.spyOn(context, 'getAuthenticatedUser')

      context.getAuthenticatedUser.mockReturnValueOnce(Promise.resolve(fakeUserFromDB))

      result = await resolver.Query.currentUser(null, null, context)
    })

    afterAll(() => {
      context.getAuthenticatedUser.mockRestore()
    })

    it('should call context#getAuthenticatedUser once', () => {
      expect(context.getAuthenticatedUser).toHaveBeenCalledTimes(1)
    })

    it('should return the user obtained from context#getAuthenticatedUser', () => {
      expect(result).toBe(fakeUserFromDB)
    })
  })
})
