new Vue({
    el: '#scrapeApp',
    methods: {
        scrape: function () {
            if (this.selectedRuleSetOption) {
                let scrapeData = {
                    action: 'scrape_web_page',
                    data: this.selectedRuleSetOption
                };
                chrome.runtime.sendMessage(scrapeData, (response) => {
                    this.scrapeResults = response;
                    this.$forceUpdate();
                    let newRowData = {
                        action: 'add_row_to_data_set',
                        id: this.selectedRuleSetOption && this.selectedRuleSetOption.id,
                        row: response
                    };
                    console.log(newRowData)
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
