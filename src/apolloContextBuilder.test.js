/* global it, expect, describe, beforeAll */

import 'dotenv/config'

import contextBuilder from './apolloContextBuilder'
import models from './models'
import JWTBuilder from './JWTBuilder'

it('should export a function by default', () => {
  expect(contextBuilder).toBeInstanceOf(Function)
})

describe('calling the builder', () => {
  let result
  beforeAll(() => {
    result = contextBuilder()
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
})
