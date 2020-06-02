chrome.extension.sendMessage({}, function (response) {
    var readyStateCheckInterval = setInterval(function () {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);

            // ----------------------------------------------------------
            // This part of the script triggers when page is done loading
            const observer = new MutationObserver(function (mutationsList) {
                for (const mutation of mutationsList) {
                    for (const addedNode of mutation.addedNodes) {
                        if (
                            addedNode.querySelector &&
                            addedNode.querySelector(".claimable-bonus__icon")
                        ) {
                            // log
                            console.log(
                                `I clicked for you ${
                                    document
                                        .querySelector(".community-points-summary")
                                        .querySelector('[data-test-selector="balance-string"]')
                                        .innerText
                                } ${new Date().toLocaleTimeString()}`
                            );

                            // click
                            addedNode.querySelector("button").click();
                        }
                    }
                }
            });

            observer.observe(document.querySelector(".community-points-summary"), {
                childList: true,
                subtree: true,
            });
            // ----------------------------------------------------------
        }
    }, 10);
});
