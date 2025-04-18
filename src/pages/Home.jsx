import { useEffect } from "react";

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const Home = () => {
  const getGroqChatCompletion = async () => {
    return groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "HI",
        },
      ],
      model: "llama-3.3-70b-versatile",
    });
  };
  const chatCompletion = async () => {
    const response = await getGroqChatCompletion();
    console.log(response.choices[0]?.message?.content || "");
  };
  useEffect(() => {
    chatCompletion();
    console.log(import.meta.env.VITE_GROQ_API_KEY);
  }, []);
  return <>Home</>;
};

export default Home;
