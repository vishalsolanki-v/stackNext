"use server"

import User from "@/database/User.model";
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, GetUserByIdParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/Question.model";

export async function createUser(userData:CreateUserParams){
    try {
        connectToDatabase();
        const newUser = await User.create(userData);
        return newUser;
    } catch (error) {
        console.info(error);
        throw error; 
    }
}
export async function updateUser(params:UpdateUserParams){
    try {
        connectToDatabase();
        const {clerkId,updateData,path} = params; 
        await User.findOneAndUpdate({ clerkId},updateData,{
            new:true
        });
        revalidatePath(path)
    } catch (error) {
        console.info(error);
        throw error; 
    }
}

export async function getUsers(){
    try {
        connectToDatabase();
        const allUsers = await User.find({});
        return allUsers;
    } catch (error) {
       console.error(error)
       throw error; 
    }
}

export async function getUserById(params:GetUserByIdParams){
    try {
        connectToDatabase();
        const {userId} = params;
        const user = await User.findOne({ clerkId : userId });
        return user;  
    } catch (error) {
        console.info(error);
        throw error; 
    }
}

export async function deleteUser(params:DeleteUserParams){
    try {
        connectToDatabase();
        const {clerkId} = params; 
        const user =  await User.findOneAndDelete({clerkId});
        if(!user){
            throw new Error('not found User')
        }

        // get user question ids
        // const userQuestionIds = await Question.find({author:user._id})
        //     .distinct('_id')

        await Question.deleteMany({author:user._id});
        const deletedUser = User.findByIdAndDelete(user._id);

        return deletedUser;
        // revalidatePath(path)
    } catch (error) {
        console.info(error);
        throw error; 
    }
}