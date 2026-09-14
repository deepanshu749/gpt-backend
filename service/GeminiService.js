import { GoogleGenAI } from "@google/genai";


export const generateAIResponse = async({model,messages})=>{
    
    // interaction contains reply from ai
    const interaction = await ai.interactions.create({
    model: "gemini-3.8-flash",
    input: messages,
});

const aiReply = interaction.output_text;

if(!aiReply){
    throw new Error("AI reponse is empty");
}

const promptTokens = interaction.usage?.input_tokens || 0;
const completionTokens = interaction.usage?.output_tokens || 0;

return {
    aiReply,
    usage:{
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
    }
}
}