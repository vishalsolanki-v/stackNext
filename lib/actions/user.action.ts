"use server"

import User from "@/database/User.model";
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, GetSavedQuestionsParams, GetUserByIdParams, GetUserStatsParams, ToggleSaveQuestionParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/Question.model";
import Tag from "@/database/Tags.model";
import { FilterQuery } from "mongoose";
import Answer from "@/database/Answer.model";

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

export async function getAllUsers(params:GetAllUsersParams){
    try {
        connectToDatabase();
        // const {page = 1, pageSize = 20, filter, searchQuery} = params;
        const Users = await User.find({})
        .sort({createdAt:-1});
        return {Users};
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

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();
    const { clerkId } = params;
    const user = await User.findOneAndDelete({ clerkId });
    if (!user) {
      throw new Error("not found User");
    }

    // get user question ids
    // const userQuestionIds = await Question.find({author:user._id})
    //     .distinct('_id')

    await Question.deleteMany({ author: user._id });
    const deletedUser = User.findByIdAndDelete(user._id);

    return deletedUser;
    // revalidatePath(path)
  } catch (error) {
    console.info(error);
    throw error;
  }
}

export async function toggleSavedQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();
    const { userId, questionId, path } = params;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User Not Found");
    }
    const isQuestionSaved = user.saved.includes(questionId);
    if (isQuestionSaved) {
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: { saved: questionId },
        },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { saved: questionId },
        },
        { new: true }
      );
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();
    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });
    if (!user) {
      throw new Error("No User Found!");
    }
    const savedQuestions = user?.saved;
    return { questions: savedQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return console.log("No User Found");
    }
    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });
    return { user, totalQuestions, totalAnswers };
  } catch (error) {
    console.info(error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    await connectToDatabase();
    const { userId,page = 1,pageSize=10 } = params;
    const totalQuestion = await Question.countDocuments({ author: userId });
    const userQuestions = await Question.find({author:userId})
    .sort({views:-1,upvotes:-1})
    .populate({path:'tags',model:Tag,select:'_id name'})
    .populate('author','_id name clerkId picture')
    return {totalQuestion,questions: userQuestions}
  } catch (error) {
    console.info(error);
    throw error;
  }
}