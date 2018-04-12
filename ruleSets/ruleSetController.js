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
            // TODO actual logic
            this.selectedRuleSetOption.rules[this.ruleIndex].id = id;
            this.userText = "";
            this.updateMatchedTokens();
        },
        selectRuleSetOption: function (option) {
            this.ruleIndex = 0;
            this.selectedRuleSetOption = option;
        },
        newRuleSet: function () {
            console.log(this.ruleSetOptions);
            this.ruleSetOptions.push({
                id: this.ruleSetOptions.length,
                name: "",
                rules: [{elements: '', index: 0}]
            });
            this.selectedRuleSetOption = this.ruleSetOptions[this.ruleSetOptions.length - 1];
        },
        newRule: function () {
            if (this.selectedRuleSetOption)
                this.selectedRuleSetOption.rules.push({elements: '', index: 0});
        },
        prevRule: function () {
            if (this.ruleIndex > 0)
                this.ruleIndex--;
        },
        nextRule: function () {
            if (this.selectedRuleSetOption && this.selectedRuleSetOption.rules.length - 1 > this.ruleIndex)
                this.ruleIndex++;
        },
        save: function () {
            let saveData = {action: 'save_rule_sets', data: this.ruleSetOptions};
            chrome.runtime.sendMessage(saveData);
        }
    },
    data: {
        tokens: [],
        mode: "ruleSet",
        userText: "",
        matchedTokens: "",
        selectedRuleSetOption: "",
        ruleSetOptions: [],
        ruleIndex: 0
    },
    beforeCreate: function () {
        let scrapeData = {action: 'get_tokens'};
        chrome.runtime.sendMessage(scrapeData, (response) => {
            this.tokens = response;
        });
        let ruleSetRequest = {action: 'get_rule_sets'};
        chrome.runtime.sendMessage(ruleSetRequest, (response) => {
            this.ruleSetOptions = response;
        });
    }
});
