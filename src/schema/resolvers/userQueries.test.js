/* global jest, it, expect, describe, beforeAll */

import queryResolver from './userQueries'
import { user as User } from '../../models'

jest.mock('../../models')

it('should export an object by default', () => {
  expect(queryResolver).toBeInstanceOf(Object)
})

it('should have a "Query" property of type Object', () => {
  expect(queryResolver).toHaveProperty('Query', expect.any(Object))
})

describe('Query#users', () => {
  it('should exist and be a function', () => {
    expect(queryResolver.Query).toHaveProperty('users', expect.any(Function))
  })

  describe('using it', () => {
    const returnData = [ ]

    let result
    beforeAll(() => {
      User.findAll.mockReturnValueOnce(Promise.resolve(returnData))
      result = queryResolver.Query.users()
    })

    it('should call User#findAll only once', () => {
      expect(User.findAll).toHaveBeenCalledTimes(1)
    })

    it('should call User#findAll without arguments', () => {
      expect(User.findAll).toHaveBeenCalledWith()
    })

    it('should return a Promise-like object', () => {
      expect(result).toMatchObject(Promise.prototype)
    })

    it('should return the same as User#findAll', () => {
      expect(result).resolves.toBe(returnData)
    })

    it('should reject when User#findAll rejects', () => {
      User.findAll.mockReturnValueOnce(Promise.reject(new Error('test-rejection')))
      expect(queryResolver.Query.users()).rejects.toBeInstanceOf(Error)
    })
  })
})

describe('Query#user', () => {
  it('should exist and be a function', () => {
    expect(queryResolver.Query).toHaveProperty('user', expect.any(Function))
  })

  describe('using it', () => {
    const returnData = { }
    const id = 'test-id'
    const resolverArguments = [null, { id }]

    let result
    beforeAll(() => {
      User.findByPk.mockReturnValueOnce(Promise.resolve(returnData))
      result = queryResolver.Query.user(...resolverArguments)
    })

    it('should call User#findByPk only once', () => {
      expect(User.findByPk).toHaveBeenCalledTimes(1)
    })

    it('should call User#findAll with the id as parameter', () => {
      expect(User.findByPk).toHaveBeenCalledWith(id)
    })

    it('should return a Promise-like object', () => {
      expect(result).toMatchObject(Promise.prototype)
    })

    it('should return the same as User#findByPk', () => {
      expect(result).resolves.toBe(returnData)
    })

    it('should reject when User#findByPk rejects', () => {
      User.findByPk.mockReturnValueOnce(Promise.reject(new Error('test-rejection')))
      const result = queryResolver.Query.user(...resolverArguments)
      expect(result).rejects.toBeInstanceOf(Error)
    })
  })
})
