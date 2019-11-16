/*global define*/

define([

], function (

) {

    let installed = false;

    function TestPlugin() {
        return function install(openmct) {
            if (installed) {
                return;
            }
            installed = true;

            console.log("hey test plugin is here")

            // openmct.legacyRegistry.enable("openmct/plot");
        };
    }

    return TestPlugin;
});
