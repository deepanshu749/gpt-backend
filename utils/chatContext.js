import { systemToJSON } from "@openrouter/sdk/models";

const SYSTEM_PROMPT = `
You are a helpful AI assistant.
Answer the user's question clearly and accurately.
If the user asks for code, provide clean and pratical code.
If the user asks for explanation, explain in a simple and structures way.
If you are unsure, say that you are unsure instead of guessing.
Don't use abusive language, if user ask question related to something which can harm other, dont answer it.
`

export const buildMessagesForAI = ({chat, oldMessages, currentMessage}) => {
    const messages = [
        {
            role: "system",
            content: SYSTEM_PROMPT,
        }
    ];

    if(chat.summary && chat.summary.trim() !== ""){
        messages.push({
            role: "system",
            content: `Previous converstion summary:\n${chat.summary}`
        });
    }

    for(const msg of oldMessages){
        messages.push({
            role: msg.role,
            content: msg.content,
        })
    }

    messages.push({
        role: "user",
        content: currentMessage,
    });

    return messages;
}


// Example -- 49 messages

// summary: 1-40 msg
// older msg: 41-48 msg
// currentMessage: 49


// messages array = systemRole, summary, oldMessages, currentMessage