"use server"

import User from "@/database/User.model";
import { connectToDatabase } from "../mongoose"
import {  GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from "./shared.types"
import Tag, { Itags } from "@/database/Tags.model";
import Question from "@/database/Question.model";
import { FilterQuery } from "mongoose";

export const getAllTags = async (params:GetAllTagsParams) => {
    try {
        connectToDatabase();
        const tags = await Tag?.find({});
        return {tags};
    } catch (error) {
      console.error(error);  
      throw error;
    }
}

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

export const getQuestionByTagId = async (params: GetQuestionsByTagIdParams) => {
  try {
    connectToDatabase();
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;
    const tagFilter: FilterQuery<Itags> = {_id:tagId}
    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match:searchQuery?{title:{$regex:searchQuery,$options:'i'}}:{},
      options: {
        sort: { createAt: -1 },
      },
      populate: [
        { path: "author", model: User, select: "_id clerkId name picture" },
        {path:'tags',model:Tag,select:"_id name"}
      ],
    });
    if (!tag) {
      return console.log("No Tag Found");
    }
    return { tagTitle:tag?.name,questions: tag?.questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
