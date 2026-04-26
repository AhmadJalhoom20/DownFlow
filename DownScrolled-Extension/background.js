chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "CALL_AI") {
        callOpenRouter(request.apiKey, request.context)
            .then(reply => sendResponse({ success: true, reply }))
            .catch(err => sendResponse({ success: false, error: err.message }));
        return true; 
    }
});

async function callOpenRouter(apiKey, context) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "openrouter/auto", 
            "messages": [
                { 
                    "role": "user", 
                    "content": `You are a person chatting on social media. Reply to this: "${context}". \n\nRULES: \n- Write ONLY the reply text.\n- NO formal talk. \n- Use the same dialect.\n- Match the emotion (e.g. if they say they can't play, say 'Too bad' or 'Next time').` 
                }
            ]
        })
    });
    
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    let reply = data.choices[0].message.content.trim();
    reply = reply.replace(/\(.*?\)/g, "").replace(/^(Note|Translation|Arabic|Reply):/i, "").replace(/^"|"$/g, '').trim();
    return reply;
}
