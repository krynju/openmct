<template>
    <div>
        <!--        <p>heelllooo</p>-->
        <!--        <p> {{domainObject}}</p>-->
        <button v-on:click="haha">upload</button>
        <button v-on:click="haha">update</button>
        <button v-on:click="haha">remove</button>

        <div><p>goal: 100 data points</p></div>


        <div v-for="item in stationary_items_only(items)">
            <input :id="item.key" :value="item" type="checkbox" v-model="checked_stat_items">
            <label :for="item.key">{{item.key}}</label>
        </div>
        <div>
            <p v-for="item in mobile_items_only(items)">{{item.domainObject.name}}</p>
        </div>

    </div>

</template>

<script>


    export default {
        inject: ['openmct', 'domainObject', 'objectPath'],

        name: "MissionControl",
        data() {
            return {
                stationary: null,
                composition_stationary: [],
                mobile: null,
                composition_mobile: [],
                items: [],
                checked_stat_items: [],
            }
        },
        mounted() {
            this.composition = this.openmct.composition.get(this.domainObject);
            this.composition.on('add', this.addItem);
            this.composition.on('remove', this.removeItem);
            this.composition.on('reorder', this.reorder);
            this.composition.load();
        },
        destroyed() {
            this.composition.off('add', this.addItem);
            this.composition.off('remove', this.removeItem);
            this.composition.off('reorder', this.reorder);
        },
        methods: {
            stationary_items_only(items) {
                return items.filter(x => x.key.includes('sm.telemetry') || x.key.includes('sm.stationary_unit'))
            },

            mobile_items_only(items) {
                return items.filter(x => x.key.includes('sm.mobile_unit'))
            },

            addItem(domainObject) {
                let item = {};
                item.domainObject = domainObject;
                item.key = this.openmct.objects.makeKeyString(domainObject.identifier);

                this.items.push(item);
            },
            removeItem(identifier) {
                console.log(identifier);
                let index = _.findIndex(this.items, (item) => this.openmct.objects.makeKeyString(identifier) === item.key);

                this.items.splice(index, 1);
            },
            reorder(reorderPlan) {
                console.log(reorderPlan);
                let oldItems = this.items.slice();
                reorderPlan.forEach((reorderEvent) => {
                    this.$set(this.items, reorderEvent.newIndex, oldItems[reorderEvent.oldIndex]);
                });
            },

            stationary_fill: function (obj) {
                this.stationary = obj;
                this.openmct.composition
                    .get(obj)
                    .load()
                    .then(r => this.composition_stationary = r)
            },

            mobile_fill: function (obj) {
                this.mobile = obj;
                this.openmct.composition
                    .get(obj)
                    .load()
                    .then(r => this.composition_mobile = r)

            },

            haha: function () {
                console.log(this.checked_stat_items)
                this.openmct.objects.rootProvider.get()
                    .then(result => result.composition
                        .filter(x => !!x.namespace && x.namespace === 'sm.folder')
                        .map(x => this.openmct.objects.get(x)))
                    .then(result => {
                        for (let x of result) {
                            x.then(y => {
                                if (y.name === "Stationary Sensors" && y.type === "folder")
                                    this.stationary_fill(y);
                                else if (y.name === "Mobile Units" && y.type === "folder")
                                    this.mobile_fill(y);
                            })
                        }
                    })
            }
        }
    }
</script>

<style scoped>

</style>