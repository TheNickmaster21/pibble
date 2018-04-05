new Vue({
    el: '#ruleset-page',
    methods: {
        getTokens: function () {
            console.log("get tokens");
            let scrapeData = {action: 'get_tokens'};
            chrome.runtime.sendMessage(scrapeData, (response) => {
                console.log(response);
                this.tokens = response;
            });
        }
    },
    data: {
        tokens: ""
    }
});
