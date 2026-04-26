const OPENROUTER_API_KEY = "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";

export async function generateSmartAI(content, isPostAssist = false, onProgress) {
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.includes("YOUR_OPENROUTER")) {
        return "Please set up your API Key first!";
    }

    const systemPrompt = isPostAssist 
        ? "You are an expert social media manager. Your task is to complete or improve the user's post. You MUST use the EXACT SAME language and dialect as the user's input. If they write in Arabic (Palestinian, etc.), respond ONLY in that specific Arabic dialect. DO NOT switch to English."
        : "You are a real human friend. Respond with a very short, relevant comment to the post provided. Focus ONLY on the post topic and use the EXACT SAME language and dialect as the post.";

    try {
        const userPrompt = isPostAssist 
            ? `USER DRAFT: "${content}"\n\nTASK: Complete or improve this post script while keeping the EXACT SAME language and tone. DO NOT TRANSLATE. Write ONLY the post content.`
            : `POST CONTENT: "${content}"\n\nTASK: Write a very short human-like comment in the EXACT SAME language and dialect as the post content above.`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "model": "openrouter/auto",
                "messages": [
                    { "role": "system", "content": systemPrompt },
                    { "role": "user", "content": userPrompt }
                ],
                "stream": true 
            })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");

            for (const line of lines) {
                if (line.trim().startsWith("data: ")) {
                    const dataStr = line.trim().slice(6);
                    if (dataStr === "[DONE]") break;
                    try {
                        const data = JSON.parse(dataStr);
                        const delta = data.choices[0].delta.content || "";
                        fullText += delta;
                        if (onProgress) onProgress(fullText);
                    } catch (e) {}
                }
            }
        }
        return fullText;
    } catch (error) {
        console.error("AI Error:", error);
        return "Error 😕";
    }
}
