new Vue({
    el: '#scrapeApp',
    methods: {
        scrape: function () {
            chrome.runtime.sendMessage('scrape_web_page', function (response) {
                //TODO do something with scraped data
            });
        }
    },
});
