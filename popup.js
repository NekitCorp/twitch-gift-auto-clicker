// @ts-check

// @ts-ignore
const storage = chrome.storage.local;
// @ts-ignore
const tabs = chrome.tabs;

storage.get().then((data) => {
    const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);
    const tbody = document.querySelector("tbody");

    if (!(tbody instanceof HTMLTableSectionElement)) return;

    for (const [channelName, channelPoints] of sortedData) {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);

        const tdChannel = document.createElement("td");
        const aChannel = document.createElement("a");
        aChannel.href = `https://www.twitch.tv/${channelName}`;
        aChannel.textContent = channelName;
        tdChannel.appendChild(aChannel);
        tr.appendChild(tdChannel);

        const tdPoints = document.createElement("td");
        tdPoints.textContent = channelPoints;
        tr.appendChild(tdPoints);
    }

    tbody.addEventListener("click", (event) => {
        const target = event.target;

        if (target instanceof HTMLAnchorElement) {
            tabs.create({ url: target.getAttribute("href") });
        }
    });
});
