import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY,
});

export const getClaudeResponse = async (message) => {
  try {
    const response = await anthropic.completions.create({
      model: "claude-3-sonnet-20240229",
      max_tokens_to_sample: 300,
      prompt: `Human: ${message}\n\nAssistant:`,
    });

    return response.completion;
  } catch (error) {
    console.error('Error calling Claude AI API:', error);
    return "Sorry, I'm having trouble connecting right now. Please try again later.";
  }
};