const logger = require('winston');
const Promise = require("bluebird");

const Hex = require('./hex.js');
const Int = require('./int.js');
const Ref = require('./ref.js');

var cachedProperties = [];

class GameState {
    constructor() {}

    init(driver, scripts) {
        var resolver = Promise.defer();
        this._driver = driver;

        driver.init().then(function() {
            resolver.resolve(true);
        }).catch(function(err) {
            resolver.reject(err);
        });

        return resolver.promise;
    }

    getAllProperties() {
        var self = this;
        if (cachedProperties.length == 0) {
            function walk_object(object) {
                for (var child in object) {
                    if (object.hasOwnProperty(child)) {
                        if (typeof object[child] == "object") {
                            if (object[child].address != null) {
                                cachedProperties.push(object[child]);
                            } else {
                                walk_object(object[child]);
                            }
                        }
                    }
                }
            }
            walk_object(this);
        }

        return Promise.map(cachedProperties, function(property) {
            if (property.get == undefined) {
                return null;
            }
            return property.get().then(function(result) {
                if (result.hex.length == 1) {
                    property.hex = result.hex[0];
                } else {
                    property.hex = result.hex;
                }
                property.value = result.value;
            }).catch(function(ex) {
                Promise.reject(ex);
            });
        }).then(function() {
            Promise.resolve(true);
        }).catch(function(err) {
            logger.error(err);
        });
    }
}

module.exports = GameState;
