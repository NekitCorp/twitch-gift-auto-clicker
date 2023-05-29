// @ts-check

// @ts-ignore
const storage = chrome.storage.local;

storage.get().then((data) => {
    const tbody = document.querySelector("tbody");

    if (!(tbody instanceof HTMLTableSectionElement)) return;

    for (const key in data) {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);

        const tdChannel = document.createElement("td");
        tdChannel.textContent = key;
        tr.appendChild(tdChannel);

        const tdPoints = document.createElement("td");
        tdPoints.textContent = data[key];
        tr.appendChild(tdPoints);
    }
});
