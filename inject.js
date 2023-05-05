// @ts-check

function domReady(callback) {
    if (document.readyState === "complete" || document.readyState !== "loading") {
        callback();
    } else {
        document.addEventListener("DOMContentLoaded", callback);
    }
}

function main() {
    const BONUS_BUTTON_SELECTOR = '[aria-label="Claim Bonus"]';
    const POINTS_SELECTOR = '[data-test-selector="community-points-summary"]';
    const BALANCE_SELECTOR = '[data-test-selector="balance-string"]';

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;

                if (node.matches(BONUS_BUTTON_SELECTOR) || node.querySelector(BONUS_BUTTON_SELECTOR)) {
                    // log
                    const balance = document.querySelector(BALANCE_SELECTOR);

                    if (balance instanceof HTMLDivElement) {
                        console.log(
                            `[TGAC] 😎 I clicked for you ${balance.innerText} ${new Date().toLocaleTimeString()}`
                        );
                    }

                    // click
                    if (node.matches(BONUS_BUTTON_SELECTOR)) {
                        node.click();
                    } else {
                        const button = node.querySelector(BONUS_BUTTON_SELECTOR);

                        if (button instanceof HTMLButtonElement) {
                            button.click();
                        }
                    }
                }

                if (node.matches(POINTS_SELECTOR) || node.querySelector(POINTS_SELECTOR)) {
                    const points = document.querySelector(POINTS_SELECTOR);

                    if (points instanceof HTMLDivElement) {
                        points.style.outline = "1px dashed var(--color-background-button-brand)";

                        const emoji = document.createElement("span");
                        emoji.style.position = "absolute";
                        emoji.style.top = "0px";
                        emoji.style.right = "0px";
                        emoji.style.pointerEvents = "none";
                        emoji.style.userSelect = "none";
                        emoji.style.transform = "translate(50%, -50%)";
                        emoji.textContent = "👀";
                        points.appendChild(emoji);

                        console.log("[TGAC] 🎁 I started to follow the gift o_o");
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        subtree: true,
        childList: true,
    });
}

domReady(main);
