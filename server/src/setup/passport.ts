import { User, IUser } from '../models/user';
import bcrypt from 'bcrypt';
import passportLocal from 'passport-local';
import passport, { PassportStatic } from 'passport';
import { NativeError } from 'mongoose';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { JWT_SECRET } from '../utils/Jwt';

let LocalStrategy = passportLocal.Strategy;

export default function(passport: PassportStatic) {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                session: false,
            },
            (email, password, done) => {
                email = email.toLowerCase();
                User.findOne({
                    email: email,
                })
                    .then(user => {
                        if (!user) return done(null, false);
                        bcrypt.compare(
                            password,
                            (user as any).password,
                            (err, result) => {
                                if (err)
                                    return done(null, false, {
                                        message: err.message,
                                    });
                                if (result) return done(null, user);
                                else return done(null, false);
                            },
                        );
                    })
                    .catch(err => {
                        done(err, false);
                    });
            },
        ),
    );

    passport.use(
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: JWT_SECRET,
            },
            (jwtPayload, done) => {
                User.findOne({
                    email: jwtPayload.email,
                })
                    .then(user => {
                        if (user) return done(null, user);
                        else return done(null, false);
                    })
                    .catch(err => {
                        done(err, false);
                    });
            },
        ),
    );
}
