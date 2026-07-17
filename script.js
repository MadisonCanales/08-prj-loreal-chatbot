/* DOM Elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

/* Cloudflare Worker URL */
const WORKER_URL = "https://08-prj-loreal-chatbot.loreal-assistant.workers.dev";

/* L'Oréal System Prompt */
const SYSTEM_PROMPT = `
You are the L'Oréal Beauty Assistant.

Help users with:
- L'Oréal makeup products
- L'Oréal skincare products
- L'Oréal haircare products
- Fragrances
- Beauty routines
- Personalized recommendations

Only answer questions about beauty, skincare, makeup, haircare, fragrances, and L'Oréal products.

If a user asks something unrelated say:
"I'm designed to help with L'Oréal products, beauty routines, skincare, makeup, haircare, and fragrances. Please ask a beauty-related question."

Be friendly, helpful, and concise.
`;


/* Welcome Message */
addMessage(
  "👋 Welcome! I'm the L'Oréal Beauty Assistant. Ask me about skincare, makeup, haircare, fragrances, or beauty routines.",
  "ai"
);


/* Submit Message */
chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = userInput.value.trim();

  if (!message) return;

  addMessage(message, "user");

  userInput.value = "";

  const loading = addMessage("✨ Thinking...", "ai");

  try {
    const response = await getAIResponse(message);

    loading.remove();

    addMessage(response, "ai");

  } catch (error) {

    console.error("Chatbot Error:", error);

    loading.remove();

    addMessage(
      "Sorry, I couldn't connect to the assistant right now.",
      "ai"
    );
  }
});


/* Send Message to Worker */
async function getAIResponse(userMessage) {

  const response = await fetch(WORKER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
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


  if (!response.ok) {
    throw new Error(
      `Worker Error: ${response.status}`
    );
  }


  const data = await response.json();

  console.log("Worker Response:", data);


  // Supports OpenAI-style response
  if (
    data.choices &&
    data.choices[0] &&
    data.choices[0].message
  ) {
    return data.choices[0].message.content;
  }


  // Supports simple Worker response
  if (data.response) {
    return data.response;
  }


  if (data.message) {
    return data.message;
  }


  throw new Error("Unexpected Worker response");
}


/* Add Messages */
function addMessage(text, sender) {

  const messageDiv = document.createElement("div");

  messageDiv.classList.add("msg");
  messageDiv.classList.add(sender);

  messageDiv.textContent = text;

  chatWindow.appendChild(messageDiv);

  chatWindow.scrollTop = chatWindow.scrollHeight;

  return messageDiv;
}