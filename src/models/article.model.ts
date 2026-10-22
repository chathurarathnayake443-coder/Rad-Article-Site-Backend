import { timeStamp } from "console"
import {Schema, Types, model} from "mongoose"
import { ref } from "process"

export interface IArticle{
    title: string
    content: string
    author: Types.ObjectId
    imageURL: string
    tags: string[]
    isVisible: boolean
    favorites: Types.ObjectId[]
    createdAt: Date
    updatedAt: Date
}

// here we have to add a user too, we can add the user id for that. there are nothing called foriegn keys here now.

// you can use Type for ids we gettingfrom other ones like mongo DB...

const articleSchema = new Schema<IArticle>({
    title:{type:String, required:true},
    content:{type:String, required:true},
    author:{
        type: Schema.Types.ObjectId,
        ref:"system_users",
        required:true
    },
    imageURL:{type:String, default:""},
    tags:{type:[String], default:[]},
    isVisible:{type:Boolean, default:true},
    favorites:[{type: Schema.Types.ObjectId, ref:"system_users"}]
}, {timestamps:true})

export const ArticleModel = model<IArticle>("articles",articleSchema)


// if we convert image to base64, it increases the characters. so it takes more storage from your DB. so it is not good.
// so we have to handle these files and images to not take that much more storage from database.