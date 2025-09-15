const chatDisplay = document.getElementById("chat-display");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    document.documentElement.setAttribute("data-theme", isDark ? "light" : "dark");
    themeToggle.textContent = isDark ? "💡" : "🌚";
});

async function fetchGroqData(messages) {
  try {
    const response = await fetch('api\chat.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Sorry, I encountered an error. Please try again later.");
  }
}

function appendMessage(content, isUser = false, isError = false) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", isUser ? "user-message" : isError ? "error-message" : "bot-message");
  messageElement.textContent = content;
  chatDisplay.appendChild(messageElement);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

async function handleUserInput() {
  const userMessage = userInput.value.trim();
  if (userMessage) {
    appendMessage(userMessage, true);
    userInput.value = "";

    try {
      const messages = [
        {
          role: "system",
          content: "You are technical support expert named ManoAI as you are developed by 'Manoj'. Your task is to assist people in a procedural way."
        },
        { role: "user", content: userMessage }
      ];

      const botResponse = await fetchGroqData(messages);
      appendMessage(botResponse);
    } catch (error) {
      appendMessage(error.message, false, true);
    }
  }
}

// Event Listeners
sendButton.addEventListener("click", handleUserInput);
userInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    handleUserInput();
  }
});

chatDisplay.innerHTML = ""; //Clears chat display at the start
