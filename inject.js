chrome.extension.sendMessage({}, function (response) {
    var readyStateCheckInterval = setInterval(function () {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);

            // ----------------------------------------------------------
            // This part of the script triggers when page is done loading
            startObserver();
            // ----------------------------------------------------------
        }
    }, 10);
});

function startObserver() {
    const observer = new MutationObserver(function (mutationsList) {
        for (const mutation of mutationsList) {
            for (const addedNode of mutation.addedNodes) {
                if (addedNode.querySelector && addedNode.querySelector(".claimable-bonus__icon")) {
                    // log
                    console.log(
                        `I clicked for you ${
                            document
                                .querySelector(".community-points-summary")
                                .querySelector('[data-test-selector="balance-string"]').innerText
                        } ${new Date().toLocaleTimeString()}`
                    );

                    // click
                    addedNode.querySelector("button").click();
                }
            }
        }
    });

    observer.observe(document.body, {
        subtree: true,
        childList: true,
    });

    console.log("I started to follow the gitf o_o");
}
