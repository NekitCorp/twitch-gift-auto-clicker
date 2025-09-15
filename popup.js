// @ts-check

// @ts-ignore
const storage = chrome.storage.local;
// @ts-ignore
const tabs = chrome.tabs;
// @ts-ignore
const runtime = chrome.runtime;

storage.get().then((data) => {
    const sortedData = Object.entries(data)
        .filter(([key]) => !key.startsWith("#")) // Keys starting with # are options.
        .sort((a, b) => b[1] - a[1]);
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

const goToOptions = document.querySelector("#go-to-options");

if (goToOptions instanceof HTMLAnchorElement) {
    goToOptions.addEventListener("click", (e) => {
        e.preventDefault();

        if (runtime.openOptionsPage) {
            runtime.openOptionsPage();
        } else {
            window.open(runtime.getURL("options.html"));
        }
    });
}
