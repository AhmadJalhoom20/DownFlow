console.log("Downflow AI Extension Active (Sniper Mode)");

function injectAIButtons() {
    const inputs = document.querySelectorAll('div[role="textbox"], textarea, [contenteditable="true"]');
    inputs.forEach(input => {
        if (input.dataset.aiInjected || input.offsetWidth === 0) return;
        input.dataset.aiInjected = "true";

        const btn = document.createElement("button");
        btn.innerHTML = "✨";
        btn.className = "ds-ai-btn";
        input.parentElement.appendChild(btn);

        btn.addEventListener("click", async (e) => {
            e.preventDefault();
            e.stopPropagation();
            btn.classList.add("ds-thinking");

            const context = sniperExtractContext(btn);
            console.log("Sniper Captured:", context);

            chrome.storage.local.get(["openrouter_api_key"], (result) => {
                const apiKey = result.openrouter_api_key;
                if (!apiKey) {
                    alert("Set API Key!");
                    btn.classList.remove("ds-thinking");
                    return;
                }

                chrome.runtime.sendMessage({ type: "CALL_AI", apiKey, context }, (response) => {
                    if (response && response.success) insertText(input, response.reply);
                    btn.classList.remove("ds-thinking");
                });
            });
        });
    });
}

function sniperExtractContext(btn) {
    try {
        const rect = btn.getBoundingClientRect();
        const noise = ["Translate", "Original", "Reply", "React", "See", "Shared", "Message", "أعجبني", "رد", "ترجمة", "عرض", "Follow", "Instagram", "Facebook", "Profile", "منذ", "ساعة", "دقيقة", "ثانية", "يوم", "ago"];

        // SNIPER STRATEGY: Find the most significant text block in the vicinity
        const elements = Array.from(document.querySelectorAll('span, div[dir="auto"], h1, h2, p'))
            .map(el => {
                const r = el.getBoundingClientRect();
                const dist = Math.sqrt(Math.pow(r.left - rect.left, 2) + Math.pow(r.top - rect.top, 2));
                return { text: el.innerText.trim(), dist, length: el.innerText.trim().length };
            })
            .filter(item => {
                // Ignore short stuff, noise, and far away elements
                return item.length > 15 && item.dist < 800 && !noise.some(kw => item.text.toLowerCase().includes(kw.toLowerCase()));
            });

        // Sort by a mix of distance and length (prefer long text nearby)
        elements.sort((a, b) => (a.dist / a.length) - (b.dist / b.length));

        if (elements.length > 0) {
            // Take the top 3 best candidates and merge them
            return elements.slice(0, 3).map(i => i.text).join("\n");
        }

        return "Social media post";
    } catch (e) { return "Interact"; }
}

function insertText(input, text) {
    input.focus();
    if (input.tagName === "TEXTAREA" || input.tagName === "INPUT") {
        input.value = text;
        input.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
        document.execCommand('selectAll', false, null);
        document.execCommand('insertText', false, text);
    }
}

setInterval(injectAIButtons, 2000);
