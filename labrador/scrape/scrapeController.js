new Vue({
    el: '#scrapeApp',
    methods: {
        scrape: function () {
            if (this.selectedRuleSetOption) {
                let ruleSet = this[this.selectedRuleSetOption.value + 'RuleSet'];
                this.scrapeResults.splice(0, this.scrapeResults.length);
                let scrapeData = {
                    action: 'labrador_scrape_web_page',
                    data: ruleSet
                };
                chrome.runtime.sendMessage(scrapeData, (response) => {
                    _.each(response, (value, index) => {
                        this.scrapeResults.push({key: ruleSet.rules[index].name, value: value});
                    });
                    this.$forceUpdate();
                    let newRowData = {
                        action: 'labrador_add_row_to_data_set',
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
                action: 'labrador_save_rule_set_state',
                id: option && option.display
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
        constraintViolation: false,
        ruleSetOptions: [
            {display: "Fortune", value: "fortune", id: 0},
            {display: "Edgar Beta", value: "betaEdgar", id: 1}
        ],
        selectedRuleSetOption: null,
        fortuneRuleSet: {
            rules: [
                { // Ticker
                    name: "Ticker",
                    selector: ".branding-tile-ticker",
                    selectorIndex: 0,
                    regex: "([^\\s]+)",
                    regexIndex: 0
                },
                { // Rank
                    name: "Rank",
                    selector: "p.branding-tile-rank",
                    selectorIndex: 0
                },
                { // Revenue
                    name: "Revenue",
                    selector: ".data[data-reactid*='Revenues ($M)']",
                    selectorIndex: 0
                },
                { // Revenue Change
                    name: "RevenueChange",
                    selector: ".data[data-reactid*='Revenue Change']",
                    selectorIndex: 0
                },
                { // Profits
                    name: "Profits",
                    selector: ".data[data-reactid*='Profits ($M)']",
                    selectorIndex: 0
                },
                { // Profits Change
                    name: "Profits Change",
                    selector: ".data[data-reactid*='Profit Change']",
                    selectorIndex: 0
                },
                { // Assets
                    name: "Assets",
                    selector: "td[data-reactid*='company-data-Assets']",
                    selectorIndex: 1
                },
                { // Market Value
                    name: "Market Value",
                    selector: "td[data-reactid*='company-data-Market Value']",
                    selectorIndex: 1
                },
                { // Employees
                    name: "Employees",
                    selector: "p[data-reactid*='company-info-card-Employees']",
                    selectorIndex: 1
                },
                { // Previous Rank
                    name: "Previous Rank",
                    selector: ".data[data-reactid*='slide-Previous Rank']",
                    selectorIndex: 0
                },
                { // CEO
                    name: "CEO",
                    selector: "p[data-reactid*='company-info-card-CEO.']",
                    selectorIndex: 1
                },
                { // CEO Title
                    name: "CEO Title",
                    selector: "p[data-reactid*='company-info-card-CEO Title']",
                    selectorIndex: 1
                },
                { // Sector
                    name: "Sector",
                    selector: "p[data-reactid*='company-info-card-Sector']",
                    selectorIndex: 1
                },
                { // Industry
                    name: "Industry",
                    selector: "p[data-reactid*='company-info-card-Industry']",
                    selectorIndex: 1
                },
                { // HQ Location
                    name: "HQ Location",
                    selector: "p[data-reactid*='company-info-card-HQ Location']",
                    selectorIndex: 1
                },
                { // Website
                    name: "Website",
                    selector: "a[data-reactid*='company-info-card-Website']",
                    selectorIndex: 0
                },
                { // Years on Fortune
                    name: "Years on Fortune",
                    selector: "p[data-reactid*='company-info-card-Years on Fortune']",
                    selectorIndex: 1
                },
                { // Market Cap
                    name: "Market Cap",
                    selector: ".ticker-item",
                    selectorIndex: 1
                }
            ]
        },
        betaEdgarRuleSet: { // Beta website
            rules: [
                { // Name
                    name: "Name",
                    selector: "h1",
                    selectorIndex: 1
                },
                { // CIK
                    name: "CIK",
                    selector: "span",
                    selectorIndex: 4,
                    regex: "([^\\s]+)",
                    regexIndex: 1
                },
                { // Mailing Address
                    name: "Mailing Address",
                    selector: "div#mailing-address",
                    selectorIndex: 0,
                    substring: [16]
                },
                { // Business Address
                    name: "Business Address",
                    selector: "div#business-address",
                    selectorIndex: 0,
                    substring: [17]
                },
                { // SIC
                    name: "SIC",
                    selector: "span",
                    selectorIndex: 6,
                    regex: "([^\\s]+)",
                    regexIndex: 1
                },
                { // Industry
                    name: "Industry",
                    selector: "span",
                    selectorIndex: 6,
                    substring: [12]
                },
                { // State Location
                    name: "State",
                    selector: "span.indent",
                    selectorIndex: 0,
                    substring: [16]
                }
            ]
        }
    },
    beforeCreate: function () {
        let loadRuleSetState = {
            action: 'labrador_load_rule_set_state'
        };
        chrome.runtime.sendMessage(loadRuleSetState, (id) => {
            this.selectedRuleSetOption = _.findWhere(this.ruleSetOptions, {display: id});
        });
    }
});
