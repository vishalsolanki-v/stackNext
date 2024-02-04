"use server"

import Question from "@/database/Question.model";
import { connectToDatabase } from "../mongoose"
import Tags from "@/database/Tags.model";

export const createQuestion = async(params:any)=>{
    try { 
        connectToDatabase();
        const {title,content,tags,author,path} = params;
        const question = await Question.create({
            title,
            content,
            author,
        })
        const tagDocuments = [];
        for (const tag of tags){
            const existingTag = await Tags.findOneAndUpdate({name:{$regex:new RegExp(`^${tag}$`,"i")}},
                {$setOnInsert:{name:tag},$push:{question:question._id}},
                {upsert:true,new:true})
            tagDocuments.push(existingTag._id);
        }
        await Question.findByIdAndUpdate(question._id,{
            $push:{tags:{$each:tagDocuments}}
        })

    } catch (error) {
        
    }
}