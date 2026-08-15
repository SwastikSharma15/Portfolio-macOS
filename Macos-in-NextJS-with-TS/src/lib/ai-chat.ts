// Predefined responses about Vercel, Next.js and v0
const responses = [
  "Vercel is all about making deployment and development seamless! 🚀 We're focused on providing the best developer experience possible.",
  "v0 is our new AI-powered coding assistant. It's designed to help developers write better code faster, with a deep understanding of best practices and modern frameworks. 🤖",
  "Next.js 14 brings some amazing performance improvements and new features! The App Router is getting better every day. What specific features are you interested in? 💫",
  "One of the things I'm most excited about is how v0 understands your entire codebase context. It's like having a senior developer who knows every line of your code! 🎯",
  "We're seeing incredible adoption of Next.js in enterprises. The stability and performance improvements in recent versions have been game-changing. 🌟",
  "The AI SDK we released makes it super easy to add AI capabilities to your apps. Have you tried it out? 🤔",
  "Edge Functions and Edge Config have been game-changers for many of our users. The ability to run code closer to your users is powerful! ⚡️",
]

export async function generateChatResponse(message: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return a random response
  return responses[Math.floor(Math.random() * responses.length)]
}
