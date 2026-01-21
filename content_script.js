/**
 * @param {() => void} callback
 */
function domReady(callback) {
    if (
        document.readyState === "complete" ||
        document.readyState !== "loading"
    ) {
        callback();
    } else {
        document.addEventListener("DOMContentLoaded", callback);
    }
}

function tryToClaimBonus() {
    const icon = document.querySelector("div.claimable-bonus__icon");

    if (!(icon instanceof HTMLDivElement)) return;

    const button = icon.closest("button");

    if (!(button instanceof HTMLButtonElement)) return;

    button.click();

    const channel = window.location.pathname.split("/")[1];

    chrome.storage.local.get(channel).then((data) => {
        const current = typeof data[channel] === "number" ? data[channel] : 0;
        chrome.storage.local.set({ [channel]: current + 50 });
    });
}

function modifyPointsContainer() {
    const container = document.querySelector(
        '[data-test-selector="community-points-summary"]'
    );

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

/**
 * Entry point.
 */
function main() {
    const REFRESH_INTERVAL = 3 * 1000;
    const INDICATOR_STORAGE_KEY = "#indicator";

    chrome.storage.local.get({ [INDICATOR_STORAGE_KEY]: true }, (items) => {
        const indicator = items[INDICATOR_STORAGE_KEY];

        tryToClaimBonus();
        if (indicator) modifyPointsContainer();

        setInterval(() => {
            tryToClaimBonus();
            if (indicator) modifyPointsContainer();
        }, REFRESH_INTERVAL);
    });
}

domReady(main);
