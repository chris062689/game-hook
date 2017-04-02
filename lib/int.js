const Promise = require("bluebird");

const Hex = require('./hex.js');

class Ref extends Hex {
    constructor(gameState, address, length = 1) {
        super(gameState, address, length);
    }

    toJSON() {
        return {
            address: (this.address == null ? null : this.address.toString(16)),
            hex: this.hex,
            value: this.value
        };
    }

    get() {
      var resolver = Promise.defer();
      this.getHex().then(function(hex) {
          if (hex.length == 1) {
            resolver.resolve({
                hex: hex,
                value: parseInt(hex, 16)
            });
          } else {
            resolver.resolve({
                hex: hex,
                value: parseInt(hex.join(''), 16)
            });
          }
      }).catch(function(ex) {
          resolver.reject(ex);
      });
      return resolver.promise;
    }
}

module.exports = Ref;
