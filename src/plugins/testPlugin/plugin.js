/*global define*/

async function fetchData() {
    let response = await fetch("http://localhost:5000/data", {method: "get"});
    let data = await response.json();
    return data;
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
