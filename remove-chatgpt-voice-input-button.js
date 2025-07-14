// ==UserScript==
// @name         ChatGPT Cleaner - No Backslash, No Markdown in Replies
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Remove all backslashes and markdown artifacts (** __ etc) from assistant replies, excluding code/pre blocks. Also hides voice input button.
// @author       hypersad
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/c/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const CODE_TAGS = new Set(['CODE', 'PRE', 'KBD', 'SAMP']);

    function isInCodeBlock(node) {
        let parent = node.parentNode;
        while (parent) {
            if (CODE_TAGS.has(parent.nodeName)) return true;
            parent = parent.parentNode;
        }
        return false;
    }

    function cleanTextContent(text) {
        return text
            .replace(/\\/g, '')              // Remove all backslashes
            .replace(/\*\*/g, '')            // Remove bold markers
            .replace(/__/g, '')              // Remove double underscores
            .replace(/~~/g, '')              // Remove strikethrough markers
            .replace(/`/g, '');              // Remove inline code markers
    }

    function cleanNodeText(root) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    return isInCodeBlock(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let node;
        while ((node = walker.nextNode())) {
            const original = node.nodeValue;
            const cleaned = cleanTextContent(original);
            if (original !== cleaned) {
                node.nodeValue = cleaned;
            }
        }
    }

    function cleanAssistantReplies() {
        document.querySelectorAll('[data-message-author-role="assistant"]').forEach(reply => {
            cleanNodeText(reply);
        });
    }

    function hideVoiceInput() {
        const micButtons = document.querySelectorAll('button.relative.flex.h-9.items-center.justify-center.rounded-full');
        micButtons.forEach(btn => {
            btn.style.display = 'none';
        });
    }

    const observer = new MutationObserver(() => {
        hideVoiceInput();
        cleanAssistantReplies();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    window.addEventListener('load', () => {
        setTimeout(() => {
            hideVoiceInput();
            cleanAssistantReplies();
        }, 1200);
    });
})();
