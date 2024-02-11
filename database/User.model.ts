import { Schema,models,model,Document } from "mongoose";

export interface Iuser extends Document {
clerkId: string;
name: string;
username : string;
email: string;
password?: string;
bio?: string;
picture: string;
location?: string;
portfoliowebsite?: string;
reputation?:number;
saved: Schema.Types.ObjectId[];
joinedAt: Date;
}

const UserSchema = new Schema({
    clerkId: {type:String,required:true},
    name: {type:String,required:true},
    username : {type:String,required:true,unique:true},
    email: {type:String,required:true,unique:true},
    password: {type:String},
    bio: {type:String},
    picture: {type:String,required:true},
    location: {type:String},
    portfoliowebsite: {type:String},
    reputation:{type:Number,default:0},
    saved: [{type:Schema.Types.ObjectId,ref:'Question'}],
    joinedAt: {type:Date,default:Date.now},
})
// from here this line models.User is telling me that from users query data will
//  come 'User' has been changes to 'users'  by no idea why it has happen but it is happening
const User = models.User || model('User',UserSchema);
export default User;
