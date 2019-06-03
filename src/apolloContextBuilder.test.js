/* global it, expect, describe, beforeAll */

import 'dotenv/config'

import contextBuilder from './apolloContextBuilder'
import buildContextUserAuthentication from './apolloContextUserAuthentication'
import models from './models'
import JWTBuilder from './JWTBuilder'

it('should export a function by default', () => {
  expect(contextBuilder).toBeInstanceOf(Function)
})

describe('calling the builder', () => {
  const fakeRequestContext = { req: { user: null } }

  let result
  beforeAll(() => {
    result = contextBuilder(fakeRequestContext)
  })

  it('should return an Object', () => {
    expect(result).toBeInstanceOf(Object)
  })

  it('should return all models in a "models" key', () => {
    expect(result.models).toBe(models)
  })

  it('should return the JWTBuilder function in a "createTokenForUser" key', () => {
    expect(result.createTokenForUser).toBe(JWTBuilder)
  })

  it('should return everything from apolloContextUserAuthentication', () => {
    const userAuthentication = buildContextUserAuthentication()
    expect(result).toMatchPropertiesTypes(userAuthentication)
  })
})

expect.extend({
  toMatchPropertiesTypes (received, expected) {
    const expectedKeys = Object.keys(expected)

    for (const key of expectedKeys) {
      const expectedType = typeof expected[key]
      const receivedType = typeof received[key]

      if (receivedType !== expectedType) {
        return {
          message: `expected received[${key}] to be of type '${expectedType}' but instead got '${receivedType}'`,
          pass: false
        }
      }
    }

    return {
      message: 'expected "received" to have all properties from "expected", with the same types',
      pass: true
    }
  }
})
