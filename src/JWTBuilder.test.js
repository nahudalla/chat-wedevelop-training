/* global it, describe, expect, beforeAll, jest */

import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

const JWTSecret = 'test secret'
const JWTDuration = '10d'

process.env.JWT_SECRET = JWTSecret
process.env.JWT_DURATION = JWTDuration

const JWTBuilder = require('./JWTBuilder')

it('return a function by default', () => {
  expect(JWTBuilder).toBeInstanceOf(Function)
})

describe('calling it', () => {
  const tokenPayload = { id: 123, username: 'test' }
  const fakeToken = 'fake token'

  let result
  beforeAll(() => {
    jwt.sign.mockReturnValueOnce(fakeToken)
    result = JWTBuilder(tokenPayload)
  })

  it('should call jsonwebtoken#sign only once', () => {
    expect(jwt.sign).toHaveBeenCalledTimes(1)
  })

  it('should call jsonwebtoken#sign with the passed payload, without id, as its first parameter', () => {
    const { id, ...payload } = tokenPayload
    expect(jwt.sign.mock.calls[0][0]).toStrictEqual(payload)
  })

  it('should call jsonwebtoken#sign with the configured secret as its second parameter', () => {
    expect(jwt.sign.mock.calls[0][1]).toBe(JWTSecret)
  })

  it('should call jsonwebtoken#sign with the configured duration and sub property set to the id in the options object', () => {
    const { id } = tokenPayload
    expect(jwt.sign.mock.calls[0][2]).toStrictEqual({ expiresIn: JWTDuration, subject: id })
  })

  it('should return the token returned by jsonwebtoken#sign', () => {
    expect(result).toBe(fakeToken)
  })
})
