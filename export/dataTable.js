new Vue({
    el: '#data-table-page',
    methods: {
        populate: function () {

            Object.assign(this.savedData, loadData('test'));
            this.$forceUpdate();
        }
    },
    data: {
        savedData: [
            {v0: 1, v1: 2},
            {v0: 3, v1: 4},
            {v0: 5, v1: 6},
            {v0: 7, v1: 8},
            {v0: 9, v1: 10},
            {v0: 11, v1: 12}
        ],
        sample: [
            {v0: 11, v1: 12},
            {v0: 13, v1: 14},
            {v0: 15, v1: 16},
            {v0: 17, v1: 18},
            {v0: 19, v1: 20},
            {v0: 21, v1: 22}
        ]
    }
});


/*
// register the grid component
Vue.component('data-grid', {
    template: '#data-table',
    props: {
        data: Array,
        columns: Array,
        filterKey: String
    },
    data: function () {
        var sortOrders = {};
        this.columns.forEach(function (key) {
            sortOrders[key] = 1
        });
        return {
            sortKey: '',
            sortOrders: sortOrders
        }
    },
    computed: {
        filteredData: function () {
            const sortKey = this.sortKey;
            const filterKey = this.filterKey && this.filterKey.toString().toLowerCase();
            const order = this.sortOrders[sortKey] || 1;
            var data = this.data;
            if (filterKey) {
                data = data.filter(function (row) {
                    return Object.keys(row).some(function (key) {
                        return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                    })
                })
            }
            if (sortKey) {
                data = data.slice().sort(function (a, b) {
                    a = a[sortKey];
                    b = b[sortKey];
                    return (a === b ? 0 : a > b ? 1 : -1) * order
                })
            }
            return data;
        }
    },
    filters: {
        capitalize: function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        }
    },
    methods: {
        sortBy: function (key) {
            this.sortKey = key;
            this.sortOrders[key] = this.sortOrders[key] * -1
        }
    }
});

// bootstrap the demo
//pass array of column names "gridColumns" and json to "gridDara"
const demo = new Vue({
    el: '#demo',
    data: {
        searchQuery: '',
        gridColumns: ['name', 'power', 'dead', '4'],
        gridData: [ loadData('test')]
    }
});

*/