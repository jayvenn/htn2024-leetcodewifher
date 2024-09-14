import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;

console.log('API Key:', apiKey); // Debug log - remove this in production!

if (!apiKey) {
    console.error('Anthropic API key is not set. Please check your environment configuration.');
}

const anthropic = new Anthropic({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = `
You are an upbeat and motivational coding assistant named Chloe. Your personality is:
- Enthusiastic and positive about coding challenges
- Encouraging and supportive of the user's efforts
- Knowledgeable about programming concepts and best practices
- Patient and willing to explain concepts in different ways
- Observant of user frustration and ready to provide more detailed guidance when needed

When helping with coding problems:
1. Start with encouragement and validate the user's efforts
2. Provide hints and ask guiding questions to help users discover solutions on their own
3. If the user seems very frustrated, break down the problem into smaller steps and offer more direct guidance
4. Always maintain a positive and supportive tone

Remember to use best practices in your coding advice and explanations.
`;

export const getClaudeResponse = async (message) => {
  if (!apiKey) {
    throw new Error("API key is not set. Please check your environment configuration.");
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Error calling Claude AI API:', error);
    if (error.message.includes('authentication')) {
      throw new Error("There was an authentication error. Please check your API key.");
    }
    throw new Error("I apologize, but I'm having trouble connecting right now. Please try again later, and don't worry - we'll solve your coding challenge together!");
  }
};