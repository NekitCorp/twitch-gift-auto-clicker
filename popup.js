/**
 * Get points from storage items.
 * @param { Record<string, unknown> } items
 * @returns { [string, number][] }
 */
function getPoints(items) {
    /** @type { [string, number][] } */
    const points = [];

    for (const [key, value] of Object.entries(items)) {
        if (key.startsWith("#")) continue; // Keys starting with # are options.
        if (typeof value !== "number") continue; // Values must be numbers.
        points.push([key, value]);
    }

    points.sort((a, b) => b[1] - a[1]);

    return points;
}

/**
 * Render points to the table.
 * @param { [string, number][] } points
 */
function renderPoints(points) {
    const tbody = document.querySelector("tbody");
    if (!(tbody instanceof HTMLTableSectionElement)) return;

    for (const [channelName, channelPoints] of points) {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);

        const tdChannel = document.createElement("td");
        const aChannel = document.createElement("a");
        aChannel.href = `https://www.twitch.tv/${channelName}`;
        aChannel.textContent = channelName;
        tdChannel.appendChild(aChannel);
        tr.appendChild(tdChannel);

        const tdPoints = document.createElement("td");
        tdPoints.textContent = channelPoints.toString();
        tr.appendChild(tdPoints);
    }

    tbody.addEventListener("click", (event) => {
        const target = event.target;

        if (target instanceof HTMLAnchorElement) {
            chrome.tabs.create({ url: target.getAttribute("href") });
        }
    });
}

/**
 * Add handlers to the elements.
 */
function addHandlers() {
    const goToOptions = document.querySelector("#go-to-options");

    if (goToOptions instanceof HTMLAnchorElement) {
        goToOptions.addEventListener("click", (e) => {
            e.preventDefault();

            if (chrome.runtime.openOptionsPage) {
                chrome.runtime.openOptionsPage();
            } else {
                window.open(chrome.runtime.getURL("options.html"));
            }
        });
    }
}

/**
 * Entry point.
 */
function main() {
    chrome.storage.local.get().then((items) => {
        renderPoints(getPoints(items));
    });

    addHandlers();
}

main();
