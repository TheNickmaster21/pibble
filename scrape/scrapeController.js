new Vue({
    el: '#scrapeApp',
    methods: {
        scrape: function () {
            if (this.selectedRuleSetOption) {
                this.scrapeResults.splice(0, this.scrapeResults.length);
                let scrapeData = {
                    action: 'labrador_scrape_web_page',
                    data: this[this.selectedRuleSetOption.value + 'RuleSet']
                };
                chrome.runtime.sendMessage(scrapeData, (response) => {
                    Array.prototype.push.apply(this.scrapeResults, response);
                    this.$forceUpdate();
                    let newRowData = {
                        action: 'labrador_add_row_to_data_set',
                        id: this.selectedRuleSetOption && this.selectedRuleSetOption.id,
                        row: response
                    };
                    chrome.runtime.sendMessage(newRowData);
                });
            }
        }
    },
    data: {
        scrapeResults: [],
        ruleSetOptions: [],
        selectedRuleSetOption: null
    },
    beforeCreate: function () {
        let getRuleSets = {
            action: 'get_rule_sets'
        };
        chrome.runtime.sendMessage(getRuleSets, (response) => {
            this.ruleSetOptions = response;
        });
    }
});
