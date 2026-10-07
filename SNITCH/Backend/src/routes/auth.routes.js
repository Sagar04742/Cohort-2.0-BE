import express from 'express'
import { validateRegisterUser } from '../validator/auth.validator.js'
import { register } from '../controllers/auth.controller.js'

const authRouter = express.Router()

authRouter.post('/register', validateRegisterUser, register)


export default authRouter