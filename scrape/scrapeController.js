new Vue({
    el: '#scrapeApp',
    methods: {
        scrape: function () {
            this.scrapeResults.splice(0, this.scrapeResults.length);
            chrome.runtime.sendMessage({action: 'scrape_web_page', data: this.ruleSet}, (response) => {
                Array.prototype.push.apply(this.scrapeResults, response);
                this.$forceUpdate();
            });
        }
    },
    data: {
        scrapeResults: [],
        ruleSet: {
            rules: [
                { // Ticker
                    selector: ".branding-tile-ticker",
                    selectorIndex: 0,
                    regex: "([^\\s]+)",
                    regexIndex: 0
                },
                { // Rank
                    selector: "p.branding-tile-rank",
                    selectorIndex: 0,
                    regex: "",
                    regexIndex: 0
                },
                { // Share Price
                    selector: ".branding-tile-ticker",
                    selectorIndex: 0,
                    regex: "([^\\s]+)",
                    regexIndex: 1
                },
                { // Revenue
                    selector: ".data[data-reactid*='Revenues ($M)']",
                    selectorIndex: 0,
                    regex: ""
                },
                { // Revenue Change
                    selector: ".data[data-reactid*='Revenue Change']",
                    selectorIndex: 0,
                    regex: ""
                },
                { // Profits
                    selector: ".data[data-reactid*='Profits ($M)']",
                    selectorIndex: 0,
                    regex: ""
                },
                { // Profits Change
                    selector: ".data[data-reactid*='Profit Change']",
                    selectorIndex: 0,
                    regex: ""
                }
            ]
        }
    }
});
