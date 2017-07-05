const Promise = require("bluebird");

const Hex = require('./hex.js');

class BitArray extends Hex {
    constructor(gameState, address, length = 1) {
        super(gameState, address, length);
    }

    get() {
      var resolver = Promise.defer();
      var thisref = this;
      this.getHex().then(function(hex) {
        var result = [];

        for (let x = 0; x < hex.length; x++) {
            const value = parseInt(hex[x], 16);
            for (let i = 0; i < 8; i++) {
                result[x * 8 + i] = (value >> i & 0x1) == 1 ? true : false;
            }
        }

        resolver.resolve({
            hex: hex,
            value: result
        });
      }).catch(function(ex) {
          resolver.reject(ex);
      });
      return resolver.promise;
    }
}

module.exports = BitArray;
