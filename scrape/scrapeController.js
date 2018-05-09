new Vue({
    el: '#scrapeApp',
    methods: {
        scrape: function () {
            if (this.selectedRuleSetOption) {
                let scrapeData = {
                    action: 'scrape_web_page',
                    data: this.selectedRuleSetOption
                };
                this.scrapeResults.splice(0, this.scrapeResults.length);
                chrome.runtime.sendMessage(scrapeData, (response) => {
                    _.each(response, (value, index) => {
                        this.scrapeResults.push({key: this.selectedRuleSetOption.rules[index].name, value: value});
                    });
                    this.$forceUpdate();
                    let newRowData = {
                        action: 'add_row_to_data_set',
                        id: this.selectedRuleSetOption && this.selectedRuleSetOption.id,
                        row: response
                    };
                    chrome.runtime.sendMessage(newRowData, (response) => {
                        this.constraintViolation = !response;
                    });
                });
            }
        },
        selectRuleSetOption: function (option) {
            this.selectedRuleSetOption = option;
            let saveRuleSetState = {
                action: 'save_rule_set_state',
                id: option && option.id
            };
            chrome.runtime.sendMessage(saveRuleSetState);
        },
        updatePageState: function (page) {
            const savePageState = {
                action: 'save_page_state',
                id: page
            };
            chrome.runtime.sendMessage(savePageState);
        }
    },
    data: {
        scrapeResults: [],
        ruleSetOptions: [],
        selectedRuleSetOption: null,
        constraintViolation: false
    },
    beforeCreate: function () {
        let getRuleSets = {
            action: 'get_rule_sets'
        };
        chrome.runtime.sendMessage(getRuleSets, (response) => {
            this.ruleSetOptions = response;
            let loadRuleSetState = {
                action: 'load_rule_set_state'
            };
            chrome.runtime.sendMessage(loadRuleSetState, (id) => {
                this.selectedRuleSetOption = _.findWhere(this.ruleSetOptions, {id: id});
            });
        });
    }
});
