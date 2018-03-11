new Vue({
    el: '#data-table-page',
    methods: {
        load: function () {
            Object.assign(this.savedData, loadData('test'));
            this.$forceUpdate();
        }
    },
    data: {
        savedData: []
    }
});