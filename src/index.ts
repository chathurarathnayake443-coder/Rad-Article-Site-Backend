import express, { type Request, type Response } from "express"
import AuthRouter from "./routes/auth.routers"
import ArticleRouter from "./routes/article.routes"
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

import cors from "cors"

const MONGO_URL = process.env.MONGO_LOCAL_URL || ""
const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())

app.use(cors())

app.use("/api/v1/auth", AuthRouter)
app.use("/api/v1/articles", ArticleRouter) 

app.get("/",(req,res) => { // sample API
  res.status(200).json({message:"Test API Successfull !"})
})

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("DB connected..!")

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
  console.error("Fail to connect DB..!")
  console.error(err.message)
})
