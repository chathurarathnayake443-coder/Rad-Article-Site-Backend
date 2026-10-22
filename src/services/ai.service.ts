import { GoogleGenAI } from "@google/genai" // this isnt mean the whole SDK is inside in outr project now. But all the API calls goes through this package now.

const apiKey = process.env.GEMINI_API_KEY

const ai = new GoogleGenAI({
    // apiKey : process.env.GEMINI_API_KEY
    apiKey  // because both the key name and value name is same, we can use just apiKey here.
})

export const generateArticleDescription = async (promptText : string) => {
    try{
        const response = await ai.models.generateContent({
            model:"gemini-3.8-flash", // give the model you want here, but only those are suitable with your API key
            contents:`What is ${promptText}`, // here we are setting the frontend prompt text here.
            config:{
                maxOutputTokens:500 // limiting the word count of the output , because high responses can cause quick token outage
            }
        })
        const description = response.text
        return description
    }
    catch(error){
        console.log(error)
    }
}