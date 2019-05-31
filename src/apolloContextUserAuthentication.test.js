/* global jest, it, expect, describe, beforeAll, afterAll */

import 'dotenv/config'
import buildUserAuthentication from './apolloContextUserAuthentication'
import models from './models'

jest.mock('./models')

it('should export a function by default', () => {
  expect(buildUserAuthentication).toBeInstanceOf(Function)
})

describe('calling the builder', () => {
  it('should return an object', () => {
    const result = buildUserAuthentication()

    expect(result).toBeInstanceOf(Object)
  })

  describe('without a user', () => {
    let context
    beforeAll(() => {
      context = buildUserAuthentication()
    })

    afterAll(() => {
      models.user.findByPk.mockReset()
    })

    describe('isUserAuthenticated', () => {
      it('should return false', () => expect(context.isUserAuthenticated()).toBe(false))
    })

    describe('getAuthenticatedUser', () => {
      it('should not call', () => expect(models.user.findByPk).not.toHaveBeenCalled())
      it('should return null', () => expect(context.getAuthenticatedUser()).toBeNull())
    })
  })

  describe('with a user', () => {
    const fakeUserFromToken = { sub: 'fake id', username: 'fake username' }

    let context
    beforeAll(() => {
      context = buildUserAuthentication({ req: { user: fakeUserFromToken } })
    })

    describe('isUserAuthenticated', () => {
      it('should return true', () => expect(context.isUserAuthenticated()).toBe(true))
    })

    describe('getAuthenticatedUser', () => {
      const fakeUserFromDB = { }

      let result
      beforeAll(async () => {
        models.user.findByPk.mockReturnValueOnce(fakeUserFromDB)
        result = await context.getAuthenticatedUser()
      })

      it('should call User#findByPk once', () => expect(models.user.findByPk).toHaveBeenCalledTimes(1))
      it('should call User#findByPk with the id from the passed user', () => {
        expect(models.user.findByPk).toHaveBeenCalledWith(fakeUserFromToken.sub)
      })
      it('should return the user obtained from User#findByPk', () => expect(result).toBe(fakeUserFromDB))
    })
  })
})
