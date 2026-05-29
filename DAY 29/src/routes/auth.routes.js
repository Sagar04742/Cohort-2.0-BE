import express,{Router} from 'express'
import { register } from '../controllers/auth.controller.js'
import handleError from '../middlewares/error.middleware.js'


const authRouter = express.Router()

authRouter.post('/register', register , handleError )

export default authRouter

