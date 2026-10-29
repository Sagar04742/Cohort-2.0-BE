import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import passport from './config/passport.js'
import { config } from './config/config.js'
import authRouter from './routes/auth.routes.js'

const app = express()

app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true,
}))

app.use(passport.initialize())

app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth/",authRouter)

export default app
