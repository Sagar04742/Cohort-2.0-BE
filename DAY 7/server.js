require('dotenv').config()
const app = require('./src/app')
const connectToDb = require('./src/config/database')

const PORT = 3000

connectToDb()

app.listen(PORT,()=>{
    console.log('Server started at PORT 3000')
})