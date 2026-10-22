// we cant send files inside the JSON.
// expres cant handle files defaultly.
// we have to get the Multer middleware to do this file handling.

import {Request, Response} from "express"
import { UserModel } from "../models/user.model"
import { uploadImage } from "../services/storage.services"
import { ArticleModel } from "../models/article.model"
import { generateArticleDescription } from "../services/ai.service"

export const createArticle = async (req:Request, res:Response) => {
    // req.file => you can do operations with files here now.
    const{title, content, tags} = req.body

    // AWS s3 Buckets, cloudanary, Supabase storage, Firebase Storage, Azure, gcp (you can also try google drive but not recommended) we use them because we dont store images in out backend folder. we host them in these services.
    try{
        if(!req.user){
            return res.status(404).json({message:"Unauthorized !..."})
        }

        const userId = req.user.sub
        const user = await UserModel.findById(userId).select("-password")

        if(!user){
            return res.status(404).json({message:"User Not Found !..."})
        }

        const imageURL = req.file ? await uploadImage(req.file, "articles") : "" // if there's a file, we upload it to the storage and get the URL. if not, we set it to an empty string.
        
        const article = await ArticleModel.create({
            title,
            content,
            author: user._id,
            imageURL,
            tags: tags ? JSON.parse(tags):[]
    })
    res.status(201).json({message:"Article Created Successfully !", data:article})
    } catch(error){
        console.error("Error in creating article", error)
        res.status(500).json({message:"Failed to Create Article !..."})
}}


// 100,000 -> 3 seconds (if 3 seconds going to fetch data, which consumes time to both fetch data and send to frontend,)
// article?test=20
export const getAllArticle = async(req:Request, res:Response) => {
    try{

        const page = parseInt(req.query.page as string) || 1 // we have a maths calculation part here to do. so we need these as numbers
        const limit = parseInt(req.query.limit as string) || 10

        // in springboot, we have a bean to do this. but we dont have a thing like that here.

        // 1st page -> first 10 data
        // 2nd page -> skip 1st 10 data set and 10 data set after that.
        // 3rd page -> skip 1st 20 data set and 10 dataset after that.
        // skiping pattern - 0, 10, 20 ,30

        const skip = (page - 1) * limit

        const articles = await ArticleModel.find({isVisible:true})
        .populate( // getting the author details too from this.
            "author",
            "name email"
        ).sort({createdAt:-1}) // -1 means descending order, 1 means ascending order.
        .skip(skip)
        .limit(limit)
        // how to know how many pages are there? to know the last page...

        const total = await ArticleModel.countDocuments({isVisible:true}) // to know how many pages are there, we need to know how many documents are there in total. so we can use this method to get the count of documents.
        res.status(200).json({message:"Success !", data:articles, meta:{page,limit, total, totalPage: Math.ceil(total/ limit)}} // ciel - rounds the numbers. if page count got as a decimal, it will give a whole number. 2.5 => 3 pages.
        )
    }
    catch(error){
        res.status(500).json({message:"Failed to Get Articles !..."})
    }
}

export const generateDescription = async(req:Request,res:Response) => {
    const { text } = req.body

    try{
        const result = await generateArticleDescription(text)
        res.status(200).json({data:result})
    }
    catch(error){
        res.status(500).json({message:"Internal Server Error"})
        console.log(error)
    }
}