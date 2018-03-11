new Vue({
    el: '#data-table-page',
    methods: {
        load: function () {
            chrome.runtime.sendMessage(scrapeData, (response) => {

            });
        }
    },
    data: {
        savedData: []
    }
});