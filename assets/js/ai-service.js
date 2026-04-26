const OPENROUTER_API_KEY = "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";

export async function generateSmartAI(content, mode = 'comment', onProgress) {
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.includes("YOUR_OPENROUTER")) {
        return "Please set up your API Key first!";
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (mode === 'post' || mode === true) {
        systemPrompt = "أنت مساعد كتابة لمنصة داون فلو (Downflow). مهمتك تحسين المنشورات. القواعد: 1. لغة عربية فقط. 2. لا إنجليزية. 3. لا أقواس. 4. لا تشرح. اكتب النص فقط.";
        userPrompt = `النص: "${content}"\n\nالمهمة: أكمل المنشور.`;
    } else if (mode === 'comment') {
        systemPrompt = "أنت شخص ودود يتفاعل مع منشورات أصدقائه على منصة تواصل اجتماعي. اكتب تعليقاً طبيعياً وجذاباً يعبر عن رأيك أو إعجابك بالمحتوى. القواعد: 1. ممنوع نهائياً ذكر أنك ذكاء اصطناعي. 2. ممنوع ذكر اسم المنصة. 3. اكتب جملة واحدة جميلة ومعبرة. 4. استخدم لغة بشرية بسيطة وودودة.";
        userPrompt = `المنشور: "${content}"\n\nالمهمة: اكتب تعليقاً بشرياً مميزاً وودوداً.`;
    } else if (mode === 'reply') {
        systemPrompt = "أنت مساعد ذكي للمستخدم في محادثة خاصة على منصة داون فلو (Downflow). مهمتك اقتراح ردود للمستخدم ليرد بها على صديقه. القواعد: 1. لا تذكر أنك ذكاء اصطناعي. 2. لا تذكر اسمك. 3. اكتب الرد الذي يجب أن يرسله المستخدم مباشرة. 4. لغة عربية فقط وبنفس لهجة المحادثة.";
        userPrompt = `آخر رسائل المحادثة:\n${content}\n\nالمهمة: اقترح رداً بشرياً طبيعياً يرسله المستخدم الآن.`;
    } else if (mode === 'chat' || mode === false) {
        systemPrompt = "أنت Downflow AI، المساعد الصديق لمنصة داون فلو. تحدث كبشر طبيعي بالعربية فقط. ممنوع الإنجليزية والأقواس. إذا سألك من أنت، قل أنا Downflow AI.";
        userPrompt = content;
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-3.1-70b-instruct",
                "messages": [
                    { "role": "system", "content": systemPrompt },
                    { "role": "user", "content": userPrompt }
                ],
                "stream": true,
                "temperature": 0.7,
                "max_tokens": 500
            })
        });

        if (response.status === 401) {
            return "خطأ: مفتاح الـ API غير صالح! يرجى تحديث المفتاح في ملف ai-service.js 🔑";
        }

        if (!response.ok) {
            return "حدث خطأ في الاتصال بالذكاء الاصطناعي 😕";
        }

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
        
        return fullText.trim();
    } catch (error) {
        console.error("AI Error:", error);
        return "Error 😕";
    }
}
