export const runtime = 'edge';
const prompt = [
  "Suggest a friendly greeting message.",
  "Generate a casual intro line.",
  "Suggest a short welcome message.",
  "Give a creative response message.",
  "What's a nice message I can send?"
]

export async function POST(req: Request) {
  const randomPrompt = prompt[Math.floor(Math.random() * prompt.length)]
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  const Retries = 3;
  for (let attempt = 1; attempt <= Retries; attempt++) {
    try {
      const response = await fetch("https://router.huggingface.co/featherless-ai/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${process.env.MODEL_API_KEY}`, // put your token in .env
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: randomPrompt,
            },
          ],
          model: "mistralai/Mistral-Nemo-Instruct-2407",
          // model: "HuggingFaceH4/zephyr-7b-beta",
          stream: false,
        }),
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Model Error: ${error}`)
      }

      const data = await response.json();
      console.log(data)
      return Response.json({
        text: data?.choices?.[0]?.message?.content || "No message found",
      });
    }
    catch (error) {
      if (attempt === Retries) {
        return new Response(
          JSON.stringify(
            {
              success: false,
              message: "All retries failed"
            },
          ), { status: 500 }
        )
      }
    }
    console.log(`Retry ${attempt} failed. Retring ....`)
    await new Promise(res => setTimeout(res, 500 * attempt)); //exponential delay
  }

  //if all things are break still cannot return anything than its return
  return new Response(JSON.stringify({ message: 'Unhandled error' }), { status: 500 });
}
