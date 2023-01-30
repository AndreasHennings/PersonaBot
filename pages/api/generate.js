import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    const apiKey = req.body.technical["api-key"] || '';
    if (apiKey.trim().length === 0) {
      res.status(500).json({
        error: {
          message: "OpenAI API key not configured, please follow instructions in README.md",
        }
      });
      return;
    }
    configuration.apiKey = apiKey;
  }

  const prompt = req.body.prompt || '';
  

  try {
    const completion = await openai.createCompletion({
      model: req.body.technical.model || "text-davinci-002",
      prompt: prompt,
      temperature: req.body.technical.temperature || 0.5,
      max_tokens: req.body.technical["max_tokens"] || 40,
      top_p: req.body.technical["top_p"] || 1,
      frequency_penalty: req.body.technical["frequency_penalty"] || 0,
      presence_penalty: req.body.technical["presence_penalty"] || 0,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
