/*global define*/

define([], function () {

    let installed = false;


    function MissionControlPlugin() {
        return function install(openmct) {
            if (installed) {
                return;
            }

            openmct.types.addType('tutorials/todo', {
                name: "To-do Plugin",
                creatable: true,
                description: "Allows creating and editing to-do lists.",
                cssClass: 'icon-flexible-layout',
                // initialize: function (domainObject) {
                //     domainObject.configuration = {
                //         containers: [new Container.default(50), new Container.default(50)],
                //         rowsLayout: false
                //     };
                //     domainObject.composition = [];
                // }
            });
            //
            // openmct.legacyRegistry.register("", {
            //     "name": "",
            //     "description": "",
            //     "extensions": {
            //         "types": [
            //             {
            //                 "key": "example.todo",
            //                 "name": "To-Do List",
            //                 "cssClass": "icon-check",
            //                 "description": "A list of things that need to be done.",
            //                 "features": ["creation"]
            //             }
            //         ],
            //         "views": [
            //             {
            //                 "key": "example.todo",
            //                 "type": "example.todo",
            //                 "cssClass": "icon-check",
            //                 "name": "List",
            //                 "templateUrl": "templates/missionControl.html",
            //                 "editable": true
            //             }
            //         ]
            //     }
            // });


        };
    }

    return MissionControlPlugin;
});