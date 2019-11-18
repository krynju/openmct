/*global define*/

const BACKEND_ADDRESS = "http://localhost:5000";

async function fetchData() {
    let response = await fetch(BACKEND_ADDRESS + "/data", {method: "get"});
    return await response.json();
}

async function getObject(key) {
    let response = await fetch(BACKEND_ADDRESS + '/objects' + '?key=' + key.toString(), {method: "get"});
    return await response.json()
}

async function getComposition(key) {
    let response = await fetch(BACKEND_ADDRESS + '/composition' + '?key=' + key.toString(), {method: "get"});
    return await response.json()
}

let objectProvider = {
    get: function (identifier) {
        return getObject(identifier.key).then(function (result) {
            return {
                identifier: identifier,
                name: result.name,
                type: result.type
            };
        });
    }
};


var compositionProvider = {
    appliesTo: function (domainObject) {
        return domainObject.identifier.namespace === 'example.namespace';
    },
    load: function (domainObject) {
        return getComposition(domainObject.identifier.key)
            .then(function (result) {
                return result;
            })
    }
};

define([], function () {

    let installed = false;


    function TestPlugin() {
        return function install(openmct) {
            if (installed) {
                return;
            }
            installed = true;

            // openmct.legacyRegistry.enable("openmct/plot");


            openmct.objects.addRoot({
                namespace: 'example.namespace',
                key: '5dd297fb6824251bd4883780'
            });

            openmct.objects.addProvider('example.namespace', objectProvider);

            openmct.composition.addProvider(compositionProvider)


        };
    }

    return TestPlugin;
});
