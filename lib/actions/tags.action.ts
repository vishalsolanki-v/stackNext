"use server"

import User from "@/database/User.model";
import { connectToDatabase } from "../mongoose"
import {  GetTopInteractedTagsParams } from "./shared.types"

export const getTopInteractiveTags = async (params:GetTopInteractedTagsParams)=>{
    try {
       connectToDatabase();
       const {userId} = params;
       const user = await User.findById({_id:userId}) ;
       if(!user){
        return console.info('no user found');
       }
    //    have to do tags logic implementation
    return [{_id:'1',name:'tag1'},{_id:'2',name:'tag2'},{_id:'3',name:'tag3'}];
    } catch (error) {
        console.error(error);
        throw error;
    }
}