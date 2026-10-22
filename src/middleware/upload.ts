import multer from "multer"

// multer.diskStorage => this is hard storage. this is slow. so we use RAM (memoryStorage). 
const storage = multer.memoryStorage()

export const upload = multer({
    storage
})

// 320, 768, 1440