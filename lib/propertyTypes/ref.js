var logger = require('winston');
var Promise = require("bluebird");

var Hex = require('./hex.js');

class Ref extends Hex {
    constructor(gameState, address, length = 1, dict) {
        super(gameState, address, length);
        if (dict == null) { logger.warn(`${address.toString(16)} does not have a dictionary declared!`); }
        this._dictionary = dict;
    }

    get() {
        var resolver = Promise.defer();
        var self = this;
        this.getHex().then(function(hex) {
            /*
              This forEach works for both object and string references.
              If the length is one - just return a single reference value.
              If the length is greater than one - return a concatenation.
              This just happens to work well for strings!
            */

            if (self._dictionary == null) {
              logger.warn(`${self.address.toString(16)} does not have a dictionary declared!`);
              resolver.resolve({ hex: hex });
            }

            var result = [];
            var break_loop = false;
            hex.forEach(function(hex) {
                if (break_loop == true) {
                    return;
                }
                if (hex in self._dictionary) {
                    var reference = self._dictionary[hex.toString(16)];
                    if (reference != null) {
                        // Found a reference for that HEX value in the dictionary.
                        result.push(reference);
                    } else {
                        // We have encountered a null, which stops the loop.
                        break_loop = true;
                    }
                } else {
                    logger.warn(`Cannot find a matching item in the dictionary for hex ${hex.toString(16)} at address ${self.address.toString(16)}.`);
                }
            });

            let value = null;
            if (hex.length == 1) {
                value = result[0];
            } else {
                value = result.join('');
            }

            resolver.resolve({
                hex: hex,
                value: value
            });
        }).catch(function(ex) {
            resolver.reject(ex);
        });
        return resolver.promise;
    }
}

module.exports = Ref;
