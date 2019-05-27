export default class InvalidCredentialsError extends Error {
  constructor (...args) {
    if (args.length !== 0) {
      super(...args)
    } else {
      super('Invalid username and/or password')
    }
  }
}
