"use server"

import User from "@/database/User.model";
import { connectToDatabase } from "../mongoose"

export async function getUserById(params:any){
    try {
        connectToDatabase();
        const {userId} = params;
        // console.info(userId,'userIdn',params)
        const user = await User.findOne({ clerkId : userId });
        // console.info(user,'user');
        return user;  
    } catch (error) {
        console.info(error);
        throw error; 
    }
}