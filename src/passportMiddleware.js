import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { getJWTSecret } from './JWTBuilder'

const passportJwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: getJWTSecret()
}

passport.use(new JwtStrategy(
  passportJwtOptions,
  (jwtPayload, done) => done(null, jwtPayload)
))

passport.initialize()

export default (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      next(err)
    } else {
      req.user = user || null
      next()
    }
  })(req, res, next)
}
