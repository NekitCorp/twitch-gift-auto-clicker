// @ts-check

function domready(callback) {
    if (
        document.readyState === "complete" ||
        document.readyState !== "loading"
    ) {
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

                if (
                    node.matches(BONUS_BUTTON_SELECTOR) ||
                    node.querySelector(BONUS_BUTTON_SELECTOR)
                ) {
                    // log
                    console.log(
                        `😎 I clicked for you ${
                            document.querySelector(BALANCE_SELECTOR).innerText
                        } ${new Date().toLocaleTimeString()}`
                    );

                    // click
                    if (node.matches(BONUS_BUTTON_SELECTOR)) {
                        node.click();
                    } else {
                        node.querySelector(BONUS_BUTTON_SELECTOR).click();
                    }
                }

                if (
                    node.matches(POINTS_SELECTOR) ||
                    node.querySelector(POINTS_SELECTOR)
                ) {
                    document.querySelector(POINTS_SELECTOR).style.outline =
                        "1px dashed var(--color-background-button-brand)";

                    console.log("🎁 I started to follow the gift o_o");
                }
            }
        }
    });

    observer.observe(document.body, {
        subtree: true,
        childList: true,
    });
}

domready(main);
