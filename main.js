"use strict";
const aiAssistantBtn = document.querySelector(".cta-btn");
const chatboxContainer = document.querySelector(".chatbox-container");
const closeChat = document.querySelector(".close-chat");
const userPrompt = document.querySelector("#user-prompt");
const submitPromptButton = document.querySelector(".submit-prompt");
const chatboxContent = document.querySelector(".chatbox-content");

let isActiveAi = false;

// Toggle chat window visibility
aiAssistantBtn.addEventListener("click", () => {
  if (!isActiveAi) {
    chatboxContainer.style.display = "block";
    isActiveAi = true;
  } else {
    chatboxContainer.style.display = "none";
    isActiveAi = false;
  }
});

closeChat.addEventListener("click", () => {
  if (isActiveAi) {
    chatboxContainer.style.display = "none";
    isActiveAi = false;
  }
});

// Toggle submit button state
submitPromptButton.disabled = true;
submitPromptButton.style.opacity = "25%";

const setUserPrompt = (ev) => {
  ev.preventDefault();
  if (ev.target.value.trim() !== "") {
    submitPromptButton.disabled = false;
    submitPromptButton.style.opacity = "100%";
  } else {
    submitPromptButton.disabled = true;
    submitPromptButton.style.opacity = "25%";
  }

  return ev.target.value.trim();
};

userPrompt.addEventListener("input", setUserPrompt);

const addResponseIntoHtml = (userQuery, aiResponse = "Searching") => {
  const userSpan = document.createElement("span");
  userSpan.textContent = userQuery;
  userSpan.classList.add("user-query");

  const aiSpan = document.createElement("span");
  chatboxContent.appendChild(userSpan);
  chatboxContent.scrollTop = chatboxContent.scrollHeight;

  let initText = 0;
  for (const text of aiResponse) {
    initText++;
    setTimeout(() => {
      aiSpan.textContent += text;
    }, initText * 15);
  }
  aiSpan.classList.add("ai-response");
  chatboxContent.appendChild(aiSpan);
  chatboxContent.scrollTop = chatboxContent.scrollHeight;
};
// Fetch API response
const occurredError = () => {
  throw new Error("Something wrong with Api!");
};

const fetchApiResponse = async (userInput) => {
  try {
    const apiUrl = await fetch("http://localhost:3000/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userInput: userInput,
      }),
    });

    if (!apiUrl.ok) {
      occurredError();
      alert("Something went wrong, Please try again later.");
    }

    const response = await apiUrl.json();

    const newEntry = {
      userQuery: userInput,
      aiResponse: response.message,
    };
    if (typeof newEntry === "object" && newEntry !== "") {
      addResponseIntoHtml(newEntry.userQuery, newEntry.aiResponse);
    } else {
      addResponseIntoHtml(newEntry.userQuery);
    }
  } catch (error) {
    console.error(error.message);
    return false;
  }
  return true;
};

// Event listener for submit button
submitPromptButton.addEventListener("click", () => {
  const userInput = userPrompt.value;

  if (userInput.trim() !== "") {
    fetchApiResponse(userInput);
    userPrompt.value = "";
    submitPromptButton.disabled = true;
    submitPromptButton.style.opacity = "25%";
  }
});

const screenWidth = window.innerWidth > 768;
document.addEventListener("keypress", (ev) => {
  if (screenWidth && ev.key === "Enter") {
    ev.preventDefault();
    submitPromptButton.click();
  }
});
