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
                {
                    selector: ".data[data-reactid*='Revenues ($M)']",
                    index: 0,
                    regex: ""
                }
            ]
        }
    }
});
