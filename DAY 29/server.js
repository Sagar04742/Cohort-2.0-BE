import app from './src/app.js'
import authRouter from './src/routes/auth.routes.js'


app.use('api/auth', authRouter)

app.listen(3000, ()=>{
    console.log("Server is running at PORT 3000")
})