/*global define*/

const io = require('socket.io-client');

const BACKEND_ADDRESS = "http://localhost:5000";

async function fetchData(key, options) {
    let response = await fetch(
        BACKEND_ADDRESS + "/historical"
        + '?key=' + key.toString()
        + '&start=' + options.start.toString()
        + '&end=' + options.end.toString()
        + '&domain=' + options.domain.toString(),
        {method: "get"});
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

let socket = io(BACKEND_ADDRESS);
let listener = {};

socket.on('subscriptionMessage', (message) => {
    let p = JSON.parse(message);
    if (listener[p.id]) {
        listener[p.id](p);
    }
});

let historicalDataProvider = {
    supportsRequest: function (domainObject) {
        return domainObject.type === 'sensor';
    },
    request: function (domainObject, options) {
        return fetchData(domainObject.identifier.key, options)
            .then(function (response) {
                return response
            });
    },
    supportsSubscribe: function (domainObject, callback, options) {
        return domainObject.hasOwnProperty('isSubscribable') &&
            domainObject.isSubscribable === true
    },
    subscribe: function (domainObject, callback, options) {
        listener[domainObject.identifier.key] = callback;
        socket.emit('subscribe', domainObject.identifier.key);
        return function unsubscribe() {
            delete listener[domainObject.identifier.key];
            socket.emit('unsubscribe', domainObject.identifier.key);
        };

    }
};

let objectProvider = {
    get: function (identifier) {
        return getObject(identifier.key).then(function (result) {
            result.identifier = identifier;
            return result
        });
    }
};


let compositionProvider = {
    appliesTo: function (domainObject) {
        return domainObject.identifier.namespace.includes('sm.')
            && domainObject.hasOwnProperty('hasComposition')
            && domainObject['hasComposition'] === true;
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


    function MongoTelemetryPlugin() {
        return function install(openmct) {
            if (installed) {
                return;
            }
            installed = true;

            openmct.objects.addRoot({
                namespace: 'sm.folder',
                key: '5dfb86ec9b98803e0cc078ea'
            });

            openmct.objects.addRoot({
                namespace: 'sm.folder',
                key: '5dfb902d9b98803e0cc078eb'
            });

            openmct.types.addType('sensor', {
                name: 'Sensor',
                description: 'Data source',
                cssClass: 'icon-telemetry'
            });

            openmct.types.addType('sm.sensor', {
                name: 'Sensor',
                description: 'Data source',
                cssClass: 'icon-telemetry'
            });

            let namespaces = ['sm.stationary_unit','sm.mobile_unit','sm.folder','sm.telemetry', 'sm.mission']
            for(let i of namespaces){
                openmct.objects.addProvider(i, objectProvider);
            }
            openmct.composition.addProvider(compositionProvider);

            openmct.telemetry.addProvider(historicalDataProvider);


        };
    }

    return MongoTelemetryPlugin;
});
