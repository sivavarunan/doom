import axios, { AxiosError } from 'axios';

const maxRetries = 10; // Maximum number of retry attempts

// Function to delay for a given amount of time (ms)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchChatGPTResponse = async (message: string): Promise<string | undefined> => {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('API key is not defined');
  }

  // Log the message that is being sent
  console.log('Sending message to ChatGPT:', message);

  // Prevent sending empty messages
  if (!message.trim()) {
    console.error('Error: Message content is empty. No request sent to ChatGPT.');
    return 'Message content cannot be empty.';
  }

  let retries = 0;

  while (retries <= maxRetries) {
    try {
      const data = {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        max_tokens: 150,
      };

      // Log the full payload before sending the request
      console.log('Payload to be sent:', JSON.stringify(data, null, 2));

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        data,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Log the response from the ChatGPT API
      console.log('Received response from ChatGPT:', response.data);

      return response.data.choices[0]?.message?.content || 'No response text';

    } catch (err) {
      // Type cast the error to AxiosError
      const error = err as AxiosError;

      console.error('Error:', error);

      if (error.response?.status === 429) {
        const waitTime = 1000 * Math.pow(2, retries); // Exponential backoff
        console.error(`429 Too Many Requests. Retrying in ${waitTime} ms... (Attempt ${retries + 1})`);
        await delay(waitTime); // Wait for retry
        retries++;
      } else {
        // Re-throw the error if it's not a rate-limiting issue
        throw error;
      }
    }
  }

  // Return undefined if no response is received after all retries
  return undefined;
};
