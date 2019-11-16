/*global define*/

const BACKEND_ADDRESS = "http://localhost:5000";

async function fetchData() {
    let response = await fetch(BACKEND_ADDRESS + "/data", {method: "get"});
    return await response.json();
}

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

            console.log("hey test plugin is here");

            // openmct.legacyRegistry.enable("openmct/plot");

            fetchData()
                .then(data => console.log(data))
        };
    }

    return TestPlugin;
});
