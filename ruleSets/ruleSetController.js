new Vue({
    el: '#ruleset-page',
    methods: {
        updateMatchedTokens: function () {
            if (this.userText === '') {
                this.matchedTokens = [];
            } else {
                this.matchedTokens = _.sortBy(
                    _.filter(this.tokens, token => {
                        return token.innerText.toLowerCase()
                            .includes(this.userText.toLowerCase());
                    }), token => {
                        return token.innerText.length;
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
    },
    beforeCreate: function () {
        console.log("get tokens");
        let scrapeData = {action: 'get_tokens'};
        chrome.runtime.sendMessage(scrapeData, (response) => {
            console.log(response);
            this.tokens = response;
        });
    }
});
