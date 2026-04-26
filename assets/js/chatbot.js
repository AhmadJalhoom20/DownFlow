import { generateSmartAI } from './ai-service.js';

const input = document.getElementById('bot-input');
const sendBtn = document.getElementById('send-btn');
const messagesBox = document.getElementById('messages-box');
const typingIndicator = document.getElementById('typing');

function appendMessage(text, role) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;
    msgDiv.innerText = text;
    messagesBox.appendChild(msgDiv);
    messagesBox.scrollTop = messagesBox.scrollHeight;
    return msgDiv;
}

async function handleSendMessage() {
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    appendMessage(text, 'user');
    
    // Show typing
    typingIndicator.style.display = 'block';
    
    try {
        const botMsgDiv = appendMessage('', 'bot');
        await generateSmartAI(text, false, (content) => {
            botMsgDiv.innerText = content;
            messagesBox.scrollTop = messagesBox.scrollHeight;
        });
    } catch (error) {
        console.error("ChatBot Error:", error);
        appendMessage("Sorry, I encountered an error. Please try again.", 'bot');
    } finally {
        typingIndicator.style.display = 'none';
    }
}

sendBtn.addEventListener('click', handleSendMessage);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
});
