// ==UserScript==
// @name         Remove ChatGPT Voice Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Permanently removes the annoying voice/speaker button from ChatGPT
// @author       hypersad
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/c/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    function hideVoiceButton() {
        document.querySelectorAll('button').forEach(btn => {
            if (
                btn.innerHTML.includes('mic') ||
                btn.innerHTML.includes('voice') ||
                btn.querySelector('svg path[d*="M12 14c1.66"]') ||
                btn.querySelector('svg path[d*="M19.1 6.9"]') ||
                btn.getAttribute('data-testid')?.includes('voice')
            ) {
                btn.style.display = 'none';
            }
        });
    }

    new MutationObserver(hideVoiceButton).observe(document.body, {
        childList: true,
        subtree: true
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideVoiceButton);
    } else {
        hideVoiceButton();
    }
})();
