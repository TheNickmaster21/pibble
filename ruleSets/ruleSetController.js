new Vue({
    el: '#ruleset-page',
    methods: {
            chrome.runtime.sendMessage(scrapeData, (response) => {
            });
        }
    },
    data: {
        scrapeResults: [],
        ruleSetOptions: [
            "Fortune",
            "Edgar"
        ],
        selectedRuleSetOption: null
    }
});
