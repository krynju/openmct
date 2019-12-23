<template>
    <div>
        <a class="c-button" v-on:click="sm_upload" v-if="domainObject.mission_mode === 'creation'">Upload</a>
        <a class="c-button" v-on:click="sm_remove" v-if="domainObject.mission_mode === 'active'">Terminate</a>
        <a class="c-button" v-on:click="haha">adwadw2ad</a>
        <div><p>goal: 100 data points</p></div>

        <input v-if="domainObject.mission_mode === 'creation'" v-model="vname">

        <h2>Objects to monitor</h2>
        <p v-if="stationary_items_only(items).length === 0 && domainObject.mission_mode === 'creation'"> Drag and drop
            stationary units or single telemetry
            objects.</p>
        <div v-for="item in stationary_items_only(items)">
            <label :for="item.key">{{item.domainObject.name}}, {{item.key}}</label>
        </div>

        <h2>Job for mobile units:</h2>
        <p v-if="mobile_items_only(items).length === 0 && domainObject.mission_mode === 'creation'"> Drag and drop
            mobile units.</p>
        <div v-for="item in mobile_items_only(items)">
            <label :for="item.key">{{item.domainObject.name}}, {{item.key}}</label>
        </div>

    </div>

</template>

<script>

    const BACKEND_ADDRESS = "http://localhost:5000";

    async function getObject_openmct(key) {
        let response = await fetch(BACKEND_ADDRESS + '/objects_openmct' + '?key=' + key.toString(), {method: "get"});
        if (response.status !== 204)
            return await response.json();
        else
            return "not found"
    }

    async function mission_endpoint(key, body) {
        let response
        let link = BACKEND_ADDRESS + '/mission';
        if (key !== ''){
            link = link + '?key=' + key.toString();
            response = await fetch(link, {method: "post"});
    }
        else{
            response = await fetch(link, {method: "post", body: JSON.stringify(body)});

        }


        return await response.json()
    }


    export default {
        inject: ['openmct', 'domainObject', 'objectPath'],

        name: "MissionControl",
        data() {
            return {
                items: [],
                vname: "",
            }
        },
        mounted() {
            this.composition = this.openmct.composition.get(this.domainObject);
            this.composition.on('add', this.addItem);
            this.composition.on('remove', this.removeItem);
            this.composition.on('reorder', this.reorder);
            this.composition.load();

            if (this.domainObject.identifier.namespace === "")
                getObject_openmct(this.domainObject.identifier.key.toString())
                    .then(response => {
                        if (response !== "not found") {
                            this.domainObject.__mission_obj = response;
                            this.domainObject.mission_mode = response['mission_mode']
                        }
                    });

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

            sm_upload() {
                if (this.stationary_items_only(this.items).length === 0 || this.mobile_items_only(this.items).length === 0)
                    return;
                let mission_obj = {
                    name: this.vname === "" ? "RANDOMNAME" : this.vname,
                    mission_mode: 'active',
                    secondary_id: this.domainObject.identifier.key,
                    sm_monitor: this.stationary_items_only(this.items).map(x => x.domainObject._id),
                    sm_mobile: this.mobile_items_only(this.items).map(x => x.domainObject._id),
                    sm_goal: 'null',
                    composition: this.mobile_items_only(this.items).concat(this.stationary_items_only(this.items)).map(x => x.domainObject._id)
                };
                mission_endpoint('', mission_obj)
                    .then(response => {
                        this.domainObject.mission_mode = 'created';
                    });

            },
            sm_remove() {
                mission_endpoint(this.domainObject['__mission_obj']['_id']['$oid'], {})
                    .then(response => this.domainObject.mission_mode = 'inactive');
            },
            haha() {
                console.log(this.domainObject)
            }
        }
    }
</script>

<style scoped>

</style>