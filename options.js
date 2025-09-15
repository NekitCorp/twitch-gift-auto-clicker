// @ts-check

// @ts-ignore
const storage = chrome.storage.local;
// @ts-ignore
const indicatorStorageKey = "#indicator";

const indicatorCheckbox = document.getElementById("indicator");

if (indicatorCheckbox instanceof HTMLInputElement) {
    storage.get({ [indicatorStorageKey]: true }, (items) => {
        indicatorCheckbox.checked = items[indicatorStorageKey];
    });

    indicatorCheckbox.addEventListener("change", () => {
        storage.set({ [indicatorStorageKey]: indicatorCheckbox.checked });
    });
}
