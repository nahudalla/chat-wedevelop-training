/* global it, expect, describe, beforeAll */

import queryResolver from './query'
import { user as User, sequelize } from '../../models'

const TEST_USERS = [
  {
    username: 'user1',
    firstName: 'user1 fn',
    lastName: 'user1 ln',
    password: 'user1 password'
  },
  {
    username: 'user2',
    firstName: 'user2 fn',
    lastName: 'user2 ln',
    password: 'user2 password'
  },
  {
    username: 'user3',
    firstName: 'user3 fn',
    lastName: 'user3 ln',
    password: 'user3 password'
  }
]

beforeAll(async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Environment is not "test". Database models synchronization rejected to avoid unwanted schema changes.')
  }

  await sequelize.sync()

  for (let user of TEST_USERS) {
    const dbUser = await User.create(user)
    user.id = dbUser.id
  }
})

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
    let result
    beforeAll(() => {
      result = queryResolver.Query.users()
    })

    it('should return a Promise-like object', () => {
      expect(result).toMatchObject(Promise.prototype)
    })

    it('should return all users in the database', () => {
      expect(result).resolves.toEqual(TEST_USERS)
    })
  })
})

describe('Query#user', () => {
  it('should exist and be a function', () => {
    expect(queryResolver.Query).toHaveProperty('user', expect.any(Function))
  })

  describe('using it', () => {
    let results
    beforeAll(() => {
      results = TEST_USERS.map(user => ({
        returned: queryResolver.Query.user(null, { id: user.id }),
        expected: user
      }))
    })

    it('should return a Promise-like object', () => {
      results.forEach(result => {
        expect(result.returned).toMatchObject(Promise.prototype)
      })
    })

    it('should return the information for the requested user', () => {
      results.forEach(result => {
        expect(result.returned).resolves.toEqual(result.expected)
      })
    })

    it('should return null for a non-existent user id', () => {
      const result = queryResolver.Query.user(null, { id: 'non-existent-user-id' })
      expect(result).resolves.toBe(null)
    })
  })
})
