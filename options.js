/**
 * Entry point.
 */
function main() {
    const indicatorStorageKey = "#indicator";

    const indicatorCheckbox = document.getElementById("indicator");
    if (!(indicatorCheckbox instanceof HTMLInputElement)) return;

    chrome.storage.local.get({ [indicatorStorageKey]: true }, (items) => {
        if (typeof items[indicatorStorageKey] !== "boolean") return;
        indicatorCheckbox.checked = items[indicatorStorageKey];
    });

    indicatorCheckbox.addEventListener("change", () => {
        chrome.storage.local.set({ [indicatorStorageKey]: indicatorCheckbox.checked });
    });
}

main();