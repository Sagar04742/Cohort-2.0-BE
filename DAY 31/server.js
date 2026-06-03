import app from './src/app.js'
import {createServer } from 'http'
import { Server } from 'socket.io'

const httpServer = createServer(app)
const io = new Server(httpServer,{/* options */})

io.on('connection', (socket) => {
    console.log('New connection is created');

    socket.on("message",(msg)=>{
        console.log("User fired a message event");
        console.log(msg)
        io.emit("abc")
    })
});

//socket.emit()
//socket.broadcast.emit()
//io.emit()

httpServer.listen(3000, () => {
    console.log("Server is running at port 3000");
});