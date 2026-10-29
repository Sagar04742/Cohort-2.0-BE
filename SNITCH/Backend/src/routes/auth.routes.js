import express from 'express'
import passport from 'passport'
import { validateRegisterUser, validateLoginUser } from '../validator/auth.validator.js'
import { register, login, googleLogin, getMe } from '../controllers/auth.controller.js'
import { authenticateUser } from '../middlewares/auth.middleware.js'
import { config } from '../config/config.js'

const authRouter = express.Router()

authRouter.post('/register', validateRegisterUser, register)

authRouter.post('/login', validateLoginUser, login)

authRouter.get('/me', authenticateUser, getMe)

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

authRouter.get('/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${config.FRONTEND_URL}/login?error=google`,
    }),
    googleLogin
);


export default authRouter
