require('dotenv').config()
const app = require('./src/app')
const connectToDatabase = require('./src/config/database')
const dns = require('dns')

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])


const PORT = 3000

connectToDatabase()

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})