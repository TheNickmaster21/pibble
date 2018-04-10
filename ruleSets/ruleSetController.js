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
        },
        updateMatchedTokens: function () {
            if (this.userText === '') {
                this.matchedTokens = [];
            } else {
                this.matchedTokens = _.filter(this.tokens, token => {
                    return token.innerText && token.innerText.includes(this.userText);
                });
            }
        },
        pickToken: function (id) {
            this.userText = "";
            this.updateMatchedTokens();
        }
    },
    data: {
        tokens: [],
        userText: "",
        matchedTokens: "",
        selectedRuleSetOption: "",
        ruleSetOptions: []
    }
});
