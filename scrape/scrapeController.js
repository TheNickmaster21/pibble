new Vue({
    el: '#scrapeApp',
    methods: {
        scrape: function () {
            if (this.selectedRuleSetOption) {
                this.scrapeResults.splice(0, this.scrapeResults.length);
                let data = {action: 'scrape_web_page', data: this[this.selectedRuleSetOption + 'RuleSet']};
                chrome.runtime.sendMessage(data, (response) => {
                    Array.prototype.push.apply(this.scrapeResults, response);
                    this.$forceUpdate();
                });
            }
        }
    },
    data: {
        scrapeResults: [],
        ruleSetOptions: [
            "fortune",
            "edgar"
        ],
        selectedRuleSetOption: "edgar",
        fortuneRuleSet: {
            rules: [
                { // Ticker
                    selector: ".branding-tile-ticker",
                    selectorIndex: 0,
                    regex: "([^\\s]+)",
                    regexIndex: 0
                },
                { // Rank
                    selector: "p.branding-tile-rank",
                    selectorIndex: 0
                },
                { // Revenue
                    selector: ".data[data-reactid*='Revenues ($M)']",
                    selectorIndex: 0
                },
                { // Revenue Change
                    selector: ".data[data-reactid*='Revenue Change']",
                    selectorIndex: 0
                },
                { // Profits
                    selector: ".data[data-reactid*='Profits ($M)']",
                    selectorIndex: 0
                },
                { // Profits Change
                    selector: ".data[data-reactid*='Profit Change']",
                    selectorIndex: 0
                },
                { // Assets
                    selector: "td[data-reactid*='company-data-Assets']",
                    selectorIndex: 1
                },
                { // Market Value
                    selector: "td[data-reactid*='company-data-Market Value']",
                    selectorIndex: 1
                },
                { // Employees
                    selector: "p[data-reactid*='company-info-card-Employees']",
                    selectorIndex: 1
                },
                { // Previous Rank
                    selector: ".data[data-reactid*='slide-Previous Rank']",
                    selectorIndex: 0
                },
                { // CEO
                    selector: "p[data-reactid*='company-info-card-CEO.']",
                    selectorIndex: 1
                },
                { // CEO Title
                    selector: "p[data-reactid*='company-info-card-CEO Title']",
                    selectorIndex: 1
                },
                { // Sector
                    selector: "p[data-reactid*='company-info-card-Sector']",
                    selectorIndex: 1
                },
                { // Industry
                    selector: "p[data-reactid*='company-info-card-Industry']",
                    selectorIndex: 1
                },
                { // HQ Location
                    selector: "p[data-reactid*='company-info-card-HQ Location']",
                    selectorIndex: 0
                },
                { // Website
                    selector: "a[data-reactid*='company-info-card-Website']",
                    selectorIndex: 0
                },
                { // Years on Fortune
                    selector: "p[data-reactid*='company-info-card-Years on Fortune']",
                    selectorIndex: 1
                },
                { // Market Cap
                    selector: ".ticker-item",
                    selectorIndex: 1
                }
            ]
        },
        edgarRuleSet: { // Beta website
            rules: [
                { // Name
                    selector: "h1",
                    selectorIndex: 1
                },
                { // CIK
                    selector: "span",
                    selectorIndex: 4,
                    regex: "([^\\s]+)",
                    regexIndex: 1
                },
                { // Business Address
                    selector: "span",
                    selectorIndex: 4,
                    regex: "([^\\s]+)",
                    regexIndex: 1
                },
                { // Mailing Address
                    selector: "div#mailing-address",
                    selectorIndex: 0,
                    substring: [16]
                },
                { // Business Address
                    selector: "div#business-address",
                    selectorIndex: 0,
                    substring: [17]
                },
                { // SIC
                    selector: "span",
                    selectorIndex: 6,
                    regex: "([^\\s]+)",
                    regexIndex: 1
                },
                { // Industry
                    selector: "span.indent",
                    selectorIndex: 0,
                    substring: [16]
                },

            ]
        }
    }
});
