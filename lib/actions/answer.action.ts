"use server"
import Answer from '@/database/Answer.model';
import { connectToDatabase } from '../mongoose';
import { CreateAnswerParams, GetAnswersParams } from './shared.types';
import Question from '@/database/Question.model';
import { revalidatePath } from 'next/cache';

export const createAnswer = async(params:CreateAnswerParams) =>{
    try {
        connectToDatabase();
        const { content,author,question,path} = params;
        const newAnswer = await Answer.create({ content,author,question })
        await Question.findByIdAndUpdate(question,{
            $push:{answers:newAnswer._id}
        })
        console.log(newAnswer,'newAnswer')
        // TODO: Add interaction...
        revalidatePath(path);
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const getAnswer = async (params:GetAnswersParams)=>{
    try {
        connectToDatabase();
        const {questionId} = params;
        const answers = await Answer.find({question:questionId})
        .populate("author","_id clerkId name picture")
        .sort({createdAt:-1})
        return {answers};
    } catch (error) {
        console.log(error);
        throw error;
    }
}