"use server"

import Question from "@/database/Question.model";
import { connectToDatabase } from "../mongoose"
import Tag from "@/database/Tags.model";
import { CreateQuestionParams, GetQuestionByIdParams, GetQuestionsParams, QuestionVoteParams } from "./shared.types";
import User from "@/database/User.model";
import { revalidatePath } from "next/cache";

export const getQuestion = async (params:GetQuestionsParams) => {
    try {
        connectToDatabase();
        const questions = await Question.find({})
            .populate({path:'tags',model:Tag})
            .populate({path:'author',model:User})
            .sort({createdAt:-1})
        return {questions}
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const createQuestion = async(params:CreateQuestionParams)=>{
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
            const existingTag = await Tag?.findOneAndUpdate({name:{$regex:new RegExp(`^${tag}$`,"i")}},
                {$setOnInsert:{name:tag},$push:{questions:question._id}},
                {upsert:true,new:true})
            tagDocuments?.push(existingTag._id);
        }
        await Question.findByIdAndUpdate(question._id,{
            $push:{tags:{$each:tagDocuments}}
        })
        revalidatePath(path)
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const getQuestionById = async (params:GetQuestionByIdParams)=>{
try {
   connectToDatabase();
   const {questionId} = params;
   const question =  await Question.findById(questionId)
   .populate({path:'tags',model:Tag,select:'_id name'})
   .populate({path:'author',model:User,select:'_id clerkId name picture'})
   if(!question){
    return console.info('no question found')
   }
   return question;
} catch (error) {
    console.info(error);
    throw error;
}
}

export const upVoteQuestion = async (params: QuestionVoteParams) => {
  try {
    connectToDatabase();
    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;
    // console.info(typeof questionId,'questionId')
    let updateQuery = {};
    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });
    if (!question) {
      throw new Error("Question Not Found");
    }
    // reputations add user

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const downVoteQuestion = async (params:QuestionVoteParams)=>{
    try {
        connectToDatabase();
        const { questionId, userId, hasupVoted, hasdownVoted, path } = params;
        let updateQuery = {};
        if(hasdownVoted){
            updateQuery = {$pull:{downvotes:userId}}
        }
        else if(hasupVoted){
            updateQuery={
                $pull:{upvotes:userId},
                $push:{downvotes:userId}
            }
        }else{
            updateQuery = {addToSet:{downvotes:userId}}
        }

        const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
            new: true,
          });
          if (!question) {
            throw new Error("Question Not Found");
          }
          // reputations add user
          revalidatePath(path);

    } catch (error) {
        console.log(error);
        throw error;
    }
}