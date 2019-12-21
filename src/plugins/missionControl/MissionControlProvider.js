define([
    './components/MissionControl.vue',
    'vue'
], function (
    MissionControlComponent,
    Vue
) {
    function MissionControlProvider(openmct) {
        return {
            key: 'Mission',
            name: 'mission',
            cssClass: 'icon-tabular-lad',
            canView: function (domainObject) {
                return domainObject.type === 'mission';
            },
            canEdit: function (domainObject) {
                return domainObject.type === 'mission';
            },
            view: function (domainObject, objectPath) {
                let component;

                return {
                    show: function (element) {
                        component = new Vue({
                            el: element,
                            components: {
                                MissionControlComponent: MissionControlComponent.default
                            },
                            provide: {
                                openmct,
                                domainObject,
                                objectPath
                            },
                            template: '<mission-control-component></mission-control-component>'
                        });
                    },
                    destroy: function (element) {
                        component.$destroy();
                        component = undefined;
                    }
                };
            },
            priority: function () {
                return 1;
            }
        };
    }

    return MissionControlProvider;
});
