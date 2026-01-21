/**
 * Reload all twitch tabs to ensure the extension is loaded.
 */
function reloadTabs() {
    chrome.tabs.query({}, (tabs) => {
        for (const tab of tabs) {
            // Access to the tab's url will only be available to pages with host permissions.
            // See `manifest.json` -> `host_permissions`.
            if (tab.url) {
                chrome.tabs.reload(tab.id);
            }
        }
    });
}

chrome.runtime.onInstalled.addListener(() => {
    reloadTabs();
});