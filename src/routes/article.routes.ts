import {Router} from "express"
import { createArticle, getAllArticle , generateDescription} from "../controllers/article.controller"
import {upload} from "../middleware/upload"
import { authenticate } from "../middleware/auth"
import { generateArticleDescription } from "../services/ai.service"

const router = Router()
// ADMIN, WRITER
router.post("/create",authenticate,upload.single("image"), createArticle)

router.get("/all", getAllArticle)

router.post("/ai",generateDescription)

// http://localhost:3000/api/vi/articles/ai

// body -> "text":"react" -> becomes, "what is react" in backend.

// "image":file

export default router