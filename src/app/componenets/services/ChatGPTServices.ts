// services/ChatGPTServices.ts
import axios from 'axios';

export const fetchChatGPTResponse = async (message: string) => {
  try {
    const response = await axios.post('/ChatGPT', {
      model: 'text-davinci-003',
      prompt: message,
      max_tokens: 150,
    });
    return response.data.choices[0]?.text || 'No response from ChatGPT.';
  } catch (error) {
    console.error('ChatGPT API error:', error);
    throw error;
  }
};
