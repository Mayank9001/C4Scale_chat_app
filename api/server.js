import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  const { message } = req.body;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "llama-3-3-70b-versatile",
    });

    res
      .status(200)
      .json({ reply: completion.choices[0]?.message?.content || "" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
}
