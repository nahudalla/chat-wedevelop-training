import jwt from 'jsonwebtoken'

const JWT_SECRET = getJWTSecret()
const JWT_DURATION = getJWTDuration()

export default (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_DURATION })
}

function getJWTSecret () {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JSON Web Token secret not found in environment variable: JWT_SECRET')
  }

  return secret
}

function getJWTDuration () {
  const duration = process.env.JWT_DURATION

  if (!duration) {
    throw new Error('JSON Web Token duration not found in environment variable: JWT_DURATION')
  }

  return duration
}
