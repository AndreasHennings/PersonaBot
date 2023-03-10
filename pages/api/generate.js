import { Configuration, OpenAIApi } from "openai";

export default async function (req, res) {
  let configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

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
    configuration = new Configuration({
      apiKey: apiKey,
    });
  }

  const openai = new OpenAIApi(configuration);

  const prompt = req.body.prompt || '';
  

  try {
    const completion = await openai.createCompletion({
      model: req.body.technical.model || "text-davinci-003",
      prompt: prompt,
      temperature: Number(req.body.technical.temperature) || 0.5,
      max_tokens: Number(req.body.technical["max_tokens"]) || 40,
      top_p: Number(req.body.technical["top_p"]) || 1,
      frequency_penalty: Number(req.body.technical["frequency_penalty"]) || 0,
      presence_penalty: Number(req.body.technical["presence_penalty"]) || 0,
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
