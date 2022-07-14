import axios, { AxiosRequestConfig } from "axios";
// import { prompt } from "./prompt";
// console.log(prompt);
export const getGptData = async (prompt: string) => {
  const config: AxiosRequestConfig = {
    method: "post",
    url: "https://api.openai.com/v1/engines/text-davinci-002/completions",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SECRET}`,
    },
    data: {
      prompt: `${prompt}`,
      best_of: 1,
      max_tokens: 100,
      temperature: Math.round(Math.random() * 100) / 100,
      top_p: 1,
      // echo:true,
      n: 1,
      stop: ["--"],
      presence_penalty: 0.5,
      frequency_penalty: 0.43,
    },
  };

  try {
    const res = await axios(config);
    return res.data["choices"][0]["text"];
  } catch (error) {
    throw new Error(error.message);
  }
};
