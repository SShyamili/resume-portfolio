
// Chatbot Logic
const GROQ_API_KEY = "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"; // WARNING: Client-side key for demo only.
const SYSTEM_PROMPT = `You are a helpful AI assistant for S SHYAMILI's portfolio website. 
Your goal is to answer questions about Shyamili based ONLY on the following resume context.
Be concise, professional, and friendly.

RESUME CONTEXT:
Name: S SHYAMILI
Role: Data Analyst / Entry-Level Data Scientist, BTech(CSE) student.
Location: Odisha, India. Contact: shyamilisegalla123@gmail.com, +91-7606013591, linkedin.com/in/s-shyamili-761571316, github.com/SShyamili.

Summary: Detail-oriented B.Tech CSE student with hands-on experience in data analysis, machine learning, and business insights. Proficient in Python, SQL, Power BI, and Excel. Skills in EDA, data visualization, predictive modeling, statistical analysis.

Skills:
- Languages: Python, SQL.
- Data Analytics: EDA, Data Cleaning, Wrangling, Statistical Analysis, Hypothesis Testing, Visualization.
- Tools: Pandas, NumPy, Matplotlib, Seaborn, Power BI, Excel.
- ML/AI: Supervised/Unsupervised Learning, Feature Scaling, Model Evaluation, Generative AI, LLMs, NLP (Text Classification, Word Embeddings).
- UI: Streamlit.

Internship:
- Data Analyst Intern at Cognifyz Technologies (Remote, Mar 2025 – Apr 2025): Analyzed large restaurant sales datasets (Python), identified customer behavior patterns, cleaned/transformed real-world datasets, improved reporting efficiency.

Projects:
1. FIFA Player Data Analysis: Analyzed player performance metrics (Python) for strategic insights.
2. Diabetes Prediction System: Built ML model to predict diabetes risk.
3. Customer Churn Prediction (Telecom): Forecasted churn patterns using customer behavior data.
4. Heart Disease Prediction System: Built healthcare ML model for early detection.
5. Text-to-Image Generator (Gradio App): AI-based web app generating images from text prompts with user-friendly UI.

Education:
- B.Tech CSE: Vignan Institute of Technology and Management (2023-2027), CGPA 8.5/10.
- Intermediate: Sashi Bhusan Rath Women’s Higher Secondary School (2021-2023), 62%.
- 10th (ICSE): St. Joseph’s Convent School (2021), 84.12%.

Certifications:
- Python (Scaler Topics)
- Google Data Analyst Professional Certificate (Coursera)
- Cloud Computing Applications (Univ of Illinois)

Languages: English, Hindi, Odia, Telugu.
Soft Skills: Critical Thinking, Communication, Team Collaboration, Time Management, Leadership.

If asked about something not in the resume, explicitly say you don't have that information but can discuss her known skills or projects.`;

const chatWindow = document.getElementById('chat-window');
const toggleBtn = document.getElementById('toggle-chat');
const closeBtn = document.getElementById('close-chat');
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const messagesContainer = document.getElementById('chat-messages');

// Toggle Chat
function toggleChat() {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) {
        userInput.focus();
    }
}

toggleBtn.addEventListener('click', toggleChat);
closeBtn.addEventListener('click', toggleChat);

// Add Message to UI
function addMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    div.textContent = text;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Add Typing Indicator
function addTypingIndicator() {
    const div = document.createElement('div');
    div.classList.add('typing-indicator');
    div.id = 'typing-indicator';
    div.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

// Call Groq API
async function getBotResponse(userMessage) {
    const url = "https://api.groq.com/openai/v1/chat/completions";

    const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        // Simple context: just last user message for now to save tokens/logic complexity, 
        // or we could maintain a history array. Let's send just current for simplicity or a small history.
        { role: "user", content: userMessage }
    ];

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
                messages: messages,
                max_tokens: 300,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Error calling Groq API:", error);
        return "Sorry, I encountered an error connecting to the AI. Please try again later.";
    }
}

// Handle Send
async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    userInput.value = '';

    addTypingIndicator();

    // Simulate slight delay for realism or just wait for API
    const reply = await getBotResponse(text);

    removeTypingIndicator();
    addMessage(reply, 'bot');
}

sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});
