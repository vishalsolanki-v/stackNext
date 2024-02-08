import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async()=>{
    
    mongoose.set('strictQuery', true);
    if(!process.env.MONGODB_URL){
        return console.error('MISING MONGOODB URL');
    }
    if(isConnected){
        return console.info('Database has been already connected');
    }
    try {
        await mongoose.connect(process.env.MONGODB_URL,{
            dbName:'vishaldevflow'
        })
        isConnected = true;
        console.info('Connected to database');
    } catch (error) {
        console.error('Failed to connect to database', error);  
    }
}