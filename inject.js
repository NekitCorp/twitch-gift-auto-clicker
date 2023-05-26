// @ts-check

const LOG_TAG = "[TGAC]";
const POINTS_CONTAINER_SELECTOR = '[data-test-selector="community-points-summary"]';
const BONUS_BUTTON_SELECTOR = "[class*=ScCoreButtonSuccess]";
const BALANCE_SELECTOR = '[data-test-selector="balance-string"]';
const CONTAINER_LOOKUP_TIMEOUT = 30 * 1000;

function domReady(callback) {
    if (document.readyState === "complete" || document.readyState !== "loading") {
        callback();
    } else {
        document.addEventListener("DOMContentLoaded", callback);
    }
}

/**
 * @returns {Promise<HTMLDivElement>}
 */
function getPointsContainer() {
    const pointsContainer = document.querySelector(POINTS_CONTAINER_SELECTOR);

    if (pointsContainer instanceof HTMLDivElement) {
        return Promise.resolve(pointsContainer);
    }

    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject();
        }, CONTAINER_LOOKUP_TIMEOUT);

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (!(node instanceof HTMLElement)) continue;

                    if (node.matches(POINTS_CONTAINER_SELECTOR) || node.querySelector(POINTS_CONTAINER_SELECTOR)) {
                        const pointsContainer = document.querySelector(POINTS_CONTAINER_SELECTOR);

                        if (pointsContainer instanceof HTMLDivElement) {
                            clearTimeout(timeoutId);
                            observer.disconnect();
                            resolve(pointsContainer);
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true,
        });
    });
}

/**
 * @param {HTMLDivElement} pointsContainer
 */
function startObserverPoints(pointsContainer) {
    // container styling
    pointsContainer.style.outline = "1px dashed var(--color-background-button-brand)";

    const emoji = document.createElement("span");
    emoji.style.position = "absolute";
    emoji.style.top = "0px";
    emoji.style.right = "0px";
    emoji.style.pointerEvents = "none";
    emoji.style.userSelect = "none";
    emoji.style.transform = "translate(50%, -50%)";
    emoji.textContent = "👀";
    pointsContainer.appendChild(emoji);

    // observe points container
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;

                if (node.matches(BONUS_BUTTON_SELECTOR) || node.querySelector(BONUS_BUTTON_SELECTOR)) {
                    // log
                    const balance = pointsContainer.querySelector(BALANCE_SELECTOR);

                    if (balance instanceof HTMLDivElement) {
                        console.log(
                            `${LOG_TAG} 😎 I clicked for you ${balance.innerText} ${new Date().toLocaleTimeString()}`
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
            }
        }
    });

    observer.observe(pointsContainer, {
        subtree: true,
        childList: true,
    });
}

function main() {
    getPointsContainer()
        .then((pointsContainer) => {
            startObserverPoints(pointsContainer);

            console.log(`${LOG_TAG} 🎁 I started to follow the gift o_o`);
        })
        .catch(() => {
            console.error(`${LOG_TAG} 🔴 Points container ${POINTS_CONTAINER_SELECTOR} was not found.`);
        });
}

domReady(main);
