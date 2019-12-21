<template>
    <div>
        <p>heelllooo</p>
        <p> {{domainObject}}</p>
        <button v-on:click="haha">Reverse Message</button>
        <p v-if="stationary != null">{{stationary}}</p>
        <p v-if="mobile != null">{{mobile}}</p>
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
                composition_mobile: []
            }
        },
        methods: {
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