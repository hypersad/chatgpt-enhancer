// ==UserScript==
// @name         Remove ChatGPT Voice Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove the voice input button from ChatGPT input box
// @author       hypersad
// @match        https://chatgpt.com/c/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        const micButtons = document.querySelectorAll('button.relative.flex.h-9.items-center.justify-center.rounded-full');
        micButtons.forEach(btn => {
            btn.style.display = 'none';
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
