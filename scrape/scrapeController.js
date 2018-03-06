new Vue({
    el: '#scrapeApp',
    methods: {
        scrape: function () {
            chrome.runtime.sendMessage({action: 'scrape_web_page', data: {rules: []}}, function (response) {
                //TODO do something with scraped data
            });
        }
    },
});
