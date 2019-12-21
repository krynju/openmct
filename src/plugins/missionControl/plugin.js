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
                name: "To-do Plugin",
                creatable: true,
                description: "Allows creating and editing to-do lists.",
                cssClass: 'icon-flexible-layout',
                initialize(domainObject) {
                    domainObject.composition = [];
                }
            });
        };
    }

    return MissionControlPlugin;
});