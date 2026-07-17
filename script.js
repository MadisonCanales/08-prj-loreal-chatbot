/* DOM Elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

/* Replace with your Cloudflare Worker URL */
const WORKER_URL = "https://loreal-assistant.madison.workers.dev"; 
/* L'Oréal System Prompt */
const SYSTEM_PROMPT = `
You are the L'Oréal Beauty Assistant.

Your job is to help users:
- Discover L'Oréal makeup products
- Explore L'Oréal skincare products
- Learn about L'Oréal haircare products
- Find fragrances
- Build beauty routines
- Get personalized recommendations

Only answer questions related to:
- L'Oréal products
- Beauty
- Skincare
- Makeup
- Haircare
- Fragrances
- Beauty routines

If a user asks about something unrelated, politely respond:

"I'm designed to help with L'Oréal products, beauty routines, skincare, makeup, haircare, and fragrances. Please ask a beauty-related question."

Be professional, friendly, and concise.
`;

/* Initial Greeting */
addMessage(
  "👋 Welcome! I'm the L'Oréal Beauty Assistant. Ask me about skincare, makeup, haircare, fragrances, or beauty routines.",
  "ai"
);

/* Handle Form Submission */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();

  if (!message) return;

  addMessage(message, "user");

  userInput.value = "";

  try {
    const aiResponse = await getAIResponse(message);

    addMessage(aiResponse, "ai");
  } catch (error) {
    console.error("Error:", error);

    addMessage(
      "Sorry, something went wrong while connecting to the assistant.",
      "ai"
    );
  }
});

/* Get AI Response */
async function getAIResponse(userMessage) {
  const response = await fetch(WORKER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    })
  });

  const data = await response.json();

  return data.choices[0].message.content;
}

/* Display Messages */
function addMessage(text, sender) {
  const messageDiv = document.createElement("div");

  messageDiv.classList.add("msg");
  messageDiv.classList.add(sender);

  messageDiv.textContent = text;

  chatWindow.appendChild(messageDiv);

  chatWindow.scrollTop = chatWindow.scrollHeight;
}