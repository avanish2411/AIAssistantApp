import { apiKey } from "../Constants/DummyMessages";
import axios from "axios";

const client = axios.create({
    headers: {
        "Authorization": "Bearer " + apiKey, // Added space after 'Bearer'
        "Content-Type": "application/json"
    }
});

const chatGptEndPoint = 'https://api.openai.com/v1/chat/completions';
const dalleEndPoint = 'https://api.openai.com/v1/images/generations';

export const apiCall = async (prompt, messages) => { // Added type annotation for 'prompt' and 'messages'
    try {
        const res = await client.post(chatGptEndPoint, {
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'user',
                content: `Does this message want to generate an AI picture, image, art, or anything similar? ${prompt} . Simply answer with yes or no`
            }]
        });

        let isArt = res.data?.choices[0]?.message?.content;
        if (isArt.tolowerCase().includes('yes')) {
            console.log('dalle api call');
            return dalleEndCall(prompt, messages || [])
        } else {
            console.log('chat gpt api call');
            return chatGptEndCall(prompt, messages || [])
        }

    } catch (error) { // Added type annotation for 'error'
        console.log("error", error);
        return Promise.resolve({ success: false, msg: error.message }); // Changed 'error.messages' to 'error.message'
    }
}

const chatGptEndCall = async (prompt, messages) => {
    try {
        const res = await client.post(chatGptEndPoint, {
            model: 'gpt-3.5-turbo',
            messages
        });
        let answer = res.data?.choices[0]?.message?.content;
        messages.push({ role: 'assistant', content: answer.trim() })
        return Promise.resolve({ success: true, data: messages });
    } catch (error) {
        console.log("error", error);
        return Promise.resolve({ success: false, msg: error.message });
    }
}

const dalleEndCall = async (prompt, messages) => {
    try {
        const res = await client.post(dalleEndPoint, {
            prompt,
            n: 1,
            size: "512x512"
        })
        let url = res?.data?.data[0]?.url;
        console.log('got url:', url);
        messages.push({ role: 'assistant', content: url.trim() });
        return Promise.resolve({ success: true, data: messages });
    } catch (error) {
        console.log("error", error);
        return Promise.resolve({ success: false, msg: error.message });
    }
}