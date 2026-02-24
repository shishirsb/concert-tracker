import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.2",
  input: "Give me 5 headlines for these concert events: ",
});

console.log(response.output_text);
