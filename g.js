function fetchResults() {
    let chat = document.getElementById("text-input").value;
    AppendMessage("user", chat);

    document.getElementById("text-input").value = "";
    document.getElementsByClassName("header")[0].style.display = "none";

    fetchApiResponse(chat);
}
async function fetchApiResponse(chat) {
    const resp = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': 'AIzaSyDJY3Zj1Lgzka1cheU-pcW6x6txp7gQZNg'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: chat
                            }
                        ]
                    }
                ]
            })
        }
    );

    const response = await resp.json();

    // Remove loading spinner
    const loadingEl = document.getElementById("loading");
    if (loadingEl) {
        loadingEl.remove();
    }

// Append the Gemini response
AppendMessage(
    "Gemini",
    response.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1")
);

// ✅ Auto-scroll the last Gemini message into view smoothly
setTimeout(() => {
    const chatArea = document.getElementById("chatArea");
    chatArea.scrollTo({
        top: chatArea.scrollHeight,
        behavior: "smooth"
    });
}, 100); // small delay to let DOM update

}


function AppendMessage(sender, chat) {
    let chatArea = document.getElementById("chatArea");

    const msgElement = document.createElement('div');
    msgElement.className = `message ${sender}`;
    msgElement.innerHTML = `<p>${chat}</p>`;
    chatArea.appendChild(msgElement);

    if (sender === "user") {
        const loading = document.createElement("div");
        loading.className = "loading Gemini";
        loading.id = "loading";
        loading.innerText = "loading...";
        chatArea.appendChild(loading);
    }

    // ✅ Auto-scroll after adding message
    chatArea.scrollTop = chatArea.scrollHeight;
}

function toggle() {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    document.getElementById("theme-toggle").innerText = isDark ? "☀️" : "🌙";
}
