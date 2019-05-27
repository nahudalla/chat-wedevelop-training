export default class InvalidCredentialsError extends Error {
  constructor (message) {
    super(message || 'Invalid username and/or password')
  }
}
