/*global define*/

define(['./MissionControlProvider'], function (MissionControlProvider) {

    let installed = false;


    function MissionControlPlugin() {
        return function install(openmct) {
            if (installed) {
                return;
            }
            openmct.objectViews.addProvider(new MissionControlProvider(openmct));

            openmct.types.addType('mission', {
                name: "Mission Interface",
                creatable: true,
                description: "Allows for control over missions",
                cssClass: 'icon-flexible-layout',
                initialize(domainObject) {
                    domainObject.composition = [];
                    domainObject.mission_mode = '';
                    domainObject.__mission_obj = {};
                }
            });
        };
    }

    return MissionControlPlugin;
});