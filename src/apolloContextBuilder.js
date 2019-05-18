import models from './models'
import JWTBuilder from './JWTBuilder'

export default () => {
  return {
    models,
    createTokenForUser: JWTBuilder
  }
}
