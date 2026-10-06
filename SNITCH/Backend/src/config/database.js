import dns from 'node:dns'
import mongoose from 'mongoose'
import { config } from './config.js';

dns.setServers(['8.8.8.8', '1.1.1.1'])

const connectToDb = async () => {
    await mongoose.connect(config.MONGO_URI);
    console.log("MongoDB connected")
}

export default connectToDb
