import { generateSmartAI } from './ai-service.js';

const input = document.getElementById('bot-input');
const sendBtn = document.getElementById('send-btn');
const messagesBox = document.getElementById('messages-box');
const typingIndicator = document.getElementById('typing');

// Context & History
let chatHistory = JSON.parse(localStorage.getItem('downai_history')) || [];

function appendMessage(text, role, save = true) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;
    msgDiv.innerText = text;
    messagesBox.appendChild(msgDiv);
    messagesBox.scrollTop = messagesBox.scrollHeight;
    
    if (save) {
        chatHistory.push({ text, role });
        localStorage.setItem('downai_history', JSON.stringify(chatHistory));
    }
    return msgDiv;
}

// Load history on startup
function loadHistory() {
    if (chatHistory.length > 0) {
        // Clear initial welcome if history exists
        messagesBox.innerHTML = '';
        chatHistory.forEach(msg => appendMessage(msg.text, msg.role, false));
    }
}

async function handleSendMessage() {
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    appendMessage(text, 'user');
    
    typingIndicator.style.display = 'block';
    
    try {
        const botMsgDiv = appendMessage('', 'bot', false);
        
        // Prepare context for AI (last 10 messages)
        const context = chatHistory.slice(-10).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n');
        
        const fullResponse = await generateSmartAI(context, 'chat', (content) => {
            botMsgDiv.innerText = content;
            messagesBox.scrollTop = messagesBox.scrollHeight;
        });

        // Save bot response to history
        chatHistory.push({ text: fullResponse, role: 'bot' });
        localStorage.setItem('downai_history', JSON.stringify(chatHistory));

    } catch (error) {
        console.error("ChatBot Error:", error);
        appendMessage("عذراً، حدث خطأ ما. حاول مرة أخرى.", 'bot');
    } finally {
        typingIndicator.style.display = 'none';
    }
}

// Clear Chat
document.getElementById('clear-chat').addEventListener('click', () => {
    if (confirm('هل أنت متأكد من رغبتك في مسح المحادثة؟')) {
        chatHistory = [];
        localStorage.removeItem('downai_history');
        messagesBox.innerHTML = `
            <div class="message bot">
                تم مسح المحادثة. كيف يمكنني مساعدتك الآن؟
            </div>
        `;
    }
});

sendBtn.addEventListener('click', handleSendMessage);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
});

// Initialize
loadHistory();
