// @ts-check

const REFRESH_INTERVAL = 3 * 1000;
const CONTAINER_SELECTOR = '[data-test-selector="community-points-summary"]';
// @ts-ignore
const storage = chrome.storage.local;

/**
 * Executes a callback function once the DOM is fully loaded and ready.
 *
 * @param {() => void} callback - The function to execute when the DOM is ready.
 */
function domReady(callback) {
    if (document.readyState === "complete" || document.readyState !== "loading") {
        callback();
    } else {
        document.addEventListener("DOMContentLoaded", callback);
    }
}

/**
 * Attempts to claim a bonus by simulating a button click on a specific bonus icon.
 *
 * @returns {Promise<void>} Resolves when the bonus is claimed and points are updated, or does nothing if no bonus is found.
 */
async function tryToClaimBonus() {
    const icon = document.querySelector("div.claimable-bonus__icon");

    if (!(icon instanceof HTMLDivElement)) return;

    const button = icon.closest("button");

    if (!(button instanceof HTMLButtonElement)) return;

    button.click();

    const points = await numberOfReceivedPoints();

    const channel = window.location.pathname.split("/")[1];

    storage.get(channel).then((data) => {
        const current = data[channel] || 0;
        storage.set({ [channel]: current + points });
    });
}

/**
 * Retrieves the number of points received from a bonus with retries.
 *
 * - Continuously checks for the presence of a specific container to extract the bonus points.
 * - Retries up to a maximum number of attempts (`MAX_ATTEMPTS`) with a delay between attempts (`TIMEOUT`).
 * - Returns a default value (`DEFAULT_POINTS`) if no valid points are detected within the maximum attempts.
 *
 * @returns {Promise<number>} Resolves with the extracted number of points or a default value if no points are found.
 */
async function numberOfReceivedPoints() {
    const MAX_ATTEMPTS = 50;
    const TIMEOUT = 100;
    const DEFAULT_POINTS = 50;

    return new Promise((resolve) => {
        let attempts = 0;

        const intervalID = setInterval(() => {
            attempts += 1;

            // If the maximum number of attempts is reached, return the default points.
            if (attempts >= MAX_ATTEMPTS) {
                clearInterval(intervalID);
                resolve(DEFAULT_POINTS);
                return;
            }

            const container = document.querySelector(CONTAINER_SELECTOR);
            if (!(container instanceof HTMLDivElement)) return;
            const pointsAnimationContainer = container.children[1];
            if (!(pointsAnimationContainer instanceof HTMLDivElement)) return;
            const text = pointsAnimationContainer.innerText;
            if (!text) return;

            clearInterval(intervalID);
            resolve(parseInt(text) || DEFAULT_POINTS);
        }, TIMEOUT);
    });
}

/**
 * Highlights a points container by applying a visual outline and adding an emoji indicator.
 * Ensures the container has not been previously modified.
 */
function highlightPointsContainer() {
    const container = document.querySelector(CONTAINER_SELECTOR);

    if (!(container instanceof HTMLDivElement)) return;
    // already modified
    if (container.dataset.tgac) return;

    container.dataset.tgac = "true";
    container.style.outline = "1px dashed var(--color-background-button-brand)";

    const emoji = document.createElement("span");
    emoji.style.position = "absolute";
    emoji.style.top = "0px";
    emoji.style.right = "0px";
    emoji.style.pointerEvents = "none";
    emoji.style.userSelect = "none";
    emoji.style.transform = "translate(50%, -50%)";
    emoji.textContent = "👀";

    container.appendChild(emoji);
}

function main() {
    tryToClaimBonus();
    highlightPointsContainer();

    setInterval(() => {
        tryToClaimBonus();
        highlightPointsContainer();
    }, REFRESH_INTERVAL);
}

domReady(main);
