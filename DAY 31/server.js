import app from './src/app.js'
import {createServer } from 'http'
import { Server } from 'socket.io'

const httpServer = createServer(app)
const io = new Server(httpServer,{/* options */})

io.on('connection', (socket) => {
    console.log('New connection is created');
});

httpServer.listen(3000, () => {
    console.log("Server is running at port 3000");
});